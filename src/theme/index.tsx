import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#537D8D",
    },
    secondary: {
      main: "#482C3D",
    },
    background: {
      default: "#f7f7f7",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {},
      },
      defaultProps: {
        variant: "contained",
        color: "primary",
        fullWidth: true,
        size: "large",
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {},
      },
      defaultProps: {
        fullWidth: true,
        variant: "outlined",
        InputLabelProps: { shrink: true },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { padding: 24 },
      },
      defaultProps: {
        elevation: 1,
      },
    },
  },
});

export default theme;
