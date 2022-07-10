import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

// Controllers
import { UserController, PostController } from './controllers/index.js';

// Validation rules
import { loginValidation, registerValidation, postCreateValidation } from './validations.js';

// Utils
import { checkAuth, handleValidationErrors } from './utils/index.js';

//* connect to MongoDB aтd catch the errors if occurred
mongoose
	.connect(
		'mongodb+srv://admin:qwerty123@cluster0.7a9jt.mongodb.net/blog?retryWrites=true&w=majority'
	)
	.then(() => console.log('MongoDB connected'))
	.catch((error) => console.log('DB error:', error));

//* initialize Express server
const app = express();

//* to enable JSON read from requests. Parses incoming JSON requests and puts the parsed data in 'req.body', otherwise 'req.body' is UNDEFINED
app.use(express.json());

//* Create storage for images
const storage = multer.diskStorage({
	// when the storage is creating 'destination' function should be executed, this function should tell that it's not getting any errors (null as a parameter of callback) and save files in folder 'uploads'
	// first two parameters are not used, so not named
	destination: (_, __, cb) => {
		cb(null, 'uploads');
	},
	// name the file - 'cb' extract form file its original name
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

//* to enable Multer in Express - initialize middleware
const upload = multer({ storage });

//* enable route to open files by URL directly from 'uploads' folder - express check if the specified file is in folder; return 404 if file not found
//* ex. 'http://localhost:4444/uploads/photo5327941952307574996.jpg'  - GET request for getting static file
app.use('/uploads', express.static('uploads'));

//? Initial blank route
app.get('/', (req, res) => {
	res.send('Get request successfully completed!');
});

//? basic login w/o DB
app.post('/auth/login-check', loginValidation, UserController.loginCheck);

//? if there is a request to '/upload' use multer middleware 'upload' and waiting in <Request Body> for property 'image' with some picture
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	// if all good (picture uploaded) return to client path to uploaded picture
	console.log(req.file);
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

//? POST request for registration with validation - send validation functions as a second and third parameters to validate and handle validation errors
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.registration);

//? POST request for login
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);

//? GET the info about ME (logged in user ), and check if user authorized (checkAuth as a second parameter) before sending GET request
//? checkAuth is deciding wether is (req,res) should be invoked - the request won't be send unless 'checkAuth' returns result
app.get('/auth/me', checkAuth, UserController.getMe);

//? GET all posts
app.get('/posts', PostController.getAll);

//? GET post by ID and update views count
app.get('/posts/:id', PostController.getOne);

//? Create Post (getting JSON post data for req.body from frontend)
app.post(
	'/posts',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.postCreate
);

//? Delete Post - only author can do this - deletion protected by 'checkAuth'
app.delete('/posts/:id', checkAuth, PostController.postRemove);

//? Update Post
app.patch('/posts/:id', checkAuth, postCreateValidation, PostController.postUpdate);

//* Server listener on port 4444
app.listen(4444, (err) => {
	// running server
	if (err) {
		return console.log(err);
	}
	return console.log('Server is running on port 4444');
});
