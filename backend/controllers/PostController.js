import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
	try {
		//* find ALL posts and connect 'PostModel' to 'UserModule' to get User data together with post - .populate('user').exec()
		const posts = await PostModel.find().populate('user').exec();

		res.json(posts); // return in response json with all posts
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Can not get posts',
		});
	}
};

export const getOne = async (req, res) => {

	try {
		//* extract parameter ':id' from requests
		const postId = req.params.id; // 'id' == the same var name as after ':', get it from frontend

		// To get post by _id and update 'viewsCount' - send as a second parameter to findOneAndUpdate '$inc: { viewsCount: 1 }'
		// to get post without update .findOne() or .findById(id) can be used
		PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				$inc: { viewsCount: 1 },
			},
			{
				returnDocument: 'after', // send updated 'viewsCount' back to DB
			},
			(err, doc) => {
				// function defines what to do after getting post and update, doc === post
				if (err) {
					console.error(error);
					return res.status(500).json({
						message: 'Can not get post',
					});
				}

				// if post not exists
				if (!doc) {
					return res.status(404).json({
						message: 'Post not found',
					});
				}

				// if post exists - just return updated post == doc
				res.json(doc);
			}
		);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Can not get posts',
		});
	}
};

export const postRemove = async (req, res) => {
	try {
		//* extract parameter ':id' from requests
		const postId = req.params.id; // 'id' == the same var name as after ':'

		// find post by '_id' and remove it
		PostModel.findOneAndDelete(
			{
				_id: postId,
			},
			(err, doc) => {
				// function defines what to do after finding and deleting post, doc === post
				if (err) {
					console.error(error);
					return res.status(500).json({
						message: 'Can not delete post',
					});
				}

				// if post not exists
				if (!doc) {
					return res.status(404).json({
						message: 'Post not found',
					});
				}

				// if post exists and it was deleted - just return 'success: true'
				res.json({
					success: true,
				});
			}
		);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Can not get posts',
		});
	}
};

export const postCreate = async (req, res) => {
	try {
		// prepare document for Post
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags,
			user: req.userId, // get from 'checkAuth' (based on auth bearer token), not from client-side
		});

		// create and save post to DB
		const post = await doc.save();

		// return post in response
		res.json(post);
	} catch (error) {
		console.error(error); // not sending errors to user, just console it
		res.status(500).json({
			// send server res 500 and message to user
			success: false,
			message: 'Post creation failed',
		});
	}
};

export const postUpdate = async (req, res) => {
	try {
		const postId = req.params.id; // 'id' == the same var name as after ':', get it from frontend

		// TODO:  postCreator can be retrieved from frontend together with :id (post object) and compared with currently authorized user, then no need in additional request
		//? route - '/posts/:id/:creator';  http://localhost:4444/posts/62c884b0fae758cb503eea88/62c83d9b2aeafad2aeeeee89
		//? const postCreator = req.params.creator


		// to get the post creator from Post and if requestor and creator are equal - post can be updated 
		const postCreator = (
			await PostModel.findOne({
				_id: postId,
			})
				.populate('user')
				.exec()
		).user._id;

		if (postCreator == req.userId) {
			// update based on _id, second parameter is the object of elements to be updated
			await PostModel.updateOne(
				{
					_id: postId,
				},
				{
					title: req.body.title,
					text: req.body.text,
					imageUrl: req.body.imageUrl,
					tags: req.body.tags,
					user: req.userId, // get from 'checkAuth' (based on auth bearer token), not from client-side
				}
			);

			res.json({ success: true });
		} else {
			res.status(500).json({ message: 'Not authorized to update post!' });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Post update failed' });
	}
};
