import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getFriends = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        `${API_URL}/users/${userId}/friends`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Arkadaş listesi alınamadı");
      }

      const data = await response.json();
      dispatch(setFriends({ friends: data }));
    } catch (err) {
      console.error("Error fetching friends:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) {
      getFriends();
    }
  }, [userId, token]); // userId veya token değiştiğinde yeniden yükle

  if (isLoading) {
    return (
      <WidgetWrapper>
        <Typography color={palette.neutral.dark} variant="h5" fontWeight="500" sx={{ mb: "1.5rem" }}>
          Arkadaş Listesi Yükleniyor...
        </Typography>
      </WidgetWrapper>
    );
  }

  if (error) {
    return (
      <WidgetWrapper>
        <Typography color="error" variant="h5" fontWeight="500" sx={{ mb: "1.5rem" }}>
          {error}
        </Typography>
      </WidgetWrapper>
    );
  }

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Arkadaş Listesi
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {Array.isArray(friends) && friends.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
          />
        ))}
        {Array.isArray(friends) && friends.length === 0 && (
          <Typography color={palette.neutral.medium}>
            Henüz arkadaş eklenmemiş
          </Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
