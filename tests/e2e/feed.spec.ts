import { makeLogin } from './utils';
import { expect } from '@playwright/test';
import { page } from './setup';

describe('Feed page', function() {
    beforeEach(async function() {
        await makeLogin(page);
        await page.click("text=Лента"); 

        await expect(await page.url()).toContain("/feed");
    });

    it('Test Render', async function() {
        // check text
        await expect(await page.locator("text=Поиск")).toHaveCount(1);
        await expect(await page.locator("text=Фильтры")).toHaveCount(1);
        await expect(await page.locator('[data-testid="CloseIcon"]')).toHaveCount(1);
        await expect(await page.locator('[data-testid="StarIcon"]')).toHaveCount(1);
    });

    it('Test Filters', async function() {
        // open filters
        await page.locator("text=Фильтры").click({timeout: 5000});
        // await expect(await page.locator('button[aria-pressed="true"]')).toHaveCount(1);

        // click buttons
        await page.locator("text=Мужчины").click({timeout: 5000});
        await page.locator("text=Женщины").click({timeout: 5000});
        await page.locator("text=Неважно").click({timeout: 5000});

        await page.locator('div').filter({ hasText: /^Фильтры$/ }).getByRole('button').click({timeout: 5000});

        // check filters saved
        await page.locator("text=Фильтры").click({timeout: 5000});
        await expect(await page.locator('button[value="Everyone"][aria-pressed="true"]')).toHaveCount(1);
    });
});