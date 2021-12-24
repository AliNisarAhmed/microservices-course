import express from 'express';

const app = express();

app.use(express.json());

app.get('/api/users/currentuser', (req, res) => {
	return res.json('Hi There');
});

app.listen(3000, () => {
	console.log('Auth Service Listening on 3000!');
});
