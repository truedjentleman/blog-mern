import { configureStore } from '@reduxjs/toolkit';
import { postsReducer } from './slices/posts';

const store = configureStore({

    // define reducers, to be used in application, defined reducers to be used in 'useSelector' as state
	reducer: {
		posts: postsReducer,
	},
});

export default store;
