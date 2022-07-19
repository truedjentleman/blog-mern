import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

// create thunk with name '/auth/fetchUserData' and async action
export const fetchAuth = createAsyncThunk('/auth/fetchAuth', async (params) => {
	// create POST request with auth data (login, password) to backend,
	// backend return its response and if all good it will be saved to REDUX store
	//* params object (with login and pass) to be used within async action - will pass them to request
	const { data } = await axios.post('/auth/login', params);
	console.log(data);
	return data;
});

// USER DATA
const initialState = {
	data: null, // initial value of user info
	status: 'loading',
};

const authSlice = createSlice({
	name: 'auth',
	initialState,

	// to get user info from async action and then save to state (store)
	extraReducers: {
		// if request(action) state is 'pending' in Redux
		[fetchAuth.pending]: (state) => {
			// set state.data to null - reset all posts
			state.data = null;
			// we update state.status to 'loading'
			state.status = 'loading';
		},
		// if request(action) state is 'fulfilled' in Redux
		[fetchAuth.fulfilled]: (state, action) => {
			// update state.data with value from action payload (redux toolkit to control correctness)
			state.data = action.payload;
			// we update  state.status to 'loaded'
			state.status = 'loaded';
		},
		// if request(action) state is 'rejected' in Redux - error occurred
		[fetchAuth.rejected]: (state) => {
			// set state.data to null - reset all posts
			state.data = null;
			// we update state.status to 'loaded'
			state.status = 'error';
		},
	},
});

export const authReducer = authSlice.reducer;
