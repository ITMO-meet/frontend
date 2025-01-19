import { page } from './setup';
import { makeLogin } from './utils';
import { expect } from '@playwright/test';

describe('Matches page', function() {
    // beforeEach(async function() {
    //     await makeLogin(page);
    //     await page.click("text=Мэтчи"); 

    //     // check url
    //     await expect(await page.url()).toContain("/matches");
    // });

    // it('Test matches and premium', async function() {
    //     await expect(await page.locator("text=Метчи разблокируются после покупки премиума.")).toHaveCount(1);
    //     await page.click("text=Просмотреть план", {timeout: 5000})
        
    //     // redirect to premium
    //     let url = await page.url(); 
    //     await expect(url).toContain("/premium");
        
    //     // buy premium
    //     await expect(await page.locator("text=Это премиум")).toHaveCount(1);
    //     await page.click("text=Купить премиум", {timeout: 5000})
        
    //     // redirect to profile
    //     url = await page.url(); 
    //     await expect(url).toContain("/profile");
        
    //     // access granted
    //     await expect(await page.locator("text=У вас премиум-аккаунт!")).toHaveCount(1);
    //     await page.click("text=Мэтчи", {timeout: 5000})

    //     // redirect to profile
    //     url = await page.url(); 
    //     await expect(url).toContain("/matches");

    //     // we have access
    //     await expect(await page.locator("text=Метчи разблокируются после покупки премиума.")).toHaveCount(0);
    // });

    // it('Test navigation', async function() {
    //     await expect(await page.locator("text=Метчи разблокируются после покупки премиума.")).toHaveCount(1);
    //     await page.click("text=Просмотреть план", {timeout: 5000})
        
    //     // redirect to premium
    //     let url = await page.url(); 
    //     await expect(url).toContain("/premium");
        
    //     // don't buy premium
    //     await expect(await page.locator("text=Это премиум")).toHaveCount(1);
    //     await page.click('[data-testid="WestIcon"]', {timeout: 5000})
        
    //     // redirect to profile
    //     url = await page.url(); 
    //     await expect(url).toContain("/profile");
        
    //     // access not granted
    //     await expect(await page.locator("text=У вас премиум-аккаунт!")).toHaveCount(0);
    //     await expect(await page.getByText('Краткая информация', { exact: true })).toHaveCount(1);
    //     await page.click("text=Мэтчи", {timeout: 5000})

    //     // redirect to profile
    //     url = await page.url(); 
    //     await expect(url).toContain("/matches");

    //     // we don't have access
    //     await expect(await page.locator("text=Метчи разблокируются после покупки премиума.")).toHaveCount(1);
    // });
});