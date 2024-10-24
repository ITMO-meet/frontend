import Rollbar from 'rollbar';

const accessToken = 'post_client_item_token'

const rollbar = new Rollbar({
  accessToken: accessToken,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

export { rollbar, accessToken };