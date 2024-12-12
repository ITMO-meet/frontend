import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { expect } from 'chai';
import { makeLogin } from './setup';

describe('Navigation', function() {
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

    it('Test navigation', async function() {
        await makeLogin(page);

        let url = await page.url(); 
        expect(url).to.contain("/chats");

        // test go to matches
        await page.click("text=Matches");  
        url = await page.url(); 
        expect(url).to.contain("/matches");

        // test go to feed
        await page.click("text=Feed");  
        url = await page.url(); 
        expect(url).to.contain("/feed");

        // test go to tests
        await page.click("text=Tests");  
        url = await page.url(); 
        expect(url).to.contain("/tests");

        // test go to profile
        await page.click("text=Profile");  
        url = await page.url(); 
        expect(url).to.contain("/profile");

        // test go to chats
        await page.click("text=Chats");  
        url = await page.url(); 
        expect(url).to.contain("/chats");

    });
});