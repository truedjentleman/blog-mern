import { validationResult } from 'express-validator';

//*  middleware for handling Validation errors for  Users and Posts
//* if during validation any validation error occurred, further request won't be execut

export default (req, res, next) => {
	const errors = validationResult(req); // get all errors occurred during the validation
	console.log(errors);
	if (!errors.isEmpty()) {
		// if there is/are error - return server status '400' and json with these errors
		return res.status(400).json(errors.array());
	}
	next();
};
