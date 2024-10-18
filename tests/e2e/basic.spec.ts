import { chromium } from 'playwright';
import { expect } from 'chai';

describe('Example.com Page', function() {
  it('should have the correct title', async function() {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://example.com');
    const title = await page.title();
    expect(title).to.equal('Example Domain');

    await browser.close();
  });
});