import { createTheme, darken } from '@mui/material';

const theme = createTheme({
    palette: {
      primary: { // black and dark for text
        main: '#1E1E1E',
        light: '#858585',
        dark: '#000',
        contrastText: '#fff',
      },
      secondary: { // blue for buttons
        main: '#3457A9',
        light: '#D6E7FF',
        dark: darken("#3457A9", 0.2),
        contrastText: '#fff',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: 14,
      h1: {
        fontSize: '2rem',
        fontWeight: 500,
      },
    },
  });

export default theme;
