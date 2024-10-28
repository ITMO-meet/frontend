import React from 'react';
import Examples from './Examples';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import { CssBaseline } from '@mui/material';
import '../styles/examples.css';

function App() {
  return (
    <div className='app'>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Examples />
      </ThemeProvider>
    </div>
  )
}

export default App;