import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

// Redux async action and checker for authentication
import { selectIsAuth } from '../../redux/slices/auth';
import axios from '../../axios';

import styles from './AddPost.module.scss';

export const AddPost = () => {
	const [text, setText] = useState('');
	const [title, setTitle] = useState('');
	const [tags, setTags] = useState('');
	const [imageUrl, setImageUrl] = useState('');

	// is data posting to BD ongoing
	const [loading, setLoading] = useState(false);

	// hook useNavigate
	const navigate = useNavigate();

	// for uploading images to backend
	const inputFileRef = useRef(null);

	// get the 'selectIsAuth' value from storage - authorized or not
	const isAuth = useSelector(selectIsAuth);

	// after user select the file - to get file from 'inputFileRef' and handle it
	const handleChangeFile = async (e) => {
		// console.log(e.target.files);  // Debug
		try {
			// special format to handle images
			const formData = new FormData();
			const file = e.target.files[0];
			formData.append('image', file);

			//send to backend and get back 'data' object with URL - link to file in 'uploads' folder
			const { data } = await axios.post('/upload', formData);

			// set imageUrl state with URL data got from backend
			setImageUrl(data.url);
		} catch (error) {
			console.warn(error);
			alert('File upload error');
		}
	};

	// Remove image
	const onClickRemoveImage = () => {
		if (window.confirm('Do you really want to delete preview image?') === true) setImageUrl('');
	};

	// on post Text change - in SimpleMDE
	const onChange = useCallback((value) => {
		setText(value);
	}, []);

	// request to server send data to BD
	const onSubmit = async () => {
		try {
			setLoading(true);

			const fields = {
				title,
				imageUrl,
				tags,
				text,
			};

			//extract data from server response
			const { data } = await axios.post('/posts', fields);
			// console.log(data); // DEBUG
			const id = data._id;

			// after post creation we need to get post id from BD and redirect user to page with that post
			navigate(`/posts/${id}`);
		} catch (error) {
			// if posts for some reason not created
			console.warn(error);
			alert('An error occurred during post creation');
		}
	};

	const options = useMemo(
		() => ({
			spellChecker: false,
			maxHeight: '400px',
			autofocus: true,
			placeholder: 'Enter text..',
			status: false,
			autosave: {
				enabled: true,
				delay: 1000,
			},
		}),
		[]
	);

	//* if user not authorized render 'Navigate' component which redirects to main page
	// to check if token is in LS if yser directly opens /add-post page
	if (!window.localStorage.getItem('token') && !isAuth) {
		return <Navigate to="/" />;
	}

	return (
		<Paper style={{ padding: 30 }}>
			{/* on button click triggers input click */}
			<Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
				Upload preview
			</Button>
			{/* hidden input for files upload */}
			<input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />

			{imageUrl && (
				<>
					<Button variant="contained" color="error" onClick={onClickRemoveImage}>
						Remove
					</Button>
					<img
						className={styles.image}
						/* imageURL(link to file) which is got from backend */
						src={`http://localhost:4444${imageUrl}`}
						alt="Uploaded"
					/>
				</>
			)}

			<br />
			<br />
			<TextField
				classes={{ root: styles.title }}
				variant="standard"
				placeholder="Post header..."
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				fullWidth
			/>
			<TextField
				classes={{ root: styles.tags }}
				variant="standard"
				placeholder="Tags..."
				value={tags}
				onChange={(e) => setTags(e.target.value)}
				fullWidth
			/>
			<SimpleMDE
				className={styles.editor}
				value={text}
				onChange={onChange}
				options={options}
			/>
			<div className={styles.buttons}>
				<Button onClick={onSubmit} size="large" variant="contained">
					Опубликовать
				</Button>
				<a href="/">
					<Button size="large">Отмена</Button>
				</a>
			</div>
		</Paper>
	);
};
