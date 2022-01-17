import { Publisher, OrderCreatedEvent, Subjects } from "@microservices-course-ali/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
	readonly subject = Subjects.OrderCreated
}