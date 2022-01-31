import { Listener, OrderCreatedEvent, Subjects } from '@microservices-course-ali/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
	queueGroupName = queueGroupName;

	// on OrderCreatedEvent
	// Store the order in the local db
	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		const order = Order.build({
			id: data.id,
			price: data.ticket.price,
			status: data.status,
			userId: data.userId,
			version: data.version,
		});

		await order.save();

		msg.ack();
	}
}
