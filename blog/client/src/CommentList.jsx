import React from 'react';

const CommentList = ({ comments }) => {
	if (comments.length === 0) {
		return <div>No Comments yet...</div>;
	}


	return (
		<div>
			<ul>
				{comments.map((comment) => (
					<li key={comment.id}>{getCommentContent(comment)}</li>
				))}
			</ul>
		</div>
	);

	function getCommentContent(comment) {
		if (comment.status === 'approved') {
			return comment.content;
		}

		if (comment.status === 'pending') {
			return <em>This comment is pending moderation</em>
		}

		if (comment.status === 'rejected') {
			return <em>This comment has been rejected</em>
		}
	}
};

export default CommentList;
