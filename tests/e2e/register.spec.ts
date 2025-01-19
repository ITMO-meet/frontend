import { expect } from '@playwright/test';
import { page } from './setup';
import { BASE_FRONT_URL } from './utils';

const FAST_TIMEOUT = 2000;

describe('Register page', function() {
    // beforeEach(async function() {
    //     await page.goto(BASE_FRONT_URL);
    //     await page.waitForURL("**/login");

    //     await page.fill('input[type="text"]', "999999");
    //     await page.fill('input[type="password"]', "test");
    //     await page.click("text=Продолжить", {timeout: 5000});  

    //     // check page
    //     await expect(await page.locator("text=Регистрация")).toHaveCount(1);
    //     await expect(await page.url()).toContain("/register");

    // });
    
    // it('Test register', async function() {
    //     // username
    //     await expect(await page.locator("text=Введите логин")).toHaveCount(1);
    //     await page.fill('input[type="text"]', "username");
    //     await page.locator("text=Продолжить").click({timeout: 5000}); 
    //     try {
    //         await expect(await page.locator("text=Предоставьте краткую информацию о себе")).toHaveCount(1, {timeout: FAST_TIMEOUT});
    //     } catch {
    //         await expect(await page.locator("text=Введите логин")).toHaveCount(1);
    //         await page.fill('input[type="text"]', "username2");
    //         await page.locator("text=Продолжить").click({timeout: 5000}); 
    //     }
        
    //     // bio
    //     await expect(await page.locator("text=Предоставьте краткую информацию о себе")).toHaveCount(1);
    //     await page.fill('textarea', "bio...");
    //     await page.locator("text=Продолжить").click({timeout: 5000});
    //     try {
    //         await expect(await page.locator("text=Введите основную информацию")).toHaveCount(1, {timeout: FAST_TIMEOUT});
    //     } catch {
    //         await expect(await page.locator("text=Предоставьте краткую информацию о себе")).toHaveCount(1);
    //         await page.fill('textarea', "bio2...");
    //         await page.locator("text=Продолжить").click({timeout: 5000});
    //     }

    //     // main features
    //     await expect(await page.locator("text=Введите основную информацию")).toHaveCount(1);
    //     await page.click("text=Нет", {timeout: 5000});
    //     await page.click("text=Рак", {timeout: 5000});
    //     await page.locator("text=Продолжить").click({timeout: 5000});
    //     try {
    //         await expect(await page.locator("text=Настройки знакомств")).toHaveCount(1, {timeout: FAST_TIMEOUT});
    //     } catch {
    //         await expect(await page.locator("text=Введите основную информацию")).toHaveCount(1);
    //         await page.click("text=Рак", {timeout: 5000});
    //         await page.click("text=Лев", {timeout: 5000});
    //         await page.locator("text=Продолжить").click({timeout: 5000});
    //     }
        
    //     // dating
    //     await expect(await page.locator("text=Настройки знакомств")).toHaveCount(1);
    //     await page.click("text=Мужчины", {timeout: 5000});
    //     await page.locator("text=Продолжить").click({timeout: 5000});
    //     try {
    //         await expect(await page.locator("text=Выберите теги")).toHaveCount(1, {timeout: FAST_TIMEOUT});
    //     } catch {
    //         await expect(await page.locator("text=Настройки знакомств")).toHaveCount(1);
    //         await page.click("text=Женщины", {timeout: 5000});
    //         await page.locator("text=Продолжить").click({timeout: 5000});
    //     }
        
    //     // interests
    //     await expect(await page.locator("text=Выберите теги")).toHaveCount(1);
    //     await page.click("text=Анекдоты", {timeout: 5000});
    //     await page.locator("text=Продолжить").click({timeout: 5000});
    //     try {
    //         await expect(await page.locator("text=Выберите основное фото")).toHaveCount(1, {timeout: FAST_TIMEOUT});
    //     } catch {
    //         await expect(await page.locator("text=Выберите теги")).toHaveCount(1);
    //         await page.click("text=Музыка", {timeout: 5000});
    //         await page.locator("text=Продолжить").click({timeout: 5000});
    //     }
        
    //     // photo 
    //     await expect(await page.locator("text=Выберите основное фото")).toHaveCount(1);
    //     await page.locator('input[type="file"]').setInputFiles("tests/data/photo.png");
    //     await page.locator('[data-testid="EditIcon"]').click({timeout: 5000});
    //     await page.locator('text=Save').click({timeout: 5000});
    //     await page.locator("text=Продолжить").click({timeout: 5000});
        
    //     // photos
    //     await expect(await page.locator("text=Выберите дополнительные фотографии")).toHaveCount(1);
    //     await page.locator('input[type="file"]').first().setInputFiles("tests/data/photo.png");
    //     await page.locator("text=Продолжить").click({timeout: 5000});
        
    //     // Goal
    //     await expect(await page.locator("text=Что вы ищите?")).toHaveCount(1);
    // });
    
    // it('Test Navigation', async function() {

    //     // username
    //     await expect(await page.locator("text=Введите логин")).toHaveCount(1);
    //     await page.fill('input[type="text"]', "username");
    //     await page.locator("text=Продолжить").click({timeout: 5000}); 
    //     try {
    //         await expect(await page.locator("text=Предоставьте краткую информацию о себе")).toHaveCount(1, {timeout: FAST_TIMEOUT});
    //     } catch {
    //         await expect(await page.locator("text=Введите логин")).toHaveCount(1);
    //         await page.fill('input[type="text"]', "username2");
    //         await page.locator("text=Продолжить").click({timeout: 5000}); 
    //     }
        
    //     // bio
    //     await expect(await page.locator("text=Предоставьте краткую информацию о себе")).toHaveCount(1);
    //     await page.locator('[data-testid="WestIcon"]').click({timeout: 5000});
        
    //     // return to username
    //     await expect(await page.locator("text=Введите логин")).toHaveCount(1);
    // });

});