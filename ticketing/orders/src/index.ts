import mongoose from 'mongoose';

import { natsWrapper } from './nats-wrapper';

import { app } from './app';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { TicketCreatedListener } from './events/listeners/ticket-created-event';

async function start() {
	if (!process.env.JWT_KEY) {
		throw new Error('Tickets Service: JWT_KEY must be defined');
	}

	if (!process.env.MONGO_URI) {
		throw new Error('Tickets Service: MONGO_URI must be defined');
	}
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
		process.on('SIGTERM', () => {
			natsWrapper.client.close;
		});

		new TicketCreatedListener(natsWrapper.client).listen();
		new TicketUpdatedListener(natsWrapper.client).listen();

		await mongoose.connect(process.env.MONGO_URI!);
		console.log('Tickets Service: Connected to Mongodb');
	} catch (error) {
		console.error(error);
	}

	app.listen(3000, () => {
		console.log('Tickets Service Listening on 3000!');
	});
}

start();
