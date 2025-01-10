import { getJson } from ".";
import { Profile } from "./profile";

export async function getRandomPerson(isu: number) {
    const profile = await getJson<Profile>(`/matches/random_person?user_id=${isu}`);
    return profile
}