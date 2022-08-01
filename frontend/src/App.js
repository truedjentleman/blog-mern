import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@mui/material/Container';

import { Header } from './components';
import { Home, FullPost, Registration, AddPost, Login } from './pages';
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';

function App() {
	// connect storage and actions
	const dispatch = useDispatch();

	// if authorized then 'selectIsAuth' in storage will be set to 'true'
	// get the 'isAuth' value from storage (selectIsAuth)
	const isAuth = useSelector(selectIsAuth); //! If a selected value from the state would change 'useSelector' - re-render is called

	// Check if user Authorized (token stored in Local Storage) by sending request to backend on first app render
	// this will update 'isAuth' and have impact on main page buttons view
	useEffect(() => {
		dispatch(fetchAuthMe());
	}, []);

	return (
		<>
			<Header />
			<Container maxWidth="lg">
				<Routes>
					<Route path="*" element={<Home />} /> {/* default path */}
					<Route path="/posts/:id" element={<FullPost />} />
					<Route path="/add-post" element={<AddPost />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Registration />} />
				</Routes>
			</Container>
		</>
	);
}

export default App;
