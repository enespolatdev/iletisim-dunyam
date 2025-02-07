import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  DeleteOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme, Link } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import CommentWidget from "components/CommentWidget";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setPosts } from "state";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  createdAt,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const isOwnPost = postUserId === loggedInUserId;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  const patchLike = async () => {
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    navigate(`/profile/${postUserId}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Bu gönderiyi silmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      setIsLoading(true);
      console.log("Silme isteği gönderiliyor:", { postId, userId: loggedInUserId });

      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Sunucu hatası:", data);
        throw new Error(data.error || data.message || "Gönderi silinemedi");
      }

      console.log("Silme başarılı, gönderiler güncelleniyor");

      // Mevcut gönderileri al ve silinen gönderiyi çıkar
      const currentPosts = await fetch(`${API_URL}/posts`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!currentPosts.ok) {
        throw new Error("Gönderiler güncellenemedi");
      }

      const posts = await currentPosts.json();
      // Silinen gönderiyi filtreleyerek çıkar
      const updatedPosts = posts.filter(post => post._id !== postId);
      dispatch(setPosts({ posts: updatedPosts }));

      console.log("Gönderiler başarıyla güncellendi");

    } catch (error) {
      console.error("Silme işlemi hatası:", error);
      window.alert(error.message || "Gönderi silinirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Box
        onClick={handleProfileClick}
        sx={{
          "&:hover": {
            cursor: "pointer",
            backgroundColor: palette.background.light,
            borderRadius: "0.5rem",
          },
          padding: "0.5rem",
          transition: "background-color 0.3s",
        }}
      >
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
        />
      </Box>
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <>
          {picturePath.toLowerCase().endsWith('.mp4') ? (
            <video
              width="100%"
              height="auto"
              controls
              style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            >
              <source src={`${API_URL}/assets/${picturePath}`} type="video/mp4" />
              Tarayıcınız video oynatmayı desteklemiyor.
            </video>
          ) : picturePath.toLowerCase().endsWith('.pdf') ? (
            <Box
              sx={{
                width: "100%",
                height: "500px",
                mt: "0.75rem",
                borderRadius: "0.75rem",
                overflow: "hidden"
              }}
            >
              <object
                data={`${API_URL}/assets/${picturePath}`}
                type="application/pdf"
                width="100%"
                height="100%"
                style={{ borderRadius: "0.75rem" }}
              >
                <Typography color="error">
                  PDF görüntüleyici yüklenemedi. 
                  <Link 
                    href={`${API_URL}/assets/${picturePath}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ ml: 1 }}
                  >
                    PDF'i indir
                  </Link>
                </Typography>
              </object>
            </Box>
          ) : (
            <img
              width="100%"
              height="auto"
              alt="post"
              style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
              src={`${API_URL}/assets/${picturePath}`}
            />
          )}
        </>
      )}
      <Typography color={main} fontSize="0.75rem" sx={{ mt: "0.5rem", mb: "0.5rem" }}>
        {formatDate(createdAt)}
      </Typography>
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
          </FlexBetween>
        </FlexBetween>

        <FlexBetween gap="0.3rem">
          <IconButton>
            <ShareOutlined />
          </IconButton>
          {isOwnPost && (
            <IconButton 
              onClick={handleDelete}
              disabled={isLoading}
              sx={{
                "&:hover": { color: "red" }
              }}
            >
              <DeleteOutlined />
            </IconButton>
          )}
        </FlexBetween>
      </FlexBetween>
      {isComments && <CommentWidget postId={postId} />}
    </WidgetWrapper>
  );
};

export default PostWidget;
