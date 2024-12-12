import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { expect } from 'chai';

describe('Login page', function() {
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

    it('Test login', async function() {
        await page.goto("localhost:3070");
        await page.waitForURL("**/login")

        // should redirect
        let url = await page.url(); 
        expect(url).to.contain("/login");
        
        const isThereText = await page.locator("text=Login with ITMO.ID").isVisible();        
        expect(isThereText).to.be.true;

        // shoudnt redirect yet
        await page.click("text=Continue");  
        url = await page.url(); 

        expect(url).to.contain("/login");

        await page.fill('input[type="text"]', "123456");
        await page.fill('input[type="password"]', "password");
        await page.click("text=Continue");  
        url = await page.url(); 

        // should redirect
        expect(url).to.not.contain("/login");

    });
});