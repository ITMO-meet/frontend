import { getJson } from ".";
import { Profile } from "./profile";

export async function getRandomPerson(isu: number) {
    const response = await getJson<{ profile: Profile }>(`/matches/random_person?user_id=${isu}`);
    return response.profile;
}