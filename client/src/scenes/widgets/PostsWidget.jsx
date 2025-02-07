import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await fetch(`${API_URL}/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    // En yeni gönderileri başa almak için sıralama
    const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    dispatch(setPosts({ posts: sortedPosts }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `${API_URL}/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    // En yeni gönderileri başa almak için sıralama
    const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    dispatch(setPosts({ posts: sortedPosts }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
          createdAt,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
            createdAt={createdAt}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
