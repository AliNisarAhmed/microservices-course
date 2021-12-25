import express from 'express';

const router = express.Router();

router.post('/api/users/signin', (req, res) => {
	return res.json("Hi there")
});

export { router as signinRouter };
