import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Buffer } from 'buffer';

// creating a global auth function for ease of access, can also be defined in a module
declare global {
	var signin: () => string[];
}

global.signin = () => {
	// Build a JWT payload { id, email }
	const payload = {
		id: new mongoose.Types.ObjectId().toHexString(),
		email: 'test@test.com',
	};

	// Create the JWT
	const token = jwt.sign(payload, process.env.JWT_KEY!);

	// build a session object { jwt: MY_JWT }
	const session = { jwt: token };

	// turn that session into JSON
	const sessionJSON = JSON.stringify(session);

	// take JSON and encode it as base64
	const base64 = Buffer.from(sessionJSON).toString('base64');

	// return a string/cookie
	return [`session=${base64}`];
};

// ====

jest.mock('../nats-wrapper');

let mongo: MongoMemoryServer;

beforeAll(async () => {
	process.env.JWT_KEY = 'asdf';

	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();

	await mongoose.connect(mongoUri);
});

beforeEach(async () => {
	jest.clearAllMocks();

	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongo.stop();
	await mongoose.connection.close();
});
