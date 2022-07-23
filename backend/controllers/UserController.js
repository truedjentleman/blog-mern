import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// import user schema
import UserModel from '../models/User.js';

export const registration = async (req, res) => {
	try {
		// encrypt password form req.body
		const password = req.body.password;
		const salt = await bcrypt.genSalt(10); // create encryption Salt - algorithm
		const hash = await bcrypt.hash(password, salt); // hash the password with salt

		// prepare document for User
		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash,
		});
		// create and save user to DB
		const user = await doc.save();

		// create token for _id returned from DB
		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d', // TTL of token
			}
		);

		// destructure 'user', to extract 'passwordHash', and save the rest to 'userData'
		// in order do not to sent user's 'passwordHash' to user in response, although it's saved in DB
		const { passwordHash, ...userData } = user._doc;

		res.json({
			// if there are no errors during validation - return 'success: true' and user info
			success: true,
			...userData,
			token,
		});
	} catch (error) {
		console.error(error); // not sending errors to user, just console it
		res.status(500).json({
			// send server res 500 and message to user
			success: false,
			message: 'Invalid registration',
		});
	}
};

export const login = async (req, res) => {
	try {
		//to find user in MongoDB by email
		const user = await UserModel.findOne({ email: req.body.email });

		// if there is no user with specified email
		if (!user) {
			return res.status(404).json({
				message: 'Incorrect login',
			});
		}

		// if user exists - compare the password from user with password hash in DB
		const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
		// if password is incorrect
		if (!isValidPass) {
			return res.status(400).json({
				message: 'Incorrect login or password',
			});
		}

		// if login(email) and password are correct create new token for _id returned from DB
		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123', //? secret to encode/decode token
			{
				expiresIn: '30d', // TTL of token
			}
		);

		// destructure 'user', to extract 'passwordHash', and save the rest to 'userData'
		// in order do not to sent user's 'passwordHash' to user in response, although it's saved in DB
		const { passwordHash, ...userData } = user._doc;

		res.json({
			// if there are no errors during validation - return 'success: true' and user info
			success: true,
			...userData,
			token, // add token to user object returned to client
		});
	} catch (error) {
		console.error(error); // not sending errors to user, just console it
		res.status(500).json({
			// send server res 500 and message to user
			success: false,
			message: 'Authorization failed',
		});
	}
};

export const getMe = async (req, res) => {
	// console.log(checkAuth);  // do not return anything before next() executed   - DEBUG
	try {
		const user = await UserModel.findById(req.userId); //  to find in DB (UserModal) user with ID from 'req.userId' which is the result of 'checkAuth' execution

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// destructure 'user', to extract 'passwordHash', aтв save the rest to 'userData'
		// in order do not to sent user's 'passwordHash' to user in response, although it's saved in DB
		const { passwordHash, ...userData } = user._doc;

		res.json({
			// if there are no errors during validation - return 'success: true' and user info
			success: true,
			...userData,
		});
	} catch (error) {
		console.error(error); // not sending errors to user, just console it
		res.status(500).json({
			// send server res 500 and message to user
			success: false,
			message: 'No Access to Data Base',
		});
	}
};

export const loginCheck = (req, res) => {
	console.log(req.body); // DEBUG

	// generate token with data to be encode AND the key as a second parameter
	// key can be ony
	const token = jwt.sign(
		{
			email: req.body.email, // email from req.body which is come from client (front)
			fullName: 'John Doe',
		},
		'secretToken'
	);

	res.json({
		success: true,
		token, // return token to client
	});
};
