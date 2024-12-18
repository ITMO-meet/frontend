// tests/unit/auth.spec.ts
import { loginUser } from '../../src/api/auth';
import * as apiIndex from '../../src/api/index';

jest.mock('../../src/api/index', () => ({
    __esModule: true,
    postJson: jest.fn(),
}));

describe('auth API', () => {
    const mockPostJson = apiIndex.postJson as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('loginUser calls /auth/login_with_password and transforms response', async () => {
        mockPostJson.mockResolvedValue({ redirect: '/some-route', isu: 999999 });
        const result = await loginUser('myuser', 'mypassword');
        expect(mockPostJson).toHaveBeenCalledWith('/auth/login_with_password', { username: 'myuser', password: 'mypassword' });
        expect(result).toEqual({ redirectUrl: '/some-route', isu: 999999 });
    });
});
