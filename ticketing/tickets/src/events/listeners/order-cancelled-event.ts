import {
	Listener,
	OrderCancelledEvent,
	OrderStatus,
	Subjects,
} from '@microservices-course-ali/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
	queueGroupName = queueGroupName;

	// on OrderCancelledEvent:
	// remove the orderId from the ticket in local db
	// and publish a TicketUpdatedEvent
	async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
		const ticket = await Ticket.findById(data.ticket.id);

		if (!ticket) {
			throw new Error('Ticket not found');
		}

		ticket.set({ orderId: undefined });

		await ticket.save();

		new TicketUpdatedPublisher(this.client).publish({
			id: ticket.id,
			title: ticket.title,
			price: ticket.price,
			userId: ticket.userId,
			version: ticket.version,
			orderId: data.id,
		});

		msg.ack();
	}
}
