import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Hakkımızda
        </Typography>
        <Typography color={medium}>@{new Date().getFullYear()}</Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src="http://localhost:3001/assets/iletisimbaskanligi.jpg"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography color={main}>İletişim Başkanlığı</Typography>
        <Typography color={medium}>www.iletisim.gov.tr</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
      24 Temmuz 2018 tarih ve 30488 sayılı Resmi Gazetede yayınlanan 14 numaralı Cumhurbaşkanlığı Kararnamesi ile kurulan ve hizmet vermeye başlayan, İletişim Başkanlığı, ülkemizin en yeni kurumları arasında yer almaktadır.
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
