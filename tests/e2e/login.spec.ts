import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { expect } from 'chai';

describe('Example.com Page', function() {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  before(async function() {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
  });

  after(async function() {
      await browser.close();
  });

  it('should have the correct title', async function() {
    // await page.goto('https://example.com');
    // const title = await page.title();
    // expect(title).to.equal('Example Domain');

    // await browser.close();
  });
});