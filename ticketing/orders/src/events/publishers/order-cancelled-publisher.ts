import { Publisher, Subjects, OrderCancelledEvent } from '@microservices-course-ali/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
}
