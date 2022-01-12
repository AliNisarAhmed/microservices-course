import { Publisher, Subjects, TicketCreatedEvent } from "@microservices-course-ali/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated;
}