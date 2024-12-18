import { page } from './setup';
import { makeLogin } from './utils';
import { expect } from '@playwright/test';

describe('Feed page', function() {
    beforeEach(async function() {
        await makeLogin(page);
        await page.click("text=Profile"); 
    });
});