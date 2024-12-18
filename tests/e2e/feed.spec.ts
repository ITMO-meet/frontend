import { makeLogin } from './utils';
import { expect } from '@playwright/test';
import { page } from './setup';

describe('Feed page', function() {
    beforeEach(async function() {
        await makeLogin(page);
        await page.click("text=Profile"); 
    });
});