import { Test, TestGivenAnswers, TestQuestion, TestResult, TestScore, TestStatus } from '../types';
import {postJson, getJson} from './index';

export async function getTest(test_id: string): Promise<Test> {
    return await getJson(`/tests/${test_id}`)
}

export async function startTest(test_id: string, isu: number): Promise<TestResult> {
    return await postJson(`/tests/${test_id}/start`, {user_id: isu})
}

export async function getQuestion(test_id: string, question_number: number): Promise<TestQuestion> {
    return await getJson(`/tests/${test_id}/question/${question_number}`)
}

export async function answerQuestion(result_id: string, question_index: number, answer: number): Promise<TestGivenAnswers> {
    return await postJson(`/results/answer/${result_id}`, {question_index, answer})
}

export async function completeTest(result_id: string): Promise<TestScore> {
    return await postJson(`/results/complete/${result_id}`, {})
}

export async function currentResult(result_id: string): Promise<TestStatus> {
    return await getJson(`/results/${result_id}/answers`)
}