import React from 'react';
// import Examples from './Examples';
import Auth from './Auth';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import { CssBaseline } from '@mui/material';
import Nav from './Nav';
import '../styles/examples.css';

function App() {
  return (
    <div className='app'>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* <Examples /> */}
        <Auth />
        <div className='nav-container'>
          <Nav />
        </div>
      </ThemeProvider>
    </div>
  )
}

export default App;