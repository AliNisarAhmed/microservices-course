import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

const PostList = () => {
	const [posts, setPosts] = useState(null);

	useEffect(() => {
		fetchPosts();

		async function fetchPosts() {
			const res = await axios.get('http://localhost:4000/posts');
			setPosts(res.data);
		}
	}, []);

	if (posts === null) {
		return <div>Loading...</div>;
	}

	if (Object.keys(posts).length === 0) {
		return <div>No Posts yet...</div>;
	}

	return (
		<div className="d-flex flex-row flex-wrap justify-content-between">
			{Object.values(posts).map((post) => (
				<div
					className="card"
					style={{ width: '30%', marginBottom: '20px' }}
					key={post.id}
				>
					<div className="card-body">
						<h3>{post.title}</h3>
						<CommentList postId={post.id} />
						<CommentCreate postId={post.id} />
					</div>
				</div>
			))}
		</div>
	);
};

export default PostList;
