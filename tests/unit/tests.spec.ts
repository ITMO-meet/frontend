// tests/unit/test.spec.ts
import {
    getTest,
    startTest,
    getQuestion,
    answerQuestion,
    completeTest,
    currentResult,
} from '../../src/api/tests'; // Путь к вашему файлу с тестами
import * as apiIndex from '../../src/api/index';

jest.mock('../../src/api/index', () => ({
    __esModule: true,
    postJson: jest.fn(),
    getJson: jest.fn(),
}));

describe('test API', () => {
    const mockPostJson = apiIndex.postJson as jest.Mock;
    const mockGetJson = apiIndex.getJson as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('getTest calls getJson with correct test_id', async () => {
        mockGetJson.mockResolvedValue({});
        const test_id = 'test123';
        await getTest(test_id);
        expect(mockGetJson).toHaveBeenCalledWith(`/tests/${test_id}`);
    });

    it('startTest calls postJson with correct data', async () => {
        mockPostJson.mockResolvedValue({});
        const test_id = 'test123';
        const isu = 123456;
        await startTest(test_id, isu);
        expect(mockPostJson).toHaveBeenCalledWith(`/tests/${test_id}/start`, { user_id: isu });
    });

    it('getQuestion calls getJson with correct parameters', async () => {
        mockGetJson.mockResolvedValue({});
        const test_id = 'test123';
        const question_number = 1;
        await getQuestion(test_id, question_number);
        expect(mockGetJson).toHaveBeenCalledWith(`/tests/${test_id}/question/${question_number}`);
    });

    it('answerQuestion calls postJson with correct data', async () => {
        mockPostJson.mockResolvedValue({});
        const result_id = 'result123';
        const question_index = 0;
        const answer = 1;
        await answerQuestion(result_id, question_index, answer);
        expect(mockPostJson).toHaveBeenCalledWith(`/results/answer/${result_id}`, { question_index, answer });
    });

    it('completeTest calls postJson with correct result_id', async () => {
        mockPostJson.mockResolvedValue({});
        const result_id = 'result123';
        await completeTest(result_id);
        expect(mockPostJson).toHaveBeenCalledWith(`/results/complete/${result_id}`, {});
    });

    it('currentResult calls getJson with correct result_id', async () => {
        mockGetJson.mockResolvedValue({});
        const result_id = 'result123';
        await currentResult(result_id);
        expect(mockGetJson).toHaveBeenCalledWith(`/results/${result_id}/answers`);
    });
});
