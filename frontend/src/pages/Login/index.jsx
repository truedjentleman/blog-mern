import React from 'react';
import { useDispatch } from 'react-redux'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';

// Redux async action
import { fetchAuth } from '../../redux/slices/auth';

import styles from './Login.module.scss';


export const Login = () => {
  // connect redux dispatcher
  const dispatch = useDispatch()

	// initialize react-hook-form (RHF)
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		setError,
	} = useForm({
		defaultValues: {
			email: 'test@test.com',
			password: '123456',
		},
		mode: 'onChange', // run validation only on FORM send
	});



	// this function will be invoked if react-hook-form says that validation completed w/o errors
	const onSubmit = (values) => {
		dispatch(fetchAuth(values))
	};
  
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
					{...register('email', { required: 'Please enter a valid email', pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "invalid email address"
          }})}
					fullWidth
				/>
				<TextField
					className={styles.field}
					label="Password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
					{...register('password', { required: 'Please enter password' })}
					fullWidth
				/>
				<Button type="submit" size="large" variant="contained" fullWidth>
					Sign In
				</Button>
			</form>
		</Paper>
	);
};
