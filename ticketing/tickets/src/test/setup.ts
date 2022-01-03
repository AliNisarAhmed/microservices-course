import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

// creating a global auth function for ease of access, can also be defined in a module
declare global {
	var signin: () => Promise<string[]>;
}

global.signin = async () => {
	const email = 'test@test.com';
	const password = 'password';

	const response = await request(app)
		.post('/api/users/signup')
		.send({ email, password })
		.expect(201);

	const cookie = response.get('Set-Cookie');

	return cookie;
};

// ====

let mongo: MongoMemoryServer;

beforeAll(async () => {
	process.env.JWT_KEY = 'asdf';

	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();

	await mongoose.connect(mongoUri);
});

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongo.stop();
	await mongoose.connection.close();
});
