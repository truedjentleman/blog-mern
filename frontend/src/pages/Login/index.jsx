import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

// Styles
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import styles from './Login.module.scss';

// Redux async action and checker for authentication
import { fetchAuth, selectIsAuth } from '../../redux/slices/auth';

export const Login = () => {
	// authorized or not
	const isAuth = useSelector(selectIsAuth);

	// connect redux dispatcher
	const dispatch = useDispatch();

	// initialize react-hook-form (RHF)
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		// setError   // to handle validation errors from backend if required
	} = useForm({
		defaultValues: {
			email: 'test@test.com',
			password: '123456',
		},
		mode: 'onChange', // run validation only on FORM send
	});

	// this function will be invoked if react-hook-form says that validation completed w/o errors
	// function returns Promise. if returned 'data.payload' is 'true'store token in local storage
	const onSubmit = async (values) => {
		// console.log(values);  // DENUG - auth params from form
		const data = await dispatch(fetchAuth(values));
		// console.log(data); // DEBUG - get action with response payload
		if (!data.payload) {
			alert('Authentication failed');
		}
		if ('token' in data.payload) {
			window.localStorage.setItem('token', data.payload.token);
		}
	};

	//* if user authorized successfully render 'Navigate' component which redirects to main page
	if (isAuth) {
		return <Navigate to="/" />;
	}

	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant="h5">
				Welcome to Blog
			</Typography>
			{/* RHF method 'handleSubmit' takes 'onSubmit and invoke it only if validation is successful */}
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					className={styles.field}
					label="E-Mail"
					/* if there is a RHF error - convert in Boolean and if true field will be highlighted  */
					error={Boolean(errors.email?.message)}
					/* set the RHF error handler - if errors.email exists */
					helperText={errors.email?.message}
					/* register field and set validation rules*/
					{...register('email', {
						required: 'Please enter a valid email',
						pattern: {
							value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
							message: 'invalid email address',
						},
					})}
					fullWidth
				/>
				<TextField
					className={styles.field}
					type="password"
					label="Password"
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					{...register('password', { required: 'Please enter password' })}
					fullWidth
				/>
				<Button
					disabled={!isValid}
					type="submit"
					size="large"
					variant="contained"
					fullWidth
				>
					Sign In
				</Button>
			</form>
		</Paper>
	);
};
