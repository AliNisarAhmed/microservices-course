import {
	ExpirationCompleteEvent,
	OrderStatus,
} from '@microservices-course-ali/common';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { Order } from '../../../models/order';

const setup = async () => {
	// create an instance of a listener
	const listener = new ExpirationCompleteListener(natsWrapper.client);

	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
		id: new mongoose.Types.ObjectId().toHexString(),
	});

	await ticket.save();

	const order = Order.build({
		userId: 'asdf',
		expiresAt: new Date(),
		ticket,
		status: OrderStatus.Created,
	});

	await order.save();

	// create a fake data event
	const data: ExpirationCompleteEvent['data'] = {
		orderId: order.id,
	};

	// create a fake message object
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg, ticket, order };
};

it('updates the order status to cancelled', async () => {
	const { listener, data, msg, order } = await setup();

	// call the onMessage function with data object + message object
	await listener.onMessage(data, msg);

	// write assertions
	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an OrderCancelled event', async () => {
	const { listener, data, msg, order } = await setup();

	await listener.onMessage(data, msg);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
	const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

	expect(eventData.id).toEqual(order.id);
});

it('acks the messaeg', async () => {
	const { listener, data, msg, order } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
