import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'ajjsdndgf',
			price: '20',
		})
		.expect(404);
});
it('returns a 401 if the user is not authenticated', async () => {
	const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
		title: 'first ticket',
		price: '20',
	});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.send({
			title: 'updated',
			price: '30',
		})
		.expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
	const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
		title: 'first ticket',
		price: '20',
	});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'updated',
			price: '30',
		})
		.expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
	const cookie = global.signin();
	const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
		title: 'first ticket',
		price: '20',
	});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: '',
			price: '30',
		})
		.expect(400);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: '',
			price: '-10',
		})
		.expect(400);
});

it('updates the ticket provided valid input', async () => {
	const cookie = global.signin();
	const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
		title: 'first ticket',
		price: '20',
	});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'updated title',
			price: '100',
		})
		.expect(200);

	const updatedTicket = await request(app).get(`/api/tickets/${response.body.id}`);

	expect(updatedTicket.body.title).toEqual('updated title');
	expect(updatedTicket.body.price).toEqual('100');
});

it('publishes an event', async () => {
	const cookie = global.signin();
	const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
		title: 'first ticket',
		price: '20',
	});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'updated title',
			price: '100',
		})
		.expect(200);

	const updatedTicket = await request(app).get(`/api/tickets/${response.body.id}`);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
