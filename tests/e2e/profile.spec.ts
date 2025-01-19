// import { expect } from '@playwright/test';
// import { makeLogin } from './utils';
// import { page } from './setup';

describe('Profile', function() {
    // beforeEach(async function() {
    //     await makeLogin(page);
    //     await page.click("text=Профиль", {timeout: 5000}); 

    //     // check url
    //     await expect(await page.url()).toContain("/profile");
    // });
    
    // it('Profile settings', async function() {       
    //     // navigate to settings
    //     await page.click('[data-testid="SettingsIcon"]', {timeout: 5000});  
    //     let url = await page.url();
    //     await expect(url).toContain('/settings');

    //     // Check the current state of notifications
    //     await expect(await page.locator("text=Включены")).toHaveCount(1);
        
    //     // Toggle notifications
    //     await page.locator('#root').getByText('Уведомления').click({timeout: 5000});
    //     await page.locator('input[type="checkbox"]').click({timeout: 5000});
    //     await page.click("text=ЗАКРЫТЬ", {timeout: 5000})
    //     await expect(await page.locator("text=Выключены")).toHaveCount(1);
        
    //     // Check the current state of language
    //     // await expect(await page.locator("text=Русский")).toHaveCount(1);
        
    //     // Open the language selection dialog
    //     // await page.click("text=Язык", {timeout: 5000});
    //     // await page.click("text=Английский", {timeout: 5000});
    //     // await expect(await page.locator('#root').getByText('Английский')).toHaveCount(1);
        
    //     // Problem
    //     await page.click('text=Сообщить о проблеме', {timeout: 5000});
    //     await expect(await page.locator('label')).toHaveCount(1);
    //     await page.click("text=ЗАКРЫТЬ", {timeout: 5000})
        
    //     // Exit
    //     await page.click('text=Выйти', {timeout: 5000});
    //     await expect(await page.locator('text=Вы уверены, что хотите выйти')).toHaveCount(1);
    //     await page.getByRole('button', { name: 'Да' }).click({timeout: 5000});
        
    //     url = await page.url();
    //     await expect(url).toContain('/login');
    // });
    
    // it('should display all fields and allow editing', async () => {
    //     await page.click('[data-testid="EditIcon"]', {timeout: 5000});  
    //     await expect(await page.url()).toContain('/edit-profile');
        
    //     // Изменение текста в поле Username
    //     await page.getByRole('heading', { name: 'Логин' }).click({timeout: 5000});
    //     await expect(await page.getByPlaceholder('Вы редактируете логин...')).toHaveCount(1);
    //     await page.click('text=Отмена', {timeout: 5000});

    //     // Изменение текста в поле Bio
    //     await page.getByText('Краткая информация', { exact: true }).click({timeout: 5000});
    //     await expect(await page.getByPlaceholder('Вы редактируете краткая информация...')).toHaveCount(1);
    //     await page.click('text=Отмена', {timeout: 5000});
        
    //     // Проверка секции Target
    //     const h6Locator = page.locator('h6', { hasText: 'Цель' });
    //     const buttonLocator = h6Locator.locator('xpath=following-sibling::button');
    //     await buttonLocator.click({timeout: 5000});
    //     await expect(await page.locator('text=Укажите вашу цель')).toHaveCount(1);
    //     await page.click('text=Отмена', {timeout: 5000});
        
    //     // Проверка возможности выбора основных параметров
    //     await page.locator('text=Рост').click({timeout: 5000});
    //     await expect(await page.getByRole('heading', { name: 'Рост' })).toHaveCount(1);
    //     await page.locator(".MuiDialog-root").locator('text=Сохранить').click({timeout: 5000});
        
    //     await page.locator('text=Вес').click({timeout: 5000});
    //     await expect(await page.getByRole('heading', { name: 'Вес' })).toHaveCount(1);
    //     await page.locator(".MuiDialog-root").locator('text=Сохранить').click({timeout: 5000});

    //     // Проверка секции Worldview
    //     await page.locator('text=Мировоззрение').click({timeout: 5000});
    //     await expect(await page.getByRole('heading', { name: 'Мировоззрение' })).toHaveCount(1);
    //     await page.locator(".MuiDialog-root").locator('text=Сохранить').click({timeout: 5000});
        
    //     // Проверка секции Zodiac
    //     await page.locator('text=Знак зодиака').click({timeout: 5000});
    //     await expect(await page.getByRole('heading', { name: 'Знак зодиака' })).toHaveCount(1);
    //     await page.locator(".MuiDialog-root").locator('text=Сохранить').click({timeout: 5000});
        
    //     // Проверка секции Children
    //     await page.locator('text=Дети').click({timeout: 5000});
    //     await expect(await page.getByRole('heading', { name: 'Дети' })).toHaveCount(1);
    //     await page.locator(".MuiDialog-root").locator('text=Сохранить').click({timeout: 5000});
        
    //     // Проверка секции Languages
    //     await page.locator('text=Языки').click({timeout: 5000});
    //     await expect(await page.getByRole('heading', { name: 'Языки' })).toHaveCount(1);
    //     await page.locator(".MuiDialog-root").locator('text=Сохранить').click({timeout: 5000});
        
    //     // Проверка секции Alcohol
    //     await page.locator('text=Алкоголь').click({timeout: 5000});
    //     await expect(await page.getByRole('heading', { name: 'Алкоголь' })).toHaveCount(1);
    //     await page.locator(".MuiDialog-root").locator('text=Сохранить').click({timeout: 5000});
        
    //     // Проверка секции Smoking
    //     await page.locator('text=Курение').click({timeout: 5000});
    //     await expect(await page.getByRole('heading', { name: 'Курение' })).toHaveCount(1);
    //     await page.locator(".MuiDialog-root").locator('text=Сохранить').click({timeout: 5000});

    //     // Проверка секции Premium
    //     await page.locator('text=Премиум').click({timeout: 5000});
    //     await expect(await page.url()).toContain('/premium');
    // });

    // it('saves settings', async () => {
    //     await page.click('[data-testid="EditIcon"]', {timeout: 5000});  
        
    //     // Изменение текста в поле Username
    //     await page.getByRole('heading', { name: 'Логин' }).click({timeout: 5000});
    //     await page.getByPlaceholder('Вы редактируете логин...').fill("Some username");
    //     await page.locator(".MuiDialog-root").locator('text=Сохранить').click({timeout: 5000});

    //     // Изменение текста в поле Bio
    //     await page.getByText('Краткая информация', { exact: true }).click({timeout: 5000});
    //     await page.getByPlaceholder('Вы редактируете краткая информация...').fill("Some bio...");
    //     await page.locator(".MuiDialog-root").locator('text=Сохранить').click({timeout: 5000});
        
    //     // Изменение секции Target
    //     const h6Locator = page.locator('h6', { hasText: 'Цель' });
    //     const buttonLocator = h6Locator.locator('xpath=following-sibling::button');
    //     await buttonLocator.click({timeout: 5000});
    //     await page.click('text=Ищу общение', {timeout: 5000});
    //     await page.locator(".MuiDialog-root").locator('text=Сохранить').click({timeout: 5000});

    //     // Изменение секции Zodiac
    //     await page.locator('text=Знак зодиака').click({timeout: 5000});
    //     await page.getByRole('button', { name: 'Лев' }).click({timeout: 5000});
    //     await page.locator(".MuiDialog-root").locator('text=Сохранить').click({timeout: 5000});
        
    //     // Проверить, что изменения применились
    //     await page.locator('[data-testid=BackToProfile]').click({timeout: 5000});
    //     await expect(await page.locator("text=Some username")).toHaveCount(1);
    //     await expect(await page.locator("text=Some bio...")).toHaveCount(1);
    //     await expect(await page.getByText("Лев")).toHaveCount(1);
    //     await page.click('[data-testid="EditIcon"]', {timeout: 5000});  
    //     await expect(await page.locator("text=Общение")).toHaveCount(1);

    // });

    // it('profile navigation', async () => {
    //     await page.click('[data-testid="SettingsIcon"]', {timeout: 5000});  
    //     let url = await page.url();
    //     await expect(url).toContain('/settings');

    //     await page.locator('[data-testid=BackToProfile]').click({timeout: 5000});
    //     url = await page.url();
    //     await expect(url).toContain('/profile');

    //     await page.click('[data-testid="EditIcon"]', {timeout: 5000});  
    //     url = await page.url();
    //     await expect(url).toContain('/edit-profile');

    //     await page.locator('[data-testid=BackToProfile]').click({timeout: 5000});
    //     url = await page.url();
    //     await expect(url).toContain('/profile');

    //     await page.locator('text=Премиум').click({timeout: 5000});
    //     url = await page.url();
    //     await expect(url).toContain('/premium');
    // });
});