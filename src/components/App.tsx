import React from 'react';
import Rollbar from 'rollbar';

const rollbar = new Rollbar({
    accessToken: 'YOUR_ROLLBAR_ACCESS_TOKEN',
    captureUncaught: true,
    captureUnhandledRejections: true,
});

const App: React.FC = () => {
    return <div>Hello, World!</div>;
};

export default App;