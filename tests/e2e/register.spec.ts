import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { expect } from '@playwright/test';
import { page } from './setup';
import { BASE_URL } from './utils';

describe('Register page', function() {
    beforeEach(async function() {
        await page.goto(BASE_URL);
        await page.waitForURL("**/login");

        await page.goto(`${BASE_URL}/#/register`);
        await page.waitForURL("**/register");

        // check url
        let url = await page.url(); 
        await expect(url).toContain("/register");

        // check page
        await expect(await page.locator("text=Registration")).toHaveCount(1);
    });
    
    it('Test register', async function() {
        // username
        await expect(await page.locator("text=Enter your username")).toHaveCount(1);
        await page.fill('input[type="text"]', "username");
        await page.locator("text=NEXT").click({timeout: 5000}); 
        
        // bio
        await expect(await page.locator("text=Enter information about yourself")).toHaveCount(1);
        await page.fill('textarea', "bio...");
        await page.locator("text=NEXT").click({timeout: 5000});
        
        // main features
        await expect(await page.locator("text=Enter some main information")).toHaveCount(1);
        await page.click("text=None", {timeout: 5000});
        await page.click("text=Cancer", {timeout: 5000});
        await page.locator("text=NEXT").click({timeout: 5000});
        
        // dating
        await expect(await page.locator("text=Dating Settings")).toHaveCount(1);
        await page.click("text=Male", {timeout: 5000});
        await page.locator("text=NEXT").click({timeout: 5000});
        
        // interests
        await expect(await page.locator("text=Main Interests")).toHaveCount(1);
        await page.click("text=Спорт", {timeout: 5000});
        await page.locator("text=NEXT").click({timeout: 5000});
        
        // photo 
        await expect(await page.locator("text=Upload your photo")).toHaveCount(1);
        await page.locator('input[type="file"]').setInputFiles("tests/data/photo.png");
        await page.locator('[data-testid="EditIcon"]').click({timeout: 5000});
        await page.locator('text=Save').click({timeout: 5000});
        await page.locator("text=NEXT").click({timeout: 5000});
        
        // photos
        await expect(await page.locator("text=Add photo")).toHaveCount(1);
        await page.locator('input[type="file"]').first().setInputFiles("tests/data/photo.png");
        await page.locator("text=NEXT").click({timeout: 5000});
        
        await expect(await page.locator("text=What are you looking for?")).toHaveCount(1);
        await page.locator("text=Знакомства").click({timeout: 5000});
        await page.locator("text=NEXT").click({timeout: 5000});
        
        let url = await page.url(); 
        await expect(url).toContain("/tests/");
    });
    
    it('Test Navigation', async function() {
        // username
        await expect(await page.locator("text=Enter your username")).toHaveCount(1);
        await page.fill('input[type="text"]', "username");
        await page.locator("text=NEXT").click({timeout: 5000}); 
        
        // bio
        await expect(await page.locator("text=Enter information about yourself")).toHaveCount(1);
        await page.locator('[data-testid="WestIcon"]').click({timeout: 5000});
        
        // return to username
        await expect(await page.locator("text=Enter your username")).toHaveCount(1);
    });

});