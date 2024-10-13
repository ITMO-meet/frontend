import React from 'react';
import { CssBaseline, Container, Typography } from '@mui/material';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to My React App
        </Typography>
        <Typography variant="body1">
          This is a basic setup for your React application using TypeScript, MobX, and Material-UI.
        </Typography>
      </Container>
    </React.Fragment>
  );
};

export default App;