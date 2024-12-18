// src/api/index.ts
// Базовая настройка API, глобальный хендлинг ошибок на уровне вызова
// Возвращаем JSON или бросаем ошибку. Вызовы делаются из других модулей.


const BASE_URL = 'http://185.178.47.42:7000';

interface RequestOptions {
    method: string;
    headers?: Record<string, string>;
    body?: BodyInit | null;
}

async function request(url: string, options: RequestOptions) {
    let resp: Response;
    try {
        resp = await fetch(`${BASE_URL}${url}`, options);
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
        headers: {'Content-Type': 'application/json'},
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

export { BASE_URL };
