import { BASE_URL } from './utils';
import { page } from './setup';
import { expect } from '@playwright/test';

describe('Login page', function() {
    it('Test login', async function() {
        await page.goto(BASE_URL);
        await page.waitForURL("**/login")

        // should redirect
        let url = await page.url(); 
        await expect(url).toContain("/login");
        await expect(await page.locator("text=Login with ITMO.ID")).toHaveCount(1);
        
        // shoudnt redirect yet
        await page.click("text=Continue", {timeout: 5000});  
        await expect(await page.locator("text=ID must be exactly 6 symbols")).toHaveCount(1);
        url = await page.url(); 
        await expect(url).toContain("/login");

        await page.fill('input[type="text"]', "999999");
        await page.click("text=Continue", {timeout: 5000});  
        await expect(await page.locator("text=Password must not be empty")).toHaveCount(1);
        url = await page.url(); 
        await expect(url).toContain("/login");

        // should redirect
        await page.fill('input[type="password"]', "test");
        await page.click("text=Continue", {timeout: 5000});  

        await expect(await page.locator("text=ID must be exactly 6 symbols")).toHaveCount(0);
        await expect(await page.locator("text=Password must not be empty")).toHaveCount(0);
    });
});