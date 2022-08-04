import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

// POSTS SLICE

// create async action (request) 'posts/fetchPosts'  - send request to backend
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
	//extract data after request to url - baseURL/posts, baseURL is set in axios.js
	const { data } = await axios.get('/posts');
	return data;
});

// action(request) to get TAGS
export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
	//extract data after request to url - baseURL/posts, baseURL is set in axios.js
	const { data } = await axios.get('/tags');
	return data;
});

// action(request) to remove post
export const fetchRemovePost = createAsyncThunk(
	'posts/fetchRemovePost',
	async (id) => await axios.delete(`/posts/${id}`)
);

const initialState = {
	posts: {
		items: [],
		status: 'loading',
	},
	tags: {
		items: [],
		status: 'loading',
	},
	//TODO: add comments to Redux
	// comments: {

	// }
};

const postSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {
		// actions are declared here
	},
	//? extra reducers to catch states of async actions during requests
	extraReducers: {
		//* Getting Posts
		// if request(action) state is 'pending' in Redux
		[fetchPosts.pending]: (state) => {
			// set state.posts.items to [] - reset all posts
			state.posts.items = [];
			// we update state.posts.status to 'loading'
			state.posts.status = 'loading';
		},
		// if request(action) state is 'fulfilled' in Redux
		[fetchPosts.fulfilled]: (state, action) => {
			// update state.posts.items with value from action payload (redux toolkit to control correctness)
			state.posts.items = action.payload;
			// we update state.posts.status to 'loaded'
			state.posts.status = 'loaded';
		},
		// if request(action) state is 'rejected' in Redux - error occurred
		[fetchPosts.rejected]: (state) => {
			// set state.posts.items to [] - reset all posts
			state.posts.items = [];
			// we update state.posts.status to 'loaded'
			state.posts.status = 'error';
		},

		//* Getting Tags
		// action rules for TAGS
		[fetchTags.pending]: (state) => {
			state.tags.items = [];
			state.tags.status = 'loading';
		},
		[fetchTags.fulfilled]: (state, action) => {
			state.tags.items = action.payload;
			state.tags.status = 'loaded';
		},
		[fetchTags.rejected]: (state) => {
			state.tags.items = [];
			state.tags.status = 'error';
		},

		//* Deleting Post
		// action rules for POST deletion
		[fetchRemovePost.pending]: (state, action) => {
			// remove(filter) post from redux-store array, not waiting the response
			state.posts.items = state.posts.items.filter((obj) => obj._id !== action.meta.arg);
		},
		// no need in fulfilled stage as we're removing post on pending stage
		[fetchRemovePost.rejected]: (state) => {
			state.posts.status = 'error';
		},
	},
});

// Export 'reducer' function of postSlice state storage, to use in 'store.js'
export const postsReducer = postSlice.reducer;
