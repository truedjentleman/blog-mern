//* authentication validation
import { body } from 'express-validator';

export const loginValidation = [
	body('email', 'Incorrect email format').isEmail(), // check if 'email' is 'EMAIL'
	body('password', 'Password length should greater than 5 characters').isLength({ min: 6 }), // check if 'password' length not less then 6 characters
];

export const registerValidation = [
	body('email', 'Incorrect email format').isEmail(),
	body('password', 'Password length should be greater than 5 characters').isLength({ min: 6 }),
	body('fullName', 'Full name length should be greater than 2 characters').isLength({ min: 3 }),
	body('avatarUrl', 'It is not an URL').optional().isURL(),
];

export const postCreateValidation = [
	body('title', 'Enter the post title, at least 3 characters').isLength({ min: 3 }).isString(),
	body('text', 'Post content length should be greater than 3 characters').isLength({ min: 4 }).isString(),
	body('tags', 'Incorrect tags format. Add an array').optional().isArray(),
	body('imageUrl', 'It is not an URL').optional().isString(),
];