import { PaymentCreatedEvent, Publisher, Subjects } from '@microservices-course-ali/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated;
}
