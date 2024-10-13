import Rollbar from 'rollbar';

const rollbar = new Rollbar({
  accessToken: 'post_client_item_token',
  captureUncaught: true,
  captureUnhandledRejections: true,
});

export default rollbar;