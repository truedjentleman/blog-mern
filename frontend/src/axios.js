import axios from 'axios';

// create axios wrapper
const instance = axios.create({
	// set the base url in order not to insert it each time we add path to axios requests
	baseURL: 'http://localhost:4444',
});

//* Middleware to check if 'auth token' stored in local storage and if so pass it to any request
//* add 'toke' from LS to Axios config.headers.authorization
//* Backend based on gotten 'token' decide if user has access to chosen route
instance.interceptors.request.use((config) => {
	config.headers.authorization = window.localStorage.getItem('token');
	return config;
});

export default instance;
