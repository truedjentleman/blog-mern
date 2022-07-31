import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axios';

import { Post } from '../components/Post';
import { Index } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';

export const FullPost = () => {
	const [postData, setPostData] = useState();
	const [isLoading, setIsLoading] = useState(true);

	// get the params from URL which lead to this page
	const { id } = useParams();
	// console.log(id);   // DEBUG

	// Request for one post by ID - no sense to store this in REDUX, so request is performed locally
	useEffect(() => {
		axios
			.get(`/posts/${id}`)
			.then((res) => {
				setPostData(res.data);
        setIsLoading(false) // if request is successfully completed
			})
			.catch((err) => {
				console.warn(err);
				alert('Error while getting post');
			});
	}, []);


	if (isLoading) {
		return <Post isLoading={isLoading} isFullPost />;
	}

	return (
		<>
			<Post
				id={postData._id}
				title={postData.title}
				imageUrl={postData.imageUrl}
				user={postData.user}
				createdAt={postData.createdAt}
				viewsCount={postData.viewsCount}
				commentsCount={3}
				tags={postData.tags}
				isFullPost
			>
				<p>{postData.text}</p>
			</Post>
			<CommentsBlock
				items={[
					{
						user: {
							fullName: 'Вася Пупкин',
							avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
						},
						text: 'Это тестовый комментарий 555555',
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
			>
				<Index />
			</CommentsBlock>
		</>
	);
};
