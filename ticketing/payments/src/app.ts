import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { currentUser, errorHandler, NotFoundError } from '@microservices-course-ali/common';

const app = express();

// so that express trusts our nginx set up
app.set('trust proxy', true);

app.use(express.json());

app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== 'test',
	})
);

app.use(currentUser);

app.use(errorHandler);

app.all('*', () => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
