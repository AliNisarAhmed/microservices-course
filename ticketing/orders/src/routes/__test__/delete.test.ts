import { OrderStatus } from '@microservices-course-ali/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled', async () => {
	// create a ticket
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20,
	});
	await ticket.save();

	const user = global.signin();

	// make a request to create an order for the above ticket
	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticket.id })
		.expect(201);

	// make a request to cancel the order

	await request(app)
		.delete(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.send({ ticketId: ticket.id });

	const { body: updatedOrder } = await request(app)
		.get(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.send()
		.expect(200);

	// expect
	expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);
});

it('emits an event to announce order cancellation', async () => {
	const ticket = Ticket.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20,
	});
	await ticket.save();

	const user = global.signin();

	// make a request to create an order for the above ticket
	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticket.id })
		.expect(201);

	// make a request to cancel the order

	await request(app)
		.delete(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.send({ ticketId: ticket.id });

	const { body: updatedOrder } = await request(app)
		.get(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.send()
		.expect(200);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
