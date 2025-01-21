import { getJson, postJson } from './index';

export async function checkPremium(isu: number): Promise<{ isPremium: boolean }> {
    return await getJson<{ isPremium: boolean }>(`/premium/check_premium?isu=${isu}`);
}

export async function buyPremium(isu: number): Promise<{ premium_id: string }> {
    return await postJson<{ premium_id: string }>('/premium/set_premium', { isu });
}
