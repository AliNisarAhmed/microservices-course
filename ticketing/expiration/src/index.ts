import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';

async function start() {

	if (!process.env.NATS_URL) {
		throw new Error('Tickets Service: NATS_URL must be defined');
	}
	if (!process.env.NATS_CLUSTER_ID) {
		throw new Error('Tickets Service: NATS_CLUSTER_ID must be defined');
	}
	if (!process.env.NATS_CLIENT_ID) {
		throw new Error('Tickets Service: NATS_CLIENT_ID must be defined');
	}
	try {
		await natsWrapper.connect(
			process.env.NATS_CLUSTER_ID,
			process.env.NATS_CLIENT_ID,
			process.env.NATS_URL
		);

		natsWrapper.client.on('close', () => {
			console.log('NATS connection closed');
			process.exit();
		});

		process.on('SIGINT', () => {
			natsWrapper.client.close;
		});
		process.on('SIGNTERM', () => {
			natsWrapper.client.close;
		});

		new OrderCreatedListener(natsWrapper.client).listen();

	} catch (error) {
		console.error(error);
	}
}

start();
