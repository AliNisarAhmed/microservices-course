import axios from 'axios';
import { useState } from 'react';

export default ({ url, method = 'get', body = {}, onSuccess = () => {} }) => {
	const [errors, setErrors] = useState(null);

	const doRequest = async () => {
		try {
			setErrors(null);
			const res = await axios[method](url, body);
			onSuccess(res.data);
		} catch (error) {
			setErrors(
				<div className="alert alert-danger">
					<h4>Ooops...</h4>
					<ul className="my-0">
						{error.response.data.errors.map((err) => (
							<li key={err.message}>{err.message}</li>
						))}
					</ul>
				</div>
			);
		}
	};

	return { doRequest, errors };
};
