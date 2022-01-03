import mongoose from 'mongoose';

import { app } from './app';

async function start() {
	if (!process.env.JWT_KEY) {
		throw new Error('Tickets Service: JWT_KEY must be defined');
	}

	if (!process.env.MONGO_URI) {
		throw new Error('Tickets Service: MONGO_URI must be defined');
	}

	try {
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
