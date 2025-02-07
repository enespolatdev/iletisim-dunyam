import { useState, useEffect, useCallback } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Menu as MuiMenu,
  CircularProgress,
  Badge,
  Button,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
  Person,
  Description,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import NotificationsIcon from "@mui/icons-material/Notifications";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isMediumScreen = useMediaQuery("(min-width: 600px) and (max-width: 999px)");
  const isSmallScreen = useMediaQuery("(max-width: 599px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const medium = theme.palette.neutral.medium;

  const fullName = `${user.firstName} ${user.lastName}`;

  // Debounce fonksiyonu
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // API'ye istek atan fonksiyon
  const performSearch = async (searchTerm) => {
    if (searchTerm.length < 2) {
      setSearchResults({
        users: [],
        posts: [],
        message: searchTerm.length > 0 ? "En az 2 karakter girmelisiniz" : ""
      });
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `${API_URL}/search?query=${searchTerm}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Arama hatası:", error);
      setSearchResults({
        users: [],
        posts: [],
        message: "Arama sırasında bir hata oluştu"
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce edilmiş arama fonksiyonu
  const debouncedSearch = useCallback(
    debounce((searchTerm) => performSearch(searchTerm), 300),
    []
  );

  // Input değiştiğinde sadece state'i güncelle
  const handleSearchInput = (event) => {
    setSearchQuery(event.target.value);
  };

  // Arama butonuna tıklandığında araması yap
  const handleSearchClick = async () => {
    if (searchQuery.length < 2) {
      setSearchResults({
        users: [],
        posts: [],
        message: searchQuery.length > 0 ? "En az 2 karakter girmelisiniz" : ""
      });
      return;
    }

    setIsSearching(true);
    setSearchAnchorEl(document.querySelector('.search-input'));
    
    try {
      const response = await fetch(
        `${API_URL}/search?query=${searchQuery}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Arama hatası:", error);
      setSearchResults({
        users: [],
        posts: [],
        message: "Arama sırasında bir hata oluştu"
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Enter tuşuna basıldığında da arama yap
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handleResultClick = (type, item) => {
    if (type === "user") {
      navigate(`/profile/${item._id}`);
    } else if (type === "post") {
      navigate(`/profile/${item.userId}?postId=${item._id}`);
    }
    setSearchQuery("");
    setSearchResults(null);
    setSearchAnchorEl(null);
  };

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(setLogout());
    handleProfileClose();
  };

  const isSearchOpen = Boolean(searchAnchorEl);
  const isProfileOpen = Boolean(profileAnchorEl);
  const searchPopoverId = isSearchOpen ? "search-popover" : undefined;

  // Bildirimleri getir
  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/${user._id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Bildirimler alınamadı:", error);
    }
  };

  // Okunmamış bildirim sayısını getir
  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/${user._id}/unread`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setUnreadCount(data.count);
    } catch (error) {
      console.error("Bildirim sayısı alınamadı:", error);
    }
  };

  // Bildirimleri okundu olarak işaretle
  const markNotificationsAsRead = async () => {
    try {
      await fetch(
        `${API_URL}/notifications/${user._id}/read`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Bildirimler işaretlenemedi:", error);
    }
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    if (unreadCount > 0) {
      markNotificationsAsRead();
    }
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    // Her 30 saniyede bir güncelle
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <FlexBetween padding={isSmallScreen ? "1rem 3%" : "1rem 6%"} backgroundColor={alt}>
      <FlexBetween gap={isSmallScreen ? "0.3rem" : "0.5rem"}>
        <Box
          component="img"
          src="/sun.svg"
          alt="Güneş İkonu"
          sx={{
            width: isSmallScreen ? "30px" : "40px",
            height: isSmallScreen ? "30px" : "40px",
            animation: "rotate 20s linear infinite",
            "@keyframes rotate": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
        />
        <Typography
          fontFamily="Dancing Script"
          fontWeight="700"
          fontSize={isSmallScreen ? "1.8rem" : isMediumScreen ? "2rem" : "2.5rem"}
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              cursor: "pointer",
              transform: "scale(1.05)",
              transition: "transform 0.3s ease",
              textShadow: "2px 2px 4px rgba(255, 0, 0, 0.2)",
            },
          }}
        >
          {isSmallScreen ? "İD" : "İletişim Dünyam"}
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase
              className="search-input"
              placeholder={isMediumScreen ? "Ara..." : "Ara... "}
              value={searchQuery}
              onChange={handleSearchInput}
              onKeyPress={handleKeyPress}
              sx={{ 
                width: isMediumScreen ? "200px" : "300px",
                fontSize: isMediumScreen ? "0.9rem" : "1rem"
              }}
            />
            <IconButton onClick={handleSearchClick}>
              {isSearching ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Search />
              )}
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>

      <Popover
        id={searchPopoverId}
        open={isSearchOpen}
        anchorEl={searchAnchorEl}
        onClose={() => setSearchAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            width: "350px",
            maxHeight: "500px",
            overflowY: "auto",
            mt: 0.5,
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            "& .MuiList-root": {
              padding: "8px 0",
            },
            "& .MuiListItem-root": {
              padding: "8px 16px",
              "&:hover": {
                backgroundColor: theme.palette.background.light,
              },
            },
            "& .MuiDivider-root": {
              margin: "4px 0",
            },
            "& .MuiListItemText-primary": {
              fontSize: "0.95rem",
              fontWeight: 500,
            },
            "& .MuiListItemText-secondary": {
              fontSize: "0.85rem",
            },
          },
        }}
        style={{
          marginTop: "8px",
        }}
      >
        {searchResults && (
          <List>
            {(!searchResults.users || searchResults.users.length === 0) &&
              (!searchResults.posts || searchResults.posts.length === 0) && (
                <ListItem>
                  <ListItemText primary={searchResults.message || "Sonuç bulunamadı"} />
                </ListItem>
              )}

            {searchResults.users && searchResults.users.length > 0 && (
              <>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Kullanıcılar" />
                </ListItem>
                <Divider />
                {searchResults.users.map((user) => (
                  <ListItem
                    key={user._id}
                    button
                    onClick={() => handleResultClick("user", user)}
                  >
                    <ListItemAvatar>
                      <UserImage image={user.picturePath} size="40px" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${user.firstName} ${user.lastName}`}
                      secondary={user.location}
                    />
                  </ListItem>
                ))}
              </>
            )}

            {searchResults.posts && searchResults.posts.length > 0 && (
              <>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Description />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Gönderiler" />
                </ListItem>
                <Divider />
                {searchResults.posts.map((post) => (
                  <ListItem
                    key={post._id}
                    button
                    onClick={() => handleResultClick("post", post)}
                  >
                    <ListItemAvatar>
                      {post.picturePath ? (
                        <UserImage image={post.picturePath} size="40px" />
                      ) : (
                        <Avatar>
                          <Description />
                        </Avatar>
                      )}
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${post.firstName} ${post.lastName}`}
                      secondary={post.description.substring(0, 50) + "..."}
                    />
                  </ListItem>
                ))}
              </>
            )}
          </List>
        )}
      </Popover>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton onClick={handleNotificationClick}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon sx={{ fontSize: "25px" }} />
            </Badge>
          </IconButton>
          
          <IconButton
            onClick={handleProfileClick}
            size="small"
            sx={{ padding: 0 }}
          >
            <UserImage image={user.picturePath} size="40px" />
          </IconButton>

          <MuiMenu
            anchorEl={profileAnchorEl}
            open={isProfileOpen}
            onClose={handleProfileClose}
            onClick={handleProfileClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1,
                "& .MuiMenuItem-root": {
                  typography: 'body2',
                  padding: '8px 20px',
                },
              },
            }}
          >
            <MenuItem onClick={() => navigate(`/profile/${user._id}`)}>
              <FlexBetween gap="1rem" width="100%">
                <UserImage image={user.picturePath} size="32px" />
                <Box>
                  <Typography fontSize="0.85rem" fontWeight="500">
                    {fullName}
                  </Typography>
                  <Typography fontSize="0.75rem" color={medium}>
                    Profili Görüntüle
                  </Typography>
                </Box>
              </FlexBetween>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>Çıkış</MenuItem>
          </MuiMenu>
        </FlexBetween>
      ) : (
        <FlexBetween gap="1rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton onClick={handleNotificationClick}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon sx={{ fontSize: "25px" }} />
            </Badge>
          </IconButton>
          <IconButton
            onClick={handleProfileClick}
            size="small"
            sx={{ padding: 0 }}
          >
            <UserImage image={user.picturePath} size="32px" />
          </IconButton>
        </FlexBetween>
      )}

      {/* Bildirim Menüsü */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 360,
            maxHeight: "80vh",
            overflowY: "auto",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {notifications.length === 0 ? (
          <MenuItem>
            <Typography>Bildirim bulunmuyor</Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification._id}
              onClick={() => {
                handleNotificationClose();
                if (notification.postId) {
                  navigate(`/profile/${notification.userId}?postId=${notification.postId}`);
                } else {
                  navigate(`/profile/${notification.fromUser._id}`);
                }
              }}
              sx={{
                py: 1,
                px: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                backgroundColor: notification.read ? "transparent" : "action.hover",
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <UserImage image={notification.fromUser.picturePath} size="40px" />
                <Box>
                  <Typography variant="body2">
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(notification.createdAt).toLocaleString("tr-TR")}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </FlexBetween>
  );
};

export default Navbar;
