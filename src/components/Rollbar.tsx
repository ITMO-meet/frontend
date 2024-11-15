import Rollbar from 'rollbar';
import { getConfig } from '../api/config';


const { ROLLBAR_ACCESS_TOKEN } = getConfig();

const accessToken = ROLLBAR_ACCESS_TOKEN;

const rollbar = new Rollbar({
  accessToken: accessToken,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

export { rollbar, accessToken };
