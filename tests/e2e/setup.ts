import { chromium, Browser, BrowserContext, Page } from 'playwright';

let browser: Browser;
let context: BrowserContext;
export let page: Page;

before(async () => {
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
});

after(async () => {
  await browser.close();
});

