//* authentication validation
import { body } from 'express-validator'

export const registerValidation = [
     body('email', 'Incorrect email format' ).isEmail(),  // check if 'email' is 'EMAIL'
     body('password', 'Password length should greater than 5 characters').isLength({ min: 6 }), // check if 'password' length not less then 6 characters
     body('fullName', 'Full name length should greater then 2 characters').isLength({ min: 3 }),
     body('avatarUrl', 'It is not an URL').optional().isURL(), // avatar - is optional parameter, check for URL only if it's in request
] 