import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#e91e63', // Pink color
    },
    secondary: {
      main: '#f8bbd0', // Light pink color
    },
    background: {
      default: '#fce4ec', // Pinkish background
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      color: '#880e4f', // Darker pink for headers
    },
    body1: {
      color: '#880e4f',
    },
  },
});

export default theme;