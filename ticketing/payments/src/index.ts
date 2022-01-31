import mongoose from 'mongoose';

import { natsWrapper } from './nats-wrapper';

import { app } from './app';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

async function start() {
	if (!process.env.JWT_KEY) {
		throw new Error('Payments Service: JWT_KEY must be defined');
	}

	if (!process.env.MONGO_URI) {
		throw new Error('Payments Service: MONGO_URI must be defined');
	}
	if (!process.env.NATS_URL) {
		throw new Error('Payments Service: NATS_URL must be defined');
	}
	if (!process.env.NATS_CLUSTER_ID) {
		throw new Error('Payments Service: NATS_CLUSTER_ID must be defined');
	}
	if (!process.env.NATS_CLIENT_ID) {
		throw new Error('Payments Service: NATS_CLIENT_ID must be defined');
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
		process.on('SIGNTER', () => {
			natsWrapper.client.close;
		});

		new OrderCreatedListener(natsWrapper.client).listen();
		new OrderCancelledListener(natsWrapper.client).listen();

		await mongoose.connect(process.env.MONGO_URI!);
		console.log('Payments Service: Connected to Mongodb');
	} catch (error) {
		console.error(error);
	}

	app.listen(3000, () => {
		console.log('Payments Service Listening on 3000!');
	});
}

start();
