import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  useTheme,
  Button,
  Divider,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import { useDispatch, useSelector } from "react-redux";
import UserImage from "./UserImage";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const CommentWidget = ({ postId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const { palette } = useTheme();

  const getComments = async () => {
    const response = await fetch(
      `${API_URL}/comments/${postId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setComments(data);
  };

  const handleComment = async () => {
    const response = await fetch(
      `${API_URL}/comments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, postId, comment }),
      }
    );
    const updatedComments = await response.json();
    setComments(updatedComments);
    setComment("");
  };

  const deleteComment = async (commentId) => {
    const response = await fetch(
      `${API_URL}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const updatedComments = await response.json();
    setComments(updatedComments);
  };

  useState(() => {
    getComments();
  }, []);

  return (
    <Box mt="0.5rem">
      <FlexBetween gap="1.5rem">
        <InputBase
          placeholder="Yorum yaz..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
        <Button
          disabled={!comment}
          onClick={handleComment}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          Gönder
        </Button>
      </FlexBetween>
      <Box mt="1rem">
        {comments.map((comment) => (
          <Box key={comment._id}>
            <Divider />
            <FlexBetween>
              <Box display="flex" alignItems="center" gap="1rem" m="0.5rem 0">
                <UserImage image={comment.userPicturePath} size="35px" />
                <Box>
                  <Typography
                    color={palette.primary.main}
                    variant="h5"
                    fontWeight="500"
                    sx={{
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => navigate(`/profile/${comment.userId}`)}
                  >
                    {comment.firstName} {comment.lastName}
                  </Typography>
                  <Typography color={palette.neutral.main}>
                    {comment.comment}
                  </Typography>
                </Box>
              </Box>
              {loggedInUserId === comment.userId && (
                <IconButton onClick={() => deleteComment(comment._id)}>
                  <Delete />
                </IconButton>
              )}
            </FlexBetween>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CommentWidget; 