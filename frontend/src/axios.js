import axios from 'axios';

// create axios wrapper
const instance = axios.create({
	// set the base url in order not to insert it each time we add path to axios requests
	baseURL: 'http://localhost:4444',
});

export default instance;
