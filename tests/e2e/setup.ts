import { Page } from 'playwright';

export async function makeLogin(page: Page) {
    await page.goto("localhost:3070");
    await page.waitForURL("**/login")

    await page.fill('input[type="text"]', "123456");
    await page.fill('input[type="password"]', "password");
    await page.click("text=Continue");  
}