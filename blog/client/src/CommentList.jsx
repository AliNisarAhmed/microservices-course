import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentList = ({ postId }) => {
	const [comments, setComments] = useState([]);

	useEffect(() => {
		fetchComments();

		async function fetchComments() {
			const res = await axios.get(
				`http://localhost:4001/posts/${postId}/comments`
			);
			setComments(res.data);
		}
	}, []);

	if (comments.length === 0) {
		return <div>No Comments yet...</div>;
	}

	return (
		<div>
			<ul>
				{comments.map((comment) => (
					<li key={comment.id}>{comment.content}</li>
				))}
			</ul>
		</div>
	);
};

export default CommentList;
