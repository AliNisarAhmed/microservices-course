import React, { useState } from 'react';
import axios from 'axios';

const PostCreate = () => {
	const [title, setTitle] = useState('');

	return (
		<div>
			<form onSubmit={onSubmit}>
				<div className="form-group">
					<label>Title</label>
					<input
						className="form-control"
						onChange={(e) => setTitle(e.target.value)}
						value={title}
					/>
				</div>
				<button className="btn btn-primary">Create</button>
			</form>
		</div>
	);

	async function onSubmit(e) {
		e.preventDefault();
		await axios.post('http://localhost:4000/posts', {
			title,
		});
		setTitle('');
	}
};

export default PostCreate;
