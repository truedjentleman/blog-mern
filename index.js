import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

// Validation rule
import { loginValidation, registerValidation, postCreateValidation } from './validations.js';

// CheckAuth
import checkAuth from './utils/checkAuth.js';

// Controllers
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

//* connect to MongoDB aтв catch the errors if occurred
mongoose
	.connect(
		'mongodb+srv://admin:qwerty123@cluster0.7a9jt.mongodb.net/blog?retryWrites=true&w=majority'
	)
	.then(() => console.log('MongoDB connected'))
	.catch((error) => console.log('DB error:', error));

//* initialize Express server 
const app = express();

//* to enable JSON read from requests
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
const upload = multer({ storage })


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
    url: `/uploads/${req.file.originalname}`
  })
})


//? POST request for registration with validation - send validation function as a second parameter
app.post('/auth/register', registerValidation, UserController.registration);

//? POST request for login
app.post('/auth/login', UserController.login);

//? GET the info about ME (logged in user ), and check if user authorized (checkAuth as a second parameter) before sending GET request
//? checkAuth is deciding wether is (req,res) should be invoked - the request won't be send unless 'checkAuth' returns result
app.get('/auth/me', checkAuth, UserController.getMe);


//? GET all posts
app.get('/posts', PostController.getAll);

//? GET post by ID and update views count
app.get('/posts/:id', PostController.getOne);

//? Create Post
app.post('/posts', checkAuth, postCreateValidation, PostController.postCreate);

//? Delete Post - only author can do this - deletion protected by 'checkAuth'
app.delete('/posts/:id', checkAuth, PostController.postRemove);

//? Update Post
app.patch('/posts/:id', checkAuth, PostController.postUpdate);



//* Server listener on port 4444
app.listen(4444, (err) => {
	// running server
	if (err) {
		return console.log(err);
	}
	return console.log('Server is running on port 4444');
});
