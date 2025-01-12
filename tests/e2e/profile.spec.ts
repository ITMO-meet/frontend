import { expect } from '@playwright/test';
import { makeLogin } from './utils';
import { page } from './setup';

describe('Profile', function() {
    beforeEach(async function() {
        await makeLogin(page);
        await page.click("text=Profile", {timeout: 5000}); 

        // check url
        let url = await page.url(); 
        await expect(url).toContain("/profile");
    });
    
    it('Profile settings', async function() {       
        // navigate to settings
        await page.click('[data-testid="SettingsIcon"]', {timeout: 5000});  
        let url = await page.url();
        await expect(url).toContain('/settings');

        // Check the current state of notifications
        await expect(await page.locator("text=Включены")).toHaveCount(1);
        
        // Toggle notifications
        await page.locator('#root').getByText('Уведомления').click({timeout: 5000});
        await page.locator('input[type="checkbox"]').click({timeout: 5000});
        await page.click("text=ЗАКРЫТЬ", {timeout: 5000})
        await expect(await page.locator("text=Выключены")).toHaveCount(1);
        
        // Check the current state of language
        await expect(await page.locator("text=Русский")).toHaveCount(1);
        
        // Open the language selection dialog
        await page.click("text=Язык", {timeout: 5000});
        await page.click("text=Английский", {timeout: 5000});
        await expect(await page.locator('#root').getByText('Английский')).toHaveCount(1);
        
        // Problem
        await page.click('text=Сообщить о проблеме', {timeout: 5000});
        await expect(await page.locator('label')).toHaveCount(1);
        await page.click("text=ЗАКРЫТЬ", {timeout: 5000})
        
        // Exit
        await page.click('text=Выйти', {timeout: 5000});
        await expect(await page.locator('text=Вы уверены, что хотите выйти')).toHaveCount(1);
        await page.getByRole('button', { name: 'Да' }).click({timeout: 5000});
        
        url = await page.url();
        await expect(url).toContain('/login');
    });
    
    it('should display all fields and allow editing', async () => {
        await page.click('[data-testid="EditIcon"]', {timeout: 5000});  
        await expect(await page.url()).toContain('/edit-profile');
        
        // Изменение текста в поле Username
        await page.getByRole('heading', { name: 'Username' }).click({timeout: 5000});
        await expect(await page.getByPlaceholder('Edit your username...')).toHaveCount(1);
        await page.click('text=Cancel', {timeout: 5000});

        // Изменение текста в поле Bio
        await page.getByText('Bio', { exact: true }).click({timeout: 5000});
        await expect(await page.getByPlaceholder('Edit your bio...')).toHaveCount(1);
        await page.click('text=Cancel', {timeout: 5000});
        
        // Проверка секции Target
        const h6Locator = page.locator('h6', { hasText: 'Target' });
        const buttonLocator = h6Locator.locator('xpath=following-sibling::button');
        await buttonLocator.click({timeout: 5000});
        await expect(await page.locator('text=Укажите вашу цель')).toHaveCount(1);
        await page.click('text=Отмена', {timeout: 5000});
        
        // Проверка возможности выбора основных параметров
        await page.locator('text=Height').click({timeout: 5000});
        await expect(await page.getByRole('heading', { name: 'Height' })).toHaveCount(1);
        await page.locator(".MuiDialog-root").locator('text=Save').click({timeout: 5000});
        
        await page.locator('text=Weight').click({timeout: 5000});
        await expect(await page.getByRole('heading', { name: 'Weight' })).toHaveCount(1);
        await page.locator(".MuiDialog-root").locator('text=Save').click({timeout: 5000});

        // Проверка секции Worldview
        await page.locator('text=Worldview').click({timeout: 5000});
        await expect(await page.getByRole('heading', { name: 'Worldview' })).toHaveCount(1);
        await page.locator(".MuiDialog-root").locator('text=Save').click({timeout: 5000});
        
        // Проверка секции Zodiac
        await page.locator('text=Zodiac Sign').click({timeout: 5000});
        await expect(await page.getByRole('heading', { name: 'Zodiac Sign' })).toHaveCount(1);
        await page.locator(".MuiDialog-root").locator('text=Save').click({timeout: 5000});
        
        // Проверка секции Children
        await page.locator('text=Children').click({timeout: 5000});
        await expect(await page.getByRole('heading', { name: 'Children' })).toHaveCount(1);
        await page.locator(".MuiDialog-root").locator('text=Save').click({timeout: 5000});
        
        // Проверка секции Languages
        await page.locator('text=Languages').click({timeout: 5000});
        await expect(await page.getByRole('heading', { name: 'Languages' })).toHaveCount(1);
        await page.locator(".MuiDialog-root").locator('text=Save').click({timeout: 5000});
        
        // Проверка секции Alcohol
        await page.locator('text=Alcohol').click({timeout: 5000});
        await expect(await page.getByRole('heading', { name: 'Alcohol' })).toHaveCount(1);
        await page.locator(".MuiDialog-root").locator('text=Save').click({timeout: 5000});
        
        // Проверка секции Smoking
        await page.locator('text=Smoking').click({timeout: 5000});
        await expect(await page.getByRole('heading', { name: 'Smoking' })).toHaveCount(1);
        await page.locator(".MuiDialog-root").locator('text=Save').click({timeout: 5000});

        // Проверка секции Premium
        await page.locator('text=Premium').click({timeout: 5000});
        await expect(await page.url()).toContain('/premium');
    });

    it('saves settings', async () => {
        await page.click('[data-testid="EditIcon"]', {timeout: 5000});  
        
        // Изменение текста в поле Username
        await page.getByRole('heading', { name: 'Username' }).click({timeout: 5000});
        await page.getByPlaceholder('Edit your username...').fill("Some username");
        await page.locator(".MuiDialog-root").locator('text=Save').click({timeout: 5000});

        // Изменение текста в поле Bio
        await page.getByText('Bio', { exact: true }).click({timeout: 5000});
        await page.getByPlaceholder('Edit your bio...').fill("Some bio...");
        await page.locator(".MuiDialog-root").locator('text=Save').click({timeout: 5000});
        
        // Изменение секции Target
        const h6Locator = page.locator('h6', { hasText: 'Target' });
        const buttonLocator = h6Locator.locator('xpath=following-sibling::button');
        await buttonLocator.click({timeout: 5000});
        await page.click('text=Looking for casual Chat', {timeout: 5000});
        await page.click('text=Сохранить', {timeout: 5000});
        
        // Изменение секции Zodiac
        await page.locator('text=Zodiac Sign').click({timeout: 5000});
        await page.getByRole('button', { name: 'None' }).click({timeout: 5000});
        await page.locator(".MuiDialog-root").locator('text=Save').click({timeout: 5000});
        
        // Проверить, что изменения применились
        await page.locator('[data-testid=BackToProfile]').click({timeout: 5000});
        // await expect(await page.locator("text=Some username")).toHaveCount(1);
        await expect(await page.locator("text=Some bio...")).toHaveCount(1);
        await expect(await page.getByText("None")).toHaveCount(1);
        await page.click('[data-testid="EditIcon"]', {timeout: 5000});  
        await expect(await page.locator("text=Casual Chat")).toHaveCount(1);

    });

    it('profile navigation', async () => {
        await page.click('[data-testid="SettingsIcon"]', {timeout: 5000});  
        let url = await page.url();
        await expect(url).toContain('/settings');

        await page.locator('[data-testid=BackToProfile]').click({timeout: 5000});
        url = await page.url();
        await expect(url).toContain('/profile');

        await page.click('[data-testid="EditIcon"]', {timeout: 5000});  
        url = await page.url();
        await expect(url).toContain('/edit-profile');

        await page.locator('[data-testid=BackToProfile]').click({timeout: 5000});
        url = await page.url();
        await expect(url).toContain('/profile');

        await page.locator('text=Premium').click({timeout: 5000});
        url = await page.url();
        await expect(url).toContain('/premium');
    });
});