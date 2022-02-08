import { useState } from 'react';

const NewTicket = () => {
	const [title, setTitle] = useState('');
	const [price, setPrice] = useState('');

	return (
		<div>
			<h1>Create a Ticket</h1>
			<form>
				<div className="form-group">
					<label htmlFor="title">Title</label>
					<input
						id="title"
						className="form-control"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="">Price</label>
					<input
						id="price"
						className="form-control"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						onBlur={onBlur}
					/>
				</div>
				<button className="btn btn-primary">Submit</button>
			</form>
		</div>
	);

	function onBlur() {
		const value = parseFloat(price);
		if (Number.isNaN(value)) {
			return;
		}

		setPrice(value.toFixed(2));
	}
};

export default NewTicket;
