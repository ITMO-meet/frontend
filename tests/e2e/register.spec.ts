import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { expect } from '@playwright/test';
import { page } from './setup';

describe('Register page', function() {
    // beforeEach(async function() {
    //     await page.goto("http://localhost:3070");
    //     await page.waitForURL("**/login");
    // });

    // it('Test register', async function() {
    //     await page.goto("http://localhost:3070/#/register");
    //     await page.waitForURL("**/register");

    //     // check url
    //     let url = await page.url(); 
    //     expect(url).to.contain("/register");
        
    //     // check page
    //     expect(await page.locator("text=Registration").isVisible()).to.be.true;

    //     // username
    //     expect(await page.locator("text=Enter your username").isVisible()).to.be.true;
    //     await page.fill('input[type="text"]', "username");
    //     await page.locator("text=NEXT").click(); 

    //     // bio
    //     expect(await page.locator("text=Enter information about yourself").isVisible()).to.be.true;
    //     await page.fill('textarea', "bio...");
    //     await page.locator("text=NEXT").click();
        
    //     // main features
    //     expect(await page.locator("text=Enter some main information").isVisible()).to.be.true;
    //     await page.click("text=None");
    //     await page.click("text=Cancer");
    //     await page.locator("text=NEXT").click();

    //     // dating
    //     expect(await page.locator("text=Dating Settings").isVisible()).to.be.true;
    //     await page.click("text=Male");
    //     await page.locator("text=NEXT").click();

    //     // interests
    //     expect(await page.locator("text=Main Interests").isVisible()).to.be.true;
    //     await page.click("text=Спорт");
    //     await page.locator("text=NEXT").click();

    //     // photo 
    //     expect(await page.locator("text=Upload your photo").isVisible()).to.be.true;
    //     await page.locator('input[type="file"]').setInputFiles("tests/data/photo.png");
    //     await page.locator('[data-testid="EditIcon"]');
    //     await page.locator('text=Save');
    //     await page.locator("text=NEXT").click();

    //     // photos
    //     expect(await page.locator("text=Add photo").isVisible()).to.be.true;
    //     await page.locator('input[type="file"]').first().setInputFiles("tests/data/photo.png");
    //     await page.locator("text=NEXT").click();
        
    //     expect(await page.locator("text=What are you looking for?").isVisible()).to.be.true;
    //     await page.locator("text=Знакомства").click();
    //     // await page.locator("text=NEXT").click();
    // });

    // it('Test Navigation', async function() {
    //     await page.goto("http://localhost:3070/#/register");
    //     await page.waitForURL("**/register")

    //     // check url
    //     let url = await page.url(); 
    //     expect(url).to.contain("/register");
        
    //     // check page
    //     expect(await page.locator("text=Registration").isVisible()).to.be.true;

    //     // username
    //     expect(await page.locator("text=Enter your username").isVisible()).to.be.true;
    //     await page.fill('input[type="text"]', "username");
    //     await page.locator("text=NEXT").click(); 

    //     // bio
    //     expect(await page.locator("text=Enter information about yourself").isVisible()).to.be.true;
    //     await page.locator('[data-testid="WestIcon"]');

    //     // return to username
    //     expect(await page.locator("text=Enter your username").isVisible()).to.be.true;
    // });

});