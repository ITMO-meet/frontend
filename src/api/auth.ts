// src/api/auth.ts
// Логика для аутентификации.
// Обработка ошибок на уровне вызова: бросаем исключения, которые будет обрабатывать UI.

import { postJson } from './index';

export async function loginUser(username: string, password: string): Promise<{ redirectUrl?: string, isu?: number, detail?: string }> {
    const data = await postJson<{ redirect: string, isu: number }>('/auth/login_with_password', { username, password });
    return { redirectUrl: data.redirect, isu: data.isu };
}
