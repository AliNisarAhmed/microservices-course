import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

const PostList = () => {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		fetchPosts();

		async function fetchPosts() {
			const res = await axios.get('http://posts.com/posts');
			setPosts(res.data);
		}
	}, []);

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
						<CommentList comments={post.comments} />
						<CommentCreate postId={post.id} />
					</div>
				</div>
			))}
		</div>
	);
};

export default PostList;
