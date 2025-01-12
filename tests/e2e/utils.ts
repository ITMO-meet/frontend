import { Page } from 'playwright';

const test_isu = "999999";

export async function makeLogin(page: Page) {
    await page.goto(BASE_URL);
    await page.waitForURL("**/login")

    await setIsu(page, test_isu);
    await page.goto(BASE_URL + "/#/chats");
    await page.waitForURL("**/chats")
}

export async function setIsu(page: Page, isu: string) {
    await page.evaluate((value) => {
        localStorage.setItem("isu", value);
    }, isu)
}

// export const BASE_URL = "http://localhost:3070"
export const BASE_URL = "http://185.178.47.42"
