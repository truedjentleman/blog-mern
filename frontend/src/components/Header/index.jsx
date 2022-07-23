import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

//Styles
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import styles from './Header.module.scss';

// authentication checker
import { logout, selectIsAuth } from '../../redux/slices/auth';

export const Header = () => {
	// connect redux dispatcher
	const dispatch = useDispatch();

	// authorized or not
	const isAuth = useSelector(selectIsAuth);

	// on Logout invoke 'logout' action
	const onClickLogout = () => {
		if (window.confirm('Are you sure you want to log out?')) {
			dispatch(logout());
		}
	};

	return (
		<div className={styles.root}>
			<Container maxWidth="lg">
				<div className={styles.inner}>
					<Link className={styles.logo} to="/">
						<div>I-THE-CREATOR BLOG</div>
					</Link>
					<div className={styles.buttons}>
						{isAuth ? (
							<>
								<Link to="/posts/create">
									<Button variant="contained">Create Post</Button>
								</Link>
								<Button onClick={onClickLogout} variant="contained" color="error">
									Log Out
								</Button>
							</>
						) : (
							<>
								<Link to="/login">
									<Button variant="outlined">Sigh In</Button>
								</Link>
								<Link to="/register">
									<Button variant="contained">Create Account</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</Container>
		</div>
	);
};
