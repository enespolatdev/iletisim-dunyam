import { Box, useMediaQuery, Typography, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import WidgetWrapper from "components/WidgetWrapper";
import FlexBetween from "components/FlexBetween";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="space-between"
      >
        <Box 
          flexBasis={isNonMobileScreens ? "26%" : undefined}
          position={isNonMobileScreens ? "sticky" : "static"}
          top="2rem"
          height="fit-content"
        >
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id} />
        </Box>
        {isNonMobileScreens && (
          <Box 
            flexBasis="26%"
            position="sticky"
            top="2rem"
            height="calc(100vh - 100px)"
            sx={{
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,0.1)",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "rgba(0,0,0,0.2)",
              },
            }}
          >
            <WidgetWrapper>
              <FlexBetween>
                <Typography color={dark} variant="h5" fontWeight="500">
                  Hakkımızda
                </Typography>
              </FlexBetween>
              <img
                width="100%"
                height="auto"
                alt="advert"
                src={`${API_URL}/assets/iletisimbaskanligi.jpg`}
                style={{
                  borderRadius: "0.75rem",
                  margin: "0.75rem 0",
                }}
              />
              <Typography color={medium} m="0.5rem 0">
                İletişim Dünyam, insanları bir araya getiren ve paylaşımı teşvik eden bir sosyal medya platformudur.
                Burada düşüncelerinizi, anlarınızı ve deneyimlerinizi paylaşabilir, diğer kullanıcılarla etkileşime geçebilirsiniz.
              </Typography>
              <Divider sx={{ margin: "1.25rem 0" }} />
              <FriendListWidget userId={_id} />
            </WidgetWrapper>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
