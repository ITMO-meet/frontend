import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import rollbar from './Rollbar';

// rollbar.error("Init message!");
ReactDOM.render(<App />, document.getElementById('root'));