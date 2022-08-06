import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/posts';

export const Home = () => {
	//create dispatcher
	const dispatch = useDispatch();

	// get the User data from storage
	const userData = useSelector((state) => state.auth.data);

	// extract 'posts' and 'tags' from reducers in Store ('store.js) - reducer 'posts' destructured
	const { posts, tags } = useSelector((state) => state.posts);

	// set to true if posts.status is 'loading' - posts are in process of loading
	const isPostsLoading = posts.status === 'loading';
	// set to true if tags.status is 'loading' - tags are in process of loading
	const isTagsLoading = tags.status === 'loading';

	//? get the posts and tags from backend on first render, using 'fetchPosts' async action
	useEffect(() => {
		dispatch(fetchPosts());
		dispatch(fetchTags());
	}, []);

	// console.log(posts); // DEBUG

	return (
		<>
			<Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
				<Tab label="New" />
				<Tab label="Popular" />
			</Tabs>
			<Grid container spacing={4}>
				<Grid xs={8} item>
					{(isPostsLoading ? [...Array(5)] : posts.items).map((postObj, index) =>
						isPostsLoading ? (
							<Post isLoading={true} key={index} />
						) : (
							<Post
								key={index}
								id={postObj._id}
								title={postObj.title}
								// imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
								imageUrl={
									postObj.imageUrl
										? `http://localhost:4444${postObj.imageUrl}`
										: ''
								}
								user={postObj.user}
								createdAt={postObj.createdAt}
								viewsCount={postObj.viewsCount}
								commentsCount={3}
								tags={postObj.tags}
								/* check if logged-in user is the same as post author - if 'true' post can be edit */
								isEditable={userData?._id === postObj.user._id}
							/>
						)
					)}
				</Grid>
				<Grid xs={4} item>
					<TagsBlock items={tags.items} isLoading={isTagsLoading} />
					<CommentsBlock
						items={[
							{
								user: {
									fullName: 'Вася Пупкин',
									avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
								},
								text: 'Это тестовый комментарий',
							},
							{
								user: {
									fullName: 'Иван Иванов',
									avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
								},
								text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
							},
						]}
						isLoading={false}
					/>
				</Grid>
			</Grid>
		</>
	);
};
