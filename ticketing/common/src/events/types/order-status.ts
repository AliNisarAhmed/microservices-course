export enum OrderStatus {
	// When the order has been created, but the ticket it is trying to order has not been reserved
	Created = 'created',
	// The ticket the order is trying to reserve has already been reserved, or when the user has cancelled the order
	// or the order expiers before payment
	// Cancelled is catchall
	Cancelled = 'cancelled',
	// The order has successfully reserved the ticket
	AwaitingPayment = 'awaitingPayment',
	// the order has reserved the ticket and the user has provided payment successfully
	Complete = 'complete',
}