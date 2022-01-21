import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@microservices-course-ali/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
	queueGroupName = queueGroupName;

	async onMessage(event: TicketUpdatedEvent['data'], msg: Message) {
		const ticket = await Ticket.findByEvent(event);

		if (!ticket) {
			throw new Error('Ticket not found');
		}

		ticket.set({ title: event.title, price: event.price });
		await ticket.save();

		msg.ack();
	}
}
