import { expect } from '@playwright/test';
import { page } from './setup';

describe('Example.com Page', function() {
  it('should have the correct title', async function() {
    await page.goto('https://example.com');
    const title = await page.title();
    await expect(title).toEqual('Example Domain');
  });
});