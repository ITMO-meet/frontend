import { getJson, postJson } from ".";
import { DislikeResponse, LikeResponse, SuperLikeResponse, UserAction } from "../types";
import { Profile } from "./profile";

export async function getRandomPerson(isu: number) {
    const response = await getJson<{ profile: Profile }>(`/matches/random_person?user_id=${isu}`);
    return response.profile;
}

export async function likePerson(user_id: number, target_id: number): Promise<LikeResponse> {
    return await postJson<{message: string; matched?: boolean; chat_id?: string}>(
        '/matches/like_person/', {user_id, target_id} as UserAction
    );
}

export async function dislikePerson(user_id: number, target_id: number): Promise<DislikeResponse> {
    return await postJson<{message: string}>(
        '/matches/dislike_person',
        {user_id, target_id} as UserAction
    )
}

export async function superLikePerson(user_id: number, target_id: number): Promise<SuperLikeResponse> {
    return await postJson<{message: string; matched?: boolean; chat_id?: string}> (
        '/matches/superlike_person',
        {user_id, target_id} as UserAction
    );
}