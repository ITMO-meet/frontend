import { NODE_ENV, POST_CLIENT_ITEM_ACCESS_TOKEN } from "./env"

export const rollbarConfig = {
  accessToken: POST_CLIENT_ITEM_ACCESS_TOKEN,
  environment: NODE_ENV,
  captureUncaught: true,
  captureUnhandledRejections: true,
}