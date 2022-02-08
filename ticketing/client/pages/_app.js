import 'bootstrap/dist/css/bootstrap.css';

import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
	console.log('pageProps: ', pageProps);
	return (
		<div>
			<Header currentUser={currentUser} />
			<div className="container">
				<Component currentUser={currentUser} {...pageProps} />
			</div>
		</div>
	);
};

AppComponent.getInitialProps = async (appContext) => {
	console.log('APP COMPONENT', !!appContext.ctx.req);
	const client = buildClient(appContext.ctx);

	const {
		data: { currentUser },
	} = await client.get('/api/users/currentuser');

	let pageProps = {};

	if (appContext?.Component.getInitialProps) {
		pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, currentUser);
	}

	return { currentUser, pageProps };
};

export default AppComponent;
