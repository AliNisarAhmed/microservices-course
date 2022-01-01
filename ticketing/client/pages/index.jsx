import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
	console.log(' I am in the component', currentUser);

	return currentUser ? <h1>You are signed in</h1> : <h1>You are not signed in</h1>;
};

export async function getServerSideProps(context) {
	console.log('getServerSideProps executed------');

	const client = buildClient(context);

	const {
		data: { currentUser },
	} = await client.get('/api/users/currentuser');

	return { props: { currentUser } };
}

export default LandingPage;
