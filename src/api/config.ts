// src/api/config.ts

interface Config {
    API_BASE_URL: string;
    ROLLBAR_ACCESS_TOKEN: string;
    HMR_URL: string;
}

export const getConfig = (): Config => {
    return {
        API_BASE_URL: 'http://127.0.0.1:1488',
        ROLLBAR_ACCESS_TOKEN: 'post_client_item_token',
        HMR_URL: 'esbuild',

    };
};