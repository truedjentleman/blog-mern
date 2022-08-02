import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

// create thunk with name '/auth/fetchUserData' and async action - Login Request
export const fetchAuth = createAsyncThunk('/auth/fetchAuth', async (params) => {
	// create POST request with auth data (login, password) to backend,
	// backend return its response and if all good it will be saved to REDUX store
	//* params object (with login and pass) to be used within async action - will pass them to request
	const { data } = await axios.post('/auth/login', params);
	// console.log(data); // DEBUG
	return data;
});

// create thunk with name '/auth/fetchRegister' and async action - Registration request
export const fetchRegister = createAsyncThunk('/auth/fetchRegister', async (params) => {
	// create POST request with auth data (fullName, email, password) to backend,
	// backend return its response and if all good it will be saved to REDUX store
	//* params object (with login and pass) to be used within async action - will pass them to request
	const { data } = await axios.post('/auth/register', params);
	// console.log(data); // DEBUG
	return data;
});

// create thunk. send GET request to backend to check if user Authorized
export const fetchAuthMe = createAsyncThunk('/auth/fetchAuthMe', async () => {
	// auth info (token) from local Storage is automatically added to header by axios middleware
	// therefore 'params' argument is not required
	const { data } = await axios.get('/auth/me');
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

	// reducers with actions
	reducers: {
		// account logout action
		logout: (state) => {
			// console.log(state);   // DEBUG
			state.data = null;
		},
	},

	// to get user info from async action and then save to state (store)
	extraReducers: {
		// if request(action) state is 'pending' in Redux
		[fetchAuth.pending]: (state) => {
			// set state.data to null - reset user data
			state.data = null;
			// we update state.status to 'loading'
			state.status = 'loading';
		},
		// if request(action) state is 'fulfilled' in Redux
		[fetchAuth.fulfilled]: (state, action) => {
			// update state.data with value from action payload (redux toolkit to control correctness)
			state.data = action.payload; // USER object
			// we update  state.status to 'loaded'
			state.status = 'loaded';
		},
		// if request(action) state is 'rejected' in Redux - error occurred
		[fetchAuth.rejected]: (state) => {
			// set state.data to null - reset user data
			state.data = null;
			// we update state.status to 'loaded'
			state.status = 'error';
		},

		[fetchRegister.pending]: (state) => {
			// set state.data to null - reset user data
			state.data = null;
			// we update state.status to 'loading'
			state.status = 'loading';
		},
		// if request(action) state is 'fulfilled' in Redux
		[fetchRegister.fulfilled]: (state, action) => {
			// update state.data with value from action payload (redux toolkit to control correctness)
			state.data = action.payload; // USER object
			// we update  state.status to 'loaded'
			state.status = 'loaded';
		},
		// if request(action) state is 'rejected' in Redux - error occurred
		[fetchRegister.rejected]: (state) => {
			// set state.data to null - reset user data
			state.data = null;
			// we update state.status to 'loaded'
			state.status = 'error';
		},

		[fetchAuthMe.pending]: (state) => {
			// set state.data to null - reset user data
			state.data = null;
			// we update state.status to 'loading'
			state.status = 'loading';
		},
		// if request(action) state is 'fulfilled' in Redux
		[fetchAuthMe.fulfilled]: (state, action) => {
			// update state.data with value from action payload (redux toolkit to control correctness)
			state.data = action.payload; // USER object
			// we update  state.status to 'loaded'
			state.status = 'loaded';
		},
		// if request(action) state is 'rejected' in Redux - error occurred
		[fetchAuthMe.rejected]: (state) => {
			// set state.data to null - reset user data
			state.data = null;
			// we update state.status to 'loaded'
			state.status = 'error';
		},
	},
});

// check if state has Authentication data - user Object. Other words, if user authorized
export const selectIsAuth = (state) => Boolean(state.auth.data);

// create Reducer
export const authReducer = authSlice.reducer;

// destructure 'logout' action from reducer
export const { logout } = authSlice.actions;
