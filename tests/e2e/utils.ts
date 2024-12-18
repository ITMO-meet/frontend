import { Page } from 'playwright';

export async function makeLogin(page: Page) {
    await page.goto(BASE_URL);
    await page.waitForURL("**/login")

    await page.fill('input[type="text"]', "123456");
    await page.fill('input[type="password"]', "password");
    await page.click("text=Continue", {timeout: 5000});  
}

export async function setIsu(page: Page, isu: string) {
    await page.evaluate(() => {
        localStorage.setItem("isu", isu);
    })
}

export const BASE_URL = "http://185.178.47.42"
