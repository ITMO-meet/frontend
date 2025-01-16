import { expect } from '@playwright/test';
import { makeLogin } from './utils';
import { page } from './setup';

describe('Navigation', function() {
    it('Test navigation', async function() {
        await makeLogin(page);

        // click buttons
        const buttons = ["Чаты", "Мэтчи", "Лента", "Тесты", "Профиль", "Чаты"]
        // check url
        const urls = ["/chats", "/matches", "/feed", "/tests", "/profile", "/chats"]

        for (let index = 0; index < buttons.length; index++) {
            const buttonText = buttons[index];
            const urlText = urls[index];
            
            await page.click(`text=${buttonText}`, {timeout: 5000});
            const url = await page.url(); 
            await expect(url).toContain(urlText);
        }
    });
});