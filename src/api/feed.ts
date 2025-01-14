import { getJson, postJson } from ".";
import { UserAction } from "../types";
import { Profile } from "./profile";

export async function getRandomPerson(isu: number) {
    const response = await getJson<{ profile: Profile }>(`/matches/random_person?user_id=${isu}`);
    return response.profile;
}

export async function likePerson(user_id: number, target_id: number): Promise<any> {
    return await postJson<{message: string; matched?: boolean; chat_id?: string}>(
        '/matches/like_person/', {user_id, target_id} as UserAction
    );
}

export async function dislikePerson(user_id: number, target_id: number): Promise<any> {
    return await postJson<{message: string}>(
        '/matches/dislike_person',
        {user_id, target_id} as UserAction
    )
}