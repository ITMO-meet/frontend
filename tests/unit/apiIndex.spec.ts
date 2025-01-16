// tests/unit/apiIndex.spec.ts
import { postJson, postForm, getJson, putJson } from '../../src/api/index';

describe('api/index', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
        jest.clearAllMocks();
    });

    it('postJson calls fetch with correct options', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ success: true })
        });
        const result = await postJson<{ success: boolean }>('/test', { foo: 'bar' });
        expect(fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ foo: 'bar' })
        }));
        expect(result).toEqual({ success: true });
    });

    it('postForm sends form data', async () => {
        (fetch as jest.Mock).mockResolvedValue({ ok: true });
        const formData = new FormData();
        formData.append('file', new File(['dummy'], 'test.png'));
        await postForm('/upload', formData);
        expect(fetch).toHaveBeenCalledWith('/api/upload', {
            method: 'POST',
            body: formData
        });
    });

    it('getJson calls fetch and returns JSON', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ some: 'data' })
        });
        const result = await getJson<{ some: string }>('/something');
        expect(fetch).toHaveBeenCalledWith('/api/something', { method: 'GET' });
        expect(result).toEqual({ some: 'data' });
    });

    it('putJson calls fetch with correct options', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ success: true })
        });
    
        const result = await putJson<{ success: boolean }>('/test', { foo: 'bar' });
    
        expect(fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify({ foo: 'bar' })
        }));
        expect(result).toEqual({ success: true });
    });

    it('throws on network error', async () => {
        (fetch as jest.Mock).mockRejectedValue(new Error('Network down'));
        await expect(getJson('/fail')).rejects.toThrow('Network error: Network down');
    });

    it('throws on http error', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: false,
            status: 404,
            text: () => Promise.resolve('Not Found')
        });
        await expect(getJson('/404')).rejects.toThrow('HTTP 404: Not Found');
    });
});
