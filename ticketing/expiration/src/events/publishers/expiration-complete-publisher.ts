import { Subjects, Publisher, ExpirationCompleteEvent } from '@microservices-course-ali/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	readonly subject = Subjects.ExpirationComplete;
}
