import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
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

	// get post id from URL params, when 'edit post' link clicked (edit icon)
	const { id } = useParams();

	// is data posting to BD ongoing
	const [loading, setLoading] = useState(false);

	// hook useNavigate
	const navigate = useNavigate();

	// for uploading images to backend
	const inputFileRef = useRef(null);

	// get the 'selectIsAuth' value from storage - authorized or not
	const isAuth = useSelector(selectIsAuth);

	// variable to define if post in 'editing mode - if 'id' exists return 'true'
	const isEditing = Boolean(id);

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

			// to check if post in 'editing' or ' creating' state and send corresponding request
			//extract data from server response
			//* using post id either from URL params or from server response (DEBUG)
			const { data } = isEditing
				? await axios.patch(`/posts/${id}`, fields)
				: await axios.post('/posts', fields);
			// console.log(data); // DEBUG
			const _id = isEditing ? id : data._id; // post 'id' from server response

			// after post creation we need to get post id from DB and redirect user to page with that post
			navigate(`/posts/${_id}`);
		} catch (error) {
			// if posts for some reason not created
			console.warn(error);
			alert('An error occurred during post creation');
		}
	};

	// Checking if 'id' exist - other words the post in 'editing' mode, not 'creation'
	// get the post data by 'id'
	useEffect(() => {
		if (id) {
			const getPost = async () => {
				try {
					const response = await axios.get(`/posts/${id}`);
					const { data } = response; // decompose the data from response object
					setTitle(data.title);
					setText(data.text);
					setImageUrl(data.imageUrl);
					setTags(data.tags.join(',')); // convert to string
				} catch (err) {
					console.warn(err);
					alert('Error during getting post');
				}
			};
			getPost();
		}
	}, []);

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
					{isEditing ? 'Save' : 'Publish'}
				</Button>
				<a href="/">
					<Button size="large">Cancel</Button>
				</a>
			</div>
		</Paper>
	);
};
