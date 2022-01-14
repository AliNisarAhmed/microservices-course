import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@microservices-course-ali/common';

import { body } from 'express-validator';
import mongoose from 'mongoose';

const router = express.Router();

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
		return res.json({});
	}
);

export { router as newOrderRouter };
