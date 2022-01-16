import express, { Request, Response } from 'express';
import {
	NotAuthorizedError,
	NotFoundError,
	OrderStatus,
	requireAuth,
} from '@microservices-course-ali/common';
import { Order } from '../models/order';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
	const { orderId } = req.params;
	const order = await Order.findById(orderId);

	if (!order) {
		return new NotFoundError();
	}

	if (order.userId !== req.currentUser!.id) {
		return new NotAuthorizedError();
	}

	order.status = OrderStatus.Cancelled;

	await order.save();

	// Publish an event to inform others that an order was cancelled

	return res.json(order);
});

export { router as deleteOrderRouter };
