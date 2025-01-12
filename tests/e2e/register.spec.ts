import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { expect } from '@playwright/test';
import { page } from './setup';
import { BASE_URL } from './utils';

const FAST_TIMEOUT = 2000;

describe('Register page', function() {
    beforeEach(async function() {
        await page.goto(BASE_URL);
        await page.waitForURL("**/login");

        await page.fill('input[type="text"]', "999999");
        await page.fill('input[type="password"]', "test");
        await page.click("text=Continue", {timeout: 5000});  

        // check page
        await expect(await page.locator("text=Registration")).toHaveCount(1);
        await expect(await page.url()).toContain("/register");

    });
    
    it('Test register', async function() {
        // username
        await expect(await page.locator("text=Choose a username")).toHaveCount(1);
        await page.fill('input[type="text"]', "username");
        await page.locator("text=NEXT").click({timeout: 5000}); 
        try {
            await expect(await page.locator("text=Enter information about yourself")).toHaveCount(1, {timeout: FAST_TIMEOUT});
        } catch (error) {
            await expect(await page.locator("text=Choose a username")).toHaveCount(1);
            await page.fill('input[type="text"]', "username2");
            await page.locator("text=NEXT").click({timeout: 5000}); 
        }
        
        // bio
        await expect(await page.locator("text=Enter information about yourself")).toHaveCount(1);
        await page.fill('textarea', "bio...");
        await page.locator("text=NEXT").click({timeout: 5000});
        try {
            await expect(await page.locator("text=Enter some main information")).toHaveCount(1, {timeout: FAST_TIMEOUT});
        } catch (error) {
            await expect(await page.locator("text=Enter information about yourself")).toHaveCount(1);
            await page.fill('textarea', "bio2...");
            await page.locator("text=NEXT").click({timeout: 5000});
        }

        // main features
        await expect(await page.locator("text=Enter some main information")).toHaveCount(1);
        await page.click("text=None", {timeout: 5000});
        await page.click("text=Cancer", {timeout: 5000});
        await page.locator("text=NEXT").click({timeout: 5000});
        try {
            await expect(await page.locator("text=Dating Settings")).toHaveCount(1, {timeout: FAST_TIMEOUT});
        } catch (error) {
            await expect(await page.locator("text=Enter some main information")).toHaveCount(1);
            await page.click("text=Cancer", {timeout: 5000});
            await page.click("text=Leo", {timeout: 5000});
            await page.locator("text=NEXT").click({timeout: 5000});
        }
        
        // dating
        await expect(await page.locator("text=Dating Settings")).toHaveCount(1);
        await page.click("text=Male", {timeout: 5000});
        await page.locator("text=NEXT").click({timeout: 5000});
        try {
            await expect(await page.locator("text=Select Tags")).toHaveCount(1, {timeout: FAST_TIMEOUT});
        } catch (error) {
            await expect(await page.locator("text=Dating Settings")).toHaveCount(1);
            await page.click("text=Female", {timeout: 5000});
            await page.locator("text=NEXT").click({timeout: 5000});
        }
        
        // interests
        await expect(await page.locator("text=Select Tags")).toHaveCount(1);
        await page.click("text=Анекдоты", {timeout: 5000});
        await page.locator("text=NEXT").click({timeout: 5000});
        try {
            await expect(await page.locator("text=Upload your photo")).toHaveCount(1, {timeout: FAST_TIMEOUT});
        } catch (error) {
            await expect(await page.locator("text=Select Tags")).toHaveCount(1);
            await page.click("text=Музыка", {timeout: 5000});
            await page.locator("text=NEXT").click({timeout: 5000});
        }
        
        // photo 
        await expect(await page.locator("text=Upload your photo")).toHaveCount(1);
        await page.locator('input[type="file"]').setInputFiles("tests/data/photo.png");
        await page.locator('[data-testid="EditIcon"]').click({timeout: 5000});
        await page.locator('text=Save').click({timeout: 5000});
        await page.locator("text=NEXT").click({timeout: 5000});
        
        // photos
        await expect(await page.locator("text=Add additional photos")).toHaveCount(1);
        await page.locator('input[type="file"]').first().setInputFiles("tests/data/photo.png");
        await page.locator("text=NEXT").click({timeout: 5000});
        
        // Goal
        await expect(await page.locator("text=What are you looking for?")).toHaveCount(1);
    });
    
    it('Test Navigation', async function() {

        // username
        await expect(await page.locator("text=Choose a username")).toHaveCount(1);
        await page.fill('input[type="text"]', "username");
        await page.locator("text=NEXT").click({timeout: 5000}); 
        try {
            await expect(await page.locator("text=Enter information about yourself")).toHaveCount(1, {timeout: FAST_TIMEOUT});
        } catch (error) {
            await expect(await page.locator("text=Choose a username")).toHaveCount(1);
            await page.fill('input[type="text"]', "username2");
            await page.locator("text=NEXT").click({timeout: 5000}); 
        }
        
        // bio
        await expect(await page.locator("text=Enter information about yourself")).toHaveCount(1);
        await page.locator('[data-testid="WestIcon"]').click({timeout: 5000});
        
        // return to username
        await expect(await page.locator("text=Choose a username")).toHaveCount(1);
    });

});