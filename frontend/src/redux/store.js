import { configureStore } from '@reduxjs/toolkit';
import { postsReducer } from './slices/posts';
import { authReducer } from './slices/auth';

const store = configureStore({

    // define reducers, to be used in application, defined reducers to be used in 'useSelector' as state
	reducer: {
		posts: postsReducer,
		auth: authReducer,
	},
});

export default store;
