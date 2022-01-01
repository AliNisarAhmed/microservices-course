import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
	console.log(' I am in the component', currentUser);

	return currentUser ? (
		<h1>You are signed in as: {currentUser.email}</h1>
	) : (
		<h1>You are not signed in</h1>
	);
};

LandingPage.getInitialProps = async (context) => {
	console.log('LANDING PAGE', !!context.req);
	const client = buildClient(context);

	const {
		data: { currentUser },
	} = await client.get('/api/users/currentuser');

	return { currentUser };
};

export default LandingPage;
