import mongoose from 'mongoose';

import { app } from './app';

async function start() {
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY must be defined');
	}

	try {
		await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
		console.log('Connected to Mongodb');
	} catch (error) {
		console.error(error);
	}

	app.listen(3000, () => {
		console.log('Auth Service Listening on 3000!');
	});
}

start();
