import {
  EditOutlined,
  DeleteOutlined,
  ImageOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const handlePost = async () => {
    try {
      setIsLoading(true);
      setError("");
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post);
      
      if (image) {
        formData.append("picture", image);
      }

      console.log("Gönderi oluşturuluyor:", {
        description: post,
        hasImage: Boolean(image),
        imageDetails: image ? {
          name: image.name,
          type: image.type,
          size: image.size
        } : null
      });

      const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gönderi paylaşılırken bir hata oluştu");
      }

      const posts = await response.json();
      console.log("Gönderi başarıyla oluşturuldu:", posts);
      
      dispatch(setPosts({ posts }));
      setImage(null);
      setPost("");
      setIsImage(false);
    } catch (error) {
      console.error("Gönderi oluşturma hatası:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="Aklından neler geçiyor?"
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>

      {error && (
        <Typography 
          color="error" 
          sx={{ 
            mt: "1rem",
            textAlign: "center"
          }}
        >
          {error}
        </Typography>
      )}

      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png,.gif,.mp4,.pdf"
            multiple={false}
            onDrop={(acceptedFiles) => {
              if (acceptedFiles && acceptedFiles.length > 0) {
                console.log("Seçilen dosya:", acceptedFiles[0]);
                setImage(acceptedFiles[0]);
                setError("");
              }
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Dosya eklemek için tıklayın veya sürükleyin</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage(null);
                    }}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Medya
          </Typography>
        </FlexBetween>

        <Button
          disabled={(!post && !image) || isLoading}
          onClick={handlePost}
          sx={{
            color: "white",
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
            minWidth: "100px",
            padding: "0.5rem 2rem",
            "&:hover": {
              backgroundColor: palette.primary.dark,
              color: "white",
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Paylaş"
          )}
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
