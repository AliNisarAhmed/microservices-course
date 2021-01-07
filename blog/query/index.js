const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
	if (type === 'PostCreated') {
		const { id, title } = data;
		posts[id] = { id, title, comments: [] };
	}

	if (type === 'CommentCreated') {
		const { id, content, postId, status } = data;
		posts[postId].comments.push({ id, content, status });
	}

	if (type === 'CommentUpdated') {
		const { postId, ...newComment } = data;
		posts[postId].comments = posts[postId].comments.map((c) =>
			c.id === newComment.id ? newComment : c
		);
	}
};

app.get('/posts', (req, res) => {
	res.send(posts);
});

app.post('/events', (req, res) => {
	const { type, data } = req.body;

	handleEvent(type, data);

	console.log('Posts: ', posts);

	res.send({});
});

app.listen(4002, async () => {
	console.log('Query Service listening on port 4002');

	try {
		const res = await axios.get('http://localhost:4005/events');

		for (let event of res.data) {
			console.log('Processing event: ', event.type);
			handleEvent(event.type, event.data);
		}
	} catch (error) {

	}
});
