import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const [isFriend, setIsFriend] = useState(false);

  const patchFriend = async () => {
    try {
      const response = await fetch(
        `${API_URL}/users/${_id}/${friendId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.error("Error updating friend status:", error);
    }
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    navigate(`/profile/${friendId}`);
  };

  useEffect(() => {
    // Arkadaş durumunu kontrol et
    const checkFriendStatus = () => {
      const isFriendCheck = friends.find((friend) => friend._id === friendId);
      setIsFriend(Boolean(isFriendCheck));
    };
    checkFriendStatus();
  }, [friends, friendId]);

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={handleProfileClick}
          sx={{
            "&:hover": {
              cursor: "pointer",
              color: palette.primary.light,
            },
            transition: "color 0.2s",
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {_id !== friendId && (
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            patchFriend();
          }}
          sx={{ 
            backgroundColor: primaryLight, 
            p: "0.6rem",
            "&:hover": {
              backgroundColor: primaryDark,
            },
            transition: "background-color 0.2s",
          }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      )}
    </FlexBetween>
  );
};

export default Friend;
