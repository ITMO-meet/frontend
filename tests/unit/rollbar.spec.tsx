import { accessToken } from '../../src/components/Rollbar';

describe('Rollbar', () => {
  it('Access token must be hidden!', () => {
    expect(accessToken).toBe("post_client_item_token")
  });
});