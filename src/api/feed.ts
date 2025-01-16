import { getJson, postJson } from ".";
import { DislikeResponse, LikeResponse, SuperLikeResponse, UserAction } from "../types";
import { Profile } from "./profile";


export async function getFilteredPerson(
    user_id: number,
    gender: string,
    ageRange: number[],
    heightRange: number[],
    relationshipPreferences: string[]
): Promise<{ profile: Profile }> {
    const params = new URLSearchParams();
    params.append("user_id", String(user_id));

    if (gender) {
        params.append("gender", gender);
    }

    if (ageRange?.length === 2) {
        params.append("min_age", String(ageRange[0]));
        params.append("max_age", String(ageRange[1]));
    }

    if (heightRange?.length === 2) {
        params.append("min_height", String(heightRange[0]));
        params.append("max_height", String(heightRange[1]));
    }

    relationshipPreferences.forEach((relPref) => {
        params.append("relationship_preferences", relPref);
    });

    return await getJson<{ profile: Profile }>(`/matches/random_person?${params.toString()}`);
}

export async function likePerson(user_id: number, target_id: number): Promise<LikeResponse> {
    return await postJson<{ message: string; matched?: boolean; chat_id?: string }>(
        '/matches/like_person/', { user_id, target_id } as UserAction
    );
}

export async function dislikePerson(user_id: number, target_id: number): Promise<DislikeResponse> {
    return await postJson<{ message: string }>(
        '/matches/dislike_person',
        { user_id, target_id } as UserAction
    )
}

export async function superLikePerson(user_id: number, target_id: number): Promise<SuperLikeResponse> {
    return await postJson<{ message: string; matched?: boolean; chat_id?: string }>(
        '/matches/superlike_person',
        { user_id, target_id } as UserAction
    );
}