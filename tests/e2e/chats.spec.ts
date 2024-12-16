import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { expect } from 'chai';
import { makeLogin } from './setup';

describe('Chats page', function() {
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

    beforeEach(async function() {
        await makeLogin(page);
        await page.click("text=Chats"); 
    });

    it('Test Navigation', async function() {
        let url = await page.url(); 
        expect(url).to.contain("/chats");

        // check text
        expect(await page.getByRole('heading', { name: 'Chats' }).isVisible()).to.be.true;
        expect(await page.locator("text=Activities").isVisible()).to.be.true;
        expect(await page.locator("text=Messages").isVisible()).to.be.true;

        // click activity 
        await page.locator('[data-testid="activity"]').first().click();
        await page.locator('[data-testid="CloseIcon"]').click();
        expect(await page.locator("text=Activities").isVisible()).to.be.true;

        // click chats
        await page.locator('[data-testid="contact"]').first().click();
        url = await page.url(); 
        expect(url).to.contain("/chat/");
        
        // back to chats
        await page.locator('[data-testid="ArrowBackIosIcon"]').click();
        url = await page.url(); 
        expect(url).to.contain("/chats");
    });

    it('Test Search', async function() {
        let url = await page.url(); 
        expect(url).to.contain("/chats");

        // check text
        expect(await page.getByRole('heading', { name: 'Chats' }).isVisible()).to.be.true;
        expect(await page.locator("text=Activities").isVisible()).to.be.true;
        expect(await page.locator("text=Messages").isVisible()).to.be.true;

        // search for rubbish 
        await page.fill('input[type="text"]', "SAJGSFHTFTYRQWGH");
        expect(await page.locator('[data-testid="contact"]').isVisible()).to.be.false;
    });
});