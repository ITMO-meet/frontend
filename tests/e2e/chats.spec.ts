// import { expect } from '@playwright/test';
// import { makeLogin } from './utils';
// import { page } from './setup';

describe('Chats page', function() {
    // beforeEach(async function() {
    //     await makeLogin(page);
    //     await page.click("text=Chats", {timeout: 5000}); 

    //     let url = await page.url(); 
    //     await expect(url).toContain("/chats");

    // });

    // it('Test Navigation', async function() {
    //     // check text
    //     await expect(await page.getByRole('heading', { name: 'Chats' })).toHaveCount(1);
    //     await expect(await page.locator("text=Activities")).toHaveCount(1);
    //     await expect(await page.locator("text=Messages")).toHaveCount(1);

    //     // create activity
    //     await page.locator('[data-testid="AddIcon"]').click({timeout: 5000});
    //     await expect(await page.locator("text=Add a Story")).toHaveCount(1);
    //     await page.locator("text=Cancel").click({timeout: 5000})

    //     // click activity 
    //     await page.locator('span').filter({ hasText: 'Jane Smith2' }).click({timeout: 5000});
    //     await page.locator('[data-testid="CloseIcon"]').click({timeout: 5000});
    //     await expect(await page.locator("text=Activities")).toHaveCount(1);

    //     // click chats
    //     await page.getByRole('button', { name: 'Jane Smith3' }).click({timeout: 5000});
    //     let url = await page.url(); 
    //     await expect(url).toContain("/chat/");
        
    //     // back to chats
    //     await page.locator('[data-testid="ArrowBackIosIcon"]').click({timeout: 5000});
    //     url = await page.url(); 
    //     await expect(url).toContain("/chats");
    // });

    // it('Test Search', async function() {
    //     // check text
    //     await expect(await page.getByRole('heading', { name: 'Chats' })).toHaveCount(1);
    //     await expect(await page.locator("text=Activities")).toHaveCount(1);
    //     await expect(await page.locator("text=Messages")).toHaveCount(1);

    //     // search for rubbish 
    //     await page.fill('input[type="text"]', "SAJGSFHTFTYRQWGH");
    //     await expect(await page.locator("text=Jane Smith3")).toHaveCount(0);
    // });
});