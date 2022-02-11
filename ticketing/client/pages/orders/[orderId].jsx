import { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/useRequest';

const OrderShow = ({ order, currentUser }) => {
	const [timeLeft, setTimeLeft] = useState(0);
	const { doRequest, errors } = useRequest({
		url: '/api/payments',
		method: 'post',
		body: {
			orderId: order.id,
		},
		onSuccess: () => Router.push(),
	});

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

	return (
		<div className="">
			Time left to pay: {timeLeft}
			<StripeCheckout
				token={({ id }) => doRequest({ token: id })}
				// Move this to env variable
				stripeKey="pk_test_51KQ2A7AMMZu4Uf9zTwq1w90ZqHkmYxjZ0Hwohm41OZjX7j1O1cU6izBAg7JiCwKypHabGx14tpsErs8Ryg6Vo3dc00BEKSlPHS"
				amount={order.price * 100}
				email={currentUser.email}
				currency={order.currency}
			/>
			{errors}
		</div>
	);
};

OrderShow.getInitialProps = async (context, client) => {
	const { orderId } = context.query;
	console.log('🚀 ~ file: [orderId].jsx ~ line 25 ~ OrderShow.getIntialProps= ~ orderId', orderId);
	const { data } = await client.get(`/api/orders/${orderId}`);
	return { order: data };
};

export default OrderShow;
