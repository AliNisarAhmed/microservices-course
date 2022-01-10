import { useState } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/useRequest';

const Signin = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const { doRequest, errors } = useRequest({
		url: '/api/users/signin',
		method: 'post',
		body: {
			email,
			password,
		},
		onSuccess: () => Router.push('/'),
	});

	return (
		<form onSubmit={onSubmit}>
			<h1>Sign In</h1>
			<div className="form-group">
				<label htmlFor="signup-email">Email Address</label>
				<input
					type="text"
					id="signup-email"
					className="form-control"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>
			<div className="from-group">
				<label htmlFor="signup-password">Password</label>
				<input
					type="password"
					className="form-control"
					id="signup-password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			{errors}
			<button className="btn btn-primary">Sign In</button>
		</form>
	);

	async function onSubmit(e) {
		e.preventDefault();

		doRequest();
	}
};

export default Signin;
