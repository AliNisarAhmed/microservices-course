import { useState, useEffect } from 'react';

const OrderShow = ({ order }) => {
	const [timeLeft, setTimeLeft] = useState(0);

	useEffect(() => {
		findTimeLeft();
		const timerId = setInterval(findTimeLeft, 1000);

		function findTimeLeft() {
			const msLeft = new Date(order.expiresAt) - new Date();
			setTimeLeft(Math.round(msLeft / 1000));
		}

		return () => {
			clearInterval(timerId);
		};
	}, []);

	if (timeLeft < 0) {
		return <div>Order Expired</div>;
	}

	return <div className="">Time left to pay: {timeLeft}</div>;
};

OrderShow.getInitialProps = async (context, client) => {
	const { orderId } = context.query;
	console.log('🚀 ~ file: [orderId].jsx ~ line 25 ~ OrderShow.getIntialProps= ~ orderId', orderId);
	const { data } = await client.get(`/api/orders/${orderId}`);
	return { order: data };
};

export default OrderShow;
