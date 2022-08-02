import jwt from 'jsonwebtoken';

//* to check whether user authorized - based on jwt token in request header from frontend (client side)
//* req - request from client, the same as in app.get('/auth/me'), res 'next' will be
export default (req, res, next) => {
	// when  request is coming from frontend - token is added to req.headers.authorization by frontend
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, ''); // from 'req.headers.authorization === auth Bearer token', delete 'Bearer' word in the beginning of token if it's there
	// console.log(req.headers.authorization); // DEBUG
	//res.send(token)   // Debug

	// if token exists in request we decode it, if not return the error status
	if (token) {
		try {
			const decodedToken = jwt.verify(token, 'secret123'); // decode with the same secret what was used for encode
			// console.log(decodedToken)  // Debug

			req.userId = decodedToken._id; // add decoded token to Request, to send it further to DB

			// if all good, call the 'next' function in order the 'try' block returned something, once next is called, the request will be send to DB
			next();
		} catch (error) {
			return res.status(403).json({ message: 'Access denied' });
		}
	} else {
		return res.status(403).json({ message: 'Access denied' });
	}
};
