import { NotAuthorizedError, NotFoundError, requireAuth } from '@microservices-course-ali/common';
import express, { Request, Response } from 'express';

import { Order } from '../models/order';

const router = express.Router();

// Could add validation to check that a valid mongo id is provided in request params
router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
	const { orderId } = req.params;
	const order = await Order.findById(orderId).populate('ticket');

	if (!order) {
		return new NotFoundError();
	}

	if (order.userId !== req.currentUser!.id) {
		return new NotAuthorizedError();
	}

	return res.json(order);
});

export { router as showOrderRouter };
