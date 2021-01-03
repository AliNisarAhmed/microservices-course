const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:postId/comments', (req, res) => {
	res.send(commentsByPostId[req.params.postId] || []);
});

app.post('/posts/:postId/comments', async (req, res) => {
	const commentId = randomBytes(4).toString('hex');
	const { content } = req.body;
	const { postId } = req.params;

	const comments = commentsByPostId[postId] || [];
	comments.push({ id: commentId, content, status: 'pending' });
	commentsByPostId[postId] = comments;

	console.log('Comment Created');

	await axios.post('http://localhost:4005/events', {
		type: 'CommentCreated',
		data: {
			id: commentId,
			content,
			postId,
			status: 'pending'
		},
	});

	res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
	const {type, data} = req.body;
	const { postId, id, status, content } = data;

	console.log('Received Event in Comment Service', type);

	if (type === 'CommentModerated') {
		const comments = commentsByPostId[postId];
		const comment = comments.find(c => c.id === id);
		comment.status = status;

		await axios.post('http://localhost:4005/events', {
			type: 'CommentUpdated',
			data
		})
	}

	res.send({});
});

app.listen(4001, () => {
	console.log('listening on 4001');
});
