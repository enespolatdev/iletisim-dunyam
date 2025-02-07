// color design tokens export
export const colorTokens = {
  grey: {
    0: "#FFFFFF",
    10: "#F6F6F6",
    50: "#F0F0F0",
    100: "#E0E0E0",
    200: "#C2C2C2",
    300: "#A3A3A3",
    400: "#858585",
    500: "#666666",
    600: "#4D4D4D",
    700: "#333333",
    800: "#1A1A1A",
    900: "#0A0A0A",
    1000: "#000000",
  },
  primary: {
    50: "#E3F2FD",  // En açık mavi
    100: "#BBDEFB",
    200: "#90CAF9",
    300: "#64B5F6",
    400: "#42A5F5",
    500: "#2196F3", // Ana mavi
    600: "#1E88E5",
    700: "#1976D2",
    800: "#1565C0",
    900: "#0D47A1", // En koyu mavi
  },
};

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // dark mode
            primary: {
              dark: colorTokens.primary[200],
              main: colorTokens.primary[300],
              light: colorTokens.primary[800],
            },
            neutral: {
              dark: colorTokens.grey[100],
              main: colorTokens.grey[200],
              mediumMain: colorTokens.grey[300],
              medium: colorTokens.grey[400],
              light: colorTokens.grey[700],
            },
            background: {
              default: colorTokens.grey[900],
              alt: colorTokens.grey[800],
              light: colorTokens.grey[700],
            },
          }
        : {
            // light mode
            primary: {
              dark: colorTokens.primary[700],
              main: colorTokens.primary[500],
              light: colorTokens.primary[50],
            },
            neutral: {
              dark: colorTokens.grey[700],
              main: colorTokens.grey[500],
              mediumMain: colorTokens.grey[400],
              medium: colorTokens.grey[300],
              light: colorTokens.grey[50],
            },
            background: {
              default: colorTokens.grey[10],
              alt: colorTokens.grey[0],
              light: colorTokens.grey[50],
            },
          }),
    },
    typography: {
      fontFamily: ["Rubik", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "25px",
            textTransform: "none",
            fontWeight: 600,
            padding: "8px 20px",
            transition: "all 0.3s ease",
            fontSize: "0.95rem",
            boxShadow: mode === "dark"
              ? "0 4px 8px rgba(0, 0, 0, 0.2)"
              : "0 4px 12px rgba(33, 150, 243, 0.2)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: mode === "dark"
                ? "0 6px 12px rgba(0, 0, 0, 0.3)"
                : "0 6px 16px rgba(33, 150, 243, 0.3)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
            "&.MuiButton-contained": {
              background: mode === "dark"
                ? `linear-gradient(45deg, ${colorTokens.primary[700]}, ${colorTokens.primary[500]})`
                : `linear-gradient(45deg, ${colorTokens.primary[500]}, ${colorTokens.primary[300]})`,
              color: mode === "dark" ? "#fff" : "#fff",
              "&:hover": {
                background: mode === "dark"
                  ? `linear-gradient(45deg, ${colorTokens.primary[600]}, ${colorTokens.primary[400]})`
                  : `linear-gradient(45deg, ${colorTokens.primary[400]}, ${colorTokens.primary[200]})`,
              }
            },
            "&.MuiButton-outlined": {
              borderWidth: "2px",
              "&:hover": {
                borderWidth: "2px",
                background: mode === "dark"
                  ? "rgba(33, 150, 243, 0.1)"
                  : "rgba(33, 150, 243, 0.05)",
              }
            }
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            boxShadow: mode === "dark" 
              ? "0 4px 6px rgba(0, 0, 0, 0.2)"
              : "0 4px 6px rgba(33, 150, 243, 0.1)", // Mavi gölge
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: mode === "dark"
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(33, 150, 243, 0.08)", // Mavi hover efekti
            },
          },
        },
      },
    },
  };
};
