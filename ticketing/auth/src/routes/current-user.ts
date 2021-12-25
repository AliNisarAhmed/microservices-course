import express from 'express';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
	return res.json("Hi there")
});

export { router as currentUserRouter };
