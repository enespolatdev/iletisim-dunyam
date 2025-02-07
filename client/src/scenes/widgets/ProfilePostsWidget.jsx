import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import { Box, Tabs, Tab, CircularProgress, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const ProfilePostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const location = useLocation();
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // URL'den tab parametresini al
    const params = new URLSearchParams(location.search);
    const tabValue = parseInt(params.get("tab") || "0");
    if (tabValue >= 0 && tabValue <= 2) {
      setValue(tabValue);
      if (tabValue === 0) {
        getUserPosts();
      } else if (tabValue === 1) {
        getLikedPosts();
      } else {
        getCommentedPosts();
      }
    }
  }, [location.search]);

  const handleChange = async (event, newValue) => {
    setValue(newValue);
    try {
      if (newValue === 0) {
        await getUserPosts();
      } else if (newValue === 1) {
        await getLikedPosts();
      } else {
        await getCommentedPosts();
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error.message);
    }
  };

  const getUserPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_URL}/posts/${userId}/posts`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Gönderiler alınamadı");
      }
      const data = await response.json();
      const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      dispatch(setPosts({ posts: sortedPosts }));
    } catch (error) {
      console.error("Error fetching user posts:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getLikedPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_URL}/posts/${userId}/liked`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Beğenilen gönderiler alınamadı");
      }
      const data = await response.json();
      const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      dispatch(setPosts({ posts: sortedPosts }));
    } catch (error) {
      console.error("Error fetching liked posts:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCommentedPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_URL}/posts/${userId}/commented`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Yorum yapılan gönderiler alınamadı");
      }
      const data = await response.json();
      const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      dispatch(setPosts({ posts: sortedPosts }));
    } catch (error) {
      console.error("Error fetching commented posts:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) {
      getUserPosts();
    }
  }, [userId, token]);

  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleChange}
        centered
        sx={{
          mb: "2rem",
          "& .MuiTabs-indicator": {
            backgroundColor: "primary.main",
          },
          "& .MuiTab-root": {
            color: "text.primary",
            "&.Mui-selected": {
              color: "primary.main",
            },
          },
        }}
      >
        <Tab label="Gönderiler" />
        <Tab label="Beğenilenler" />
        <Tab label="Yorum Yapılanlar" />
      </Tabs>

      {loading && (
        <Box display="flex" justifyContent="center" p="2rem">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box display="flex" justifyContent="center" p="2rem">
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {!loading && !error && posts.length === 0 && (
        <Box display="flex" justifyContent="center" p="2rem">
          <Typography color="text.secondary">
            {value === 0 && "Henüz gönderi yok"}
            {value === 1 && "Henüz beğenilen gönderi yok"}
            {value === 2 && "Henüz yorum yapılan gönderi yok"}
          </Typography>
        </Box>
      )}

      {!loading && !error && posts.map(
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
    </Box>
  );
};

export default ProfilePostsWidget; 