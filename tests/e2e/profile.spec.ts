import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { expect } from 'chai';
import { makeLogin } from './setup';

describe('Profile', function() {
    let browser: Browser;
    let context: BrowserContext;
    let page: Page;

    before(async function() {
        browser = await chromium.launch();
        context = await browser.newContext();
        page = await context.newPage();
    });

    after(async function() {
        await browser.close();
    });

    beforeEach(async function() {
        await makeLogin(page);
        await page.click("text=Profile"); 
    });
    

    it('Profile settings', async function() {       
        // navigate to settings
        await page.click('[data-testid="SettingsIcon"]');  
        let url = await page.url();
        expect(url).to.contain('/settings');

        // Check the current state of notifications
        expect(await page.locator("text=Включены").isVisible()).to.be.true;
        
        // Toggle notifications
        await page.locator('#root').getByText('Уведомления').click();
        await page.locator('input[type="checkbox"]').click();
        await page.click("text=ЗАКРЫТЬ")
        expect(await page.locator("text=Выключены").isVisible()).to.be.true;

        // Check the current state of language
        expect(await page.locator("text=Русский").isVisible()).to.be.true;

        // Open the language selection dialog
        await page.click("text=Язык");
        await page.click("text=Английский");
        expect(await page.locator('#root').getByText('Английский').isVisible()).to.be.true;

        // Problem
        await page.click('text=Сообщить о проблеме');
        expect(await page.locator('label').isVisible()).to.be.true;
        await page.click("text=ЗАКРЫТЬ")

        // Exit
        await page.click('text=Выйти');
        expect(await page.locator('text=Вы уверены, что хотите выйти').isVisible()).to.be.true;
        await page.getByRole('button', { name: 'Да' }).click();

        url = await page.url();
        expect(url).to.contain('/login');
    });

    it('should display all fields and allow editing', async () => {
        await page.click('[data-testid="EditIcon"]');  
        let url = await page.url();
        expect(url).to.contain('/edit-profile');

        // Проверка поля Bio
        expect(await page.locator('text=Bio').isVisible()).to.be.true;

        // Изменение текста в поле Bio
        await page.locator('text=Bio').click();
        expect(await page.getByPlaceholder('Edit your bio...').isVisible()).to.be.true;
        await page.click('text=Cancel');

        // Проверка секции Target
        await page.click('text=Romantic relationships');
        expect(await page.locator('text=Укажите вашу цель').isVisible()).to.be.true;
        await page.click('text=Отмена');

        // Проверка возможности выбора основных параметров
        await page.locator('button[name="Choose Height"]').click();
        expect(await page.getByRole('heading', { name: 'Height' }).isVisible()).to.be.true;
        await page.click('text=Save');

        // Проверка секции Worldview
        await page.locator('button[name="Choose Worldview"]').click();
        expect(await page.getByRole('heading', { name: 'Worldview' }).isVisible()).to.be.true;
        await page.click('text=Save');

        // Проверка секции Zodiac
        await page.locator('button[name="Choose Zodiac Sign"]').click();
        expect(await page.getByRole('heading', { name: 'Zodiac Sign' }).isVisible()).to.be.true;
        await page.click('text=Save');

        // Проверка секции Children
        await page.locator('button[name="Choose Children"]').click();
        expect(await page.getByRole('heading', { name: 'Children' }).isVisible()).to.be.true;
        await page.click('text=Save');

        // Проверка секции Children
        await page.locator('button[name="Choose Languages"]').click();
        expect(await page.getByRole('heading', { name: 'Languages' }).isVisible()).to.be.true;
        await page.click('text=Save');

        // Проверка секции Alcohol
        await page.locator('button[name="Choose Alcohol"]').click();
        expect(await page.getByRole('heading', { name: 'Alcohol' }).isVisible()).to.be.true;
        await page.click('text=Save');

        // Проверка секции Smoking
        await page.locator('button[name="Choose Smoking"]').click();
        expect(await page.getByRole('heading', { name: 'Smoking' }).isVisible()).to.be.true;
        await page.click('text=Save');

        // Проверка секции Premium
        await page.locator('text=Premium').click();
        url = await page.url();
        expect(url).to.contain('/premium');
    });

    it('profile navigation', async () => {
        await page.click('[data-testid="SettingsIcon"]');  
        let url = await page.url();
        expect(url).to.contain('/settings');

        await page.locator('[data-testid=BackToProfile]').click();
        url = await page.url();
        expect(url).to.contain('/profile');

        await page.click('[data-testid="EditIcon"]');  
        url = await page.url();
        expect(url).to.contain('/edit-profile');

        await page.locator('[data-testid=BackToProfile]').click();
        url = await page.url();
        expect(url).to.contain('/profile');

        await page.locator('text=Premium').click();
        url = await page.url();
        expect(url).to.contain('/premium');
    });
});