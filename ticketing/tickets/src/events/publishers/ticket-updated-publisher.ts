import { Publisher, Subjects, TicketUpdatedEvent } from '@microservices-course-ali/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
}
