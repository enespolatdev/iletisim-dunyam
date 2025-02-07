import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  FavoriteOutlined,
  ChatBubbleOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, IconButton, TextField, Link } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [editingX, setEditingX] = useState(false);
  const [editingLinkedIn, setEditingLinkedIn] = useState(false);
  const [xLink, setXLink] = useState("");
  const [linkedInLink, setLinkedInLink] = useState("");
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isOwnProfile = userId === loggedInUserId;
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
      setXLink(data.xLink || "");
      setLinkedInLink(data.linkedInLink || "");
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const updateSocialLinks = async (updates) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating social links:", error);
    }
  };

  const handleSaveX = () => {
    updateSocialLinks({ xLink });
    setEditingX(false);
  };

  const handleSaveLinkedIn = () => {
    updateSocialLinks({ linkedInLink });
    setEditingLinkedIn(false);
  };

  useEffect(() => {
    if (userId && token) {
      getUser();
    }
  }, [userId, token]);

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    friends,
  } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>{friends.length} arkadaş</Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Etkileşimler
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <IconButton
              sx={{
                backgroundColor: palette.primary.light,
                p: "0.6rem",
              }}
              onClick={() => navigate(`/profile/${userId}?tab=1`)}
            >
              <FavoriteOutlined sx={{ fontSize: "25px", color: palette.primary.dark }} />
            </IconButton>
            <Box>
              <Typography 
                color={main} 
                fontWeight="500"
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    color: palette.primary.main,
                  },
                }}
                onClick={() => navigate(`/profile/${userId}?tab=1`)}
              >
                Beğenilen Gönderiler
              </Typography>
            </Box>
          </FlexBetween>
        </FlexBetween>

        <FlexBetween gap="1rem" mb="1rem">
          <FlexBetween gap="1rem">
            <IconButton
              sx={{
                backgroundColor: palette.primary.light,
                p: "0.6rem",
              }}
              onClick={() => navigate(`/profile/${userId}?tab=2`)}
            >
              <ChatBubbleOutlined sx={{ fontSize: "25px", color: palette.primary.dark }} />
            </IconButton>
            <Box>
              <Typography 
                color={main} 
                fontWeight="500"
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    color: palette.primary.main,
                  },
                }}
                onClick={() => navigate(`/profile/${userId}?tab=2`)}
              >
                Yorum Yapılan Gönderiler
              </Typography>
            </Box>
          </FlexBetween>
        </FlexBetween>

        <Divider />

        {/* SOCIAL PROFILES SECTION */}
        {(isOwnProfile || user.xLink || user.linkedInLink) && (
          <>
            <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem" mt="1rem">
              Sosyal Profiller
            </Typography>

            {/* X (Twitter) Section */}
            {(isOwnProfile || user.xLink) && (
              <FlexBetween gap="1rem" mb="0.5rem">
                <FlexBetween gap="1rem">
                  <IconButton
                    sx={{
                      backgroundColor: palette.primary.light,
                      p: "0.6rem",
                    }}
                    onClick={() => xLink && window.open(xLink, '_blank')}
                    disabled={!xLink}
                  >
                    <TwitterIcon sx={{ fontSize: "25px", color: palette.primary.dark }} />
                  </IconButton>
                  <Box>
                    <Typography color={main} fontWeight="500">
                      X (Twitter)
                    </Typography>
                    {editingX && isOwnProfile ? (
                      <TextField
                        size="small"
                        value={xLink}
                        onChange={(e) => setXLink(e.target.value)}
                        placeholder="X profilinizin linkini girin"
                        sx={{ mt: "0.5rem", minWidth: "250px" }}
                      />
                    ) : (
                      <Typography 
                        color={medium}
                        sx={{ 
                          cursor: xLink ? 'pointer' : 'default',
                          '&:hover': xLink ? { color: palette.primary.main } : {}
                        }}
                        onClick={() => xLink && window.open(xLink, '_blank')}
                      >
                        {xLink || (isOwnProfile ? "Link eklenmemiş" : "")}
                      </Typography>
                    )}
                  </Box>
                </FlexBetween>
                {isOwnProfile && (
                  editingX ? (
                    <Box>
                      <IconButton onClick={handleSaveX}>
                        <SaveIcon sx={{ color: main }} />
                      </IconButton>
                      <IconButton onClick={() => setEditingX(false)}>
                        <CancelIcon sx={{ color: main }} />
                      </IconButton>
                    </Box>
                  ) : (
                    <IconButton onClick={() => setEditingX(true)}>
                      <EditOutlined sx={{ color: main }} />
                    </IconButton>
                  )
                )}
              </FlexBetween>
            )}

            {/* LinkedIn Section */}
            {(isOwnProfile || user.linkedInLink) && (
              <FlexBetween gap="1rem">
                <FlexBetween gap="1rem">
                  <IconButton
                    sx={{
                      backgroundColor: palette.primary.light,
                      p: "0.6rem",
                    }}
                    onClick={() => linkedInLink && window.open(linkedInLink, '_blank')}
                    disabled={!linkedInLink}
                  >
                    <LinkedInIcon sx={{ fontSize: "25px", color: palette.primary.dark }} />
                  </IconButton>
                  <Box>
                    <Typography color={main} fontWeight="500">
                      LinkedIn
                    </Typography>
                    {editingLinkedIn && isOwnProfile ? (
                      <TextField
                        size="small"
                        value={linkedInLink}
                        onChange={(e) => setLinkedInLink(e.target.value)}
                        placeholder="LinkedIn profilinizin linkini girin"
                        sx={{ mt: "0.5rem", minWidth: "250px" }}
                      />
                    ) : (
                      <Typography 
                        color={medium}
                        sx={{ 
                          cursor: linkedInLink ? 'pointer' : 'default',
                          '&:hover': linkedInLink ? { color: palette.primary.main } : {}
                        }}
                        onClick={() => linkedInLink && window.open(linkedInLink, '_blank')}
                      >
                        {linkedInLink || (isOwnProfile ? "Link eklenmemiş" : "")}
                      </Typography>
                    )}
                  </Box>
                </FlexBetween>
                {isOwnProfile && (
                  editingLinkedIn ? (
                    <Box>
                      <IconButton onClick={handleSaveLinkedIn}>
                        <SaveIcon sx={{ color: main }} />
                      </IconButton>
                      <IconButton onClick={() => setEditingLinkedIn(false)}>
                        <CancelIcon sx={{ color: main }} />
                      </IconButton>
                    </Box>
                  ) : (
                    <IconButton onClick={() => setEditingLinkedIn(true)}>
                      <EditOutlined sx={{ color: main }} />
                    </IconButton>
                  )
                )}
              </FlexBetween>
            )}
          </>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
