import express, { Request, Response } from 'express';
import {
	BadRequestError,
	NotFoundError,
	OrderStatus,
	requireAuth,
	validateRequest,
} from '@microservices-course-ali/common';
import mongoose from 'mongoose';

import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
	'/api/orders',
	body('ticketId')
		.not()
		.isEmpty()
		// this line below couples order service with ticket service
		// if ticket srv changes db, this line would fail
		.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
		.withMessage('TicketId must be provided'),
	async (req: Request, res: Response) => {
		// Make sure the ticket exists in the database
		const { ticketId } = req.body;

		const ticket = await Ticket.findById(ticketId);

		if (!ticket) {
			throw new NotFoundError();
		}

		// Make sure the ticket is not already reserved
		const isReserved = await ticket.isReserved();

		if (isReserved) {
			throw new BadRequestError('Ticket already reserved');
		}

		// Calculate an expiration date for this order
		const expiration = new Date();
		expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

		// Build the order and save it to the database
		const order = Order.build({
			userId: req.currentUser!.id,
			status: OrderStatus.Created,
			expiresAt: expiration,
			ticket,
		});
		await order.save();

		// Publish an event saying that an order was created
		new OrderCreatedPublisher(natsWrapper.client).publish({
			id: order.id,
			status: order.status,
			userId: order.userId,
			expiresAt: order.expiresAt.toISOString(),
			ticket: {
				id: order.ticket.id,
				price: order.ticket.price,
			},
		});

		return res.status(201).json(order);
	}
);

export { router as newOrderRouter };
