import express, { Request, Response } from 'express';
import {
	NotAuthorizedError,
	NotFoundError,
	OrderStatus,
	requireAuth,
} from '@microservices-course-ali/common';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
	const { orderId } = req.params;
	const order = await Order.findById(orderId).populate('ticket');

	if (!order) {
		return new NotFoundError();
	}

	if (order.userId !== req.currentUser!.id) {
		return new NotAuthorizedError();
	}

	order.status = OrderStatus.Cancelled;

	await order.save();

	// Publish an event to inform others that an order was cancelled
	new OrderCancelledPublisher(natsWrapper.client).publish({
		id: order.id,
		version: order.version,
		ticket: {
			id: order.ticket.id,
		},
	});

	return res.json(order);
});

export { router as deleteOrderRouter };
