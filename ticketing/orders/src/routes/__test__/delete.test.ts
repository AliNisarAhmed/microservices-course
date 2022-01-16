import { OrderStatus } from '@microservices-course-ali/common';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('marks an order as cancelled', async () => {
	// create a ticket
	const ticket = Ticket.build({ title: 'concert', price: 20 });
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

it.todo('emits an event to announce order cancellation');
