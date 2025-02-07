import { Box } from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={image ? `${API_URL}/assets/${image}` : `${API_URL}/assets/default.png`}
      />
    </Box>
  );
};

export default UserImage;
