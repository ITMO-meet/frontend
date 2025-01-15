// src/api/index.ts
// Базовая настройка API, глобальный хендлинг ошибок на уровне вызова
// Возвращаем JSON или бросаем ошибку. Вызовы делаются из других модулей.


// const AUTH_BASE_URL = 'http://185.178.47.42:3000'
const AUTH_BASE_URL = 'http://127.0.0.1:8000'
// const TEST_BASE_URL = 'http://185.178.47.42:7000'
// const BASE_URL = 'http://185.178.47.42:7000';
const BASE_URL = 'http://127.0.0.1:8000';
// const BASE_URL = 'http://127.0.0.1:28000';


interface RequestOptions {
    method: string;
    headers?: Record<string, string>;
    body?: BodyInit | null;
}

export async function request(url: string, options: RequestOptions) {
    let resp: Response;

    const baseUrl = url
        .startsWith("/auth/")
        && !(url.startsWith("/auth/register/upload_carousel") || url.startsWith("/auth/register/upload_logo"))
        ? AUTH_BASE_URL
        : BASE_URL

    try {
        resp = await fetch(`${baseUrl}${url}`, options);
        /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (err: any) {
        // Сетевая ошибка
        throw new Error(`Network error: ${err.message || err}`);
    }

    if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        throw new Error(`HTTP ${resp.status}: ${text || 'Unknown error'}`);
    }
    return resp;
}


export async function postJson<T>(url: string, data: unknown): Promise<T> {
    const resp = await request(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return resp.json() as Promise<T>;
}

export async function postForm(url: string, formData: FormData): Promise<void> {
    await request(url, {
        method: 'POST',
        body: formData
    });
}

export async function getJson<T>(url: string): Promise<T> {
    const resp = await request(url, {
        method: 'GET'
    });
    return resp.json() as Promise<T>;
}

export async function putJson<T>(url: string, data: unknown = {}): Promise<T> {
    const resp = await request(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return resp.json() as Promise<T>;
}

export { BASE_URL };
