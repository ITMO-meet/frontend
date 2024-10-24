import { accessToken } from '../../src/Rollbar'; 
import { expect } from 'chai';

describe('Rollbar', () => {
  it('Access token must be hidden!', () => {
    expect(accessToken).to.be.eq("post_client_item_token")
  });
});