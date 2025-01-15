import { getJson, putJson } from ".";

export interface Profile {
    _id: string;
    isu: number;
    username: string;
    bio: string;
    logo: string;
    photos: string[];
    mainFeatures: MainFeature[];
    interests: Interest[];
    itmo: Itmo[];
    gender_preferences: GenderPreference[];
    relationship_preferences: RelationshipPreference[];
    isStudent: boolean;
    selected_preferences: SelectedPreference[];
}

interface MainFeature {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    map: any;
    text: string;
    icon: string;
}

interface Interest {
    text: string;
    icon: string;
}

interface Itmo {
    text: string;
    icon: string;
}

interface GenderPreference {
    text: string;
    icon: string;
}

interface RelationshipPreference {
    icon: string;
    id: string
    text: string;
}

interface SelectedPreference {
    id: string;
    text: string;
    icon: string;
}

// Полный интерфейс для всего объекта
interface UserProfile {
    profile: Profile;
}


export async function getProfile(isu: number) {
    const profile = await getJson<UserProfile>(`/profile/get_profile/${isu}`);
    return profile.profile
}

export async function updateBio(isu: number, bio: string) {
    const params = new URLSearchParams();
    params.append('bio', bio);
    await putJson(`/profile/update_bio/${isu}?${params.toString()}`);
}

export async function updateUsername(isu: number, username: string) {
    const params = new URLSearchParams();
    params.append('username', username);
    await putJson(`/profile/update_username/${isu}?${params.toString()}`)
}

export async function updateHeight(isu: number, height: number) {
    await putJson(`/profile/update_height/${isu}?height=${height}`)
}

export async function updateWeight(isu: number, weight: number) {
    await putJson(`/profile/update_weight/${isu}?weight=${weight}`)
}

export async function updateZodiac(isu: number, zodiac: string) {
    const params = new URLSearchParams();
    params.append('zodiac', zodiac);
    await putJson(`/profile/update_zodiac/${isu}?${params.toString()}`);
}

export async function updateRelationshipPreferences(isu: number, preference_ids: string[]) {
    await putJson(`/profile/update_relationship_preferences`, { isu: isu, tags: preference_ids });
}

export async function updateGenderPreference(isu: number, gender_preference: string) {
    await putJson(`/profile/update_gender_preference`, { isu: isu, gender_preference: gender_preference });
}

export async function updateWorldview(isu: number, worldview: string) {
    const params = new URLSearchParams();
    params.append('worldview', worldview);
    await putJson(`/profile/update_worldview/${isu}?${params.toString()}`)
}

export async function updateChildren(isu: number, children: string) {
    const params = new URLSearchParams();
    params.append('children', children);
    await putJson(`/profile/update_children/${isu}?${params.toString()}`)
}

export async function updateLanguages(isu: number, languages: string[]) {
    await putJson(`/profile/update_languages`, { isu, languages });
}

export async function updateAlcohol(isu: number, alcohol: string) {
    const params = new URLSearchParams();
    params.append('alcohol', alcohol);
    await putJson(`/profile/update_alcohol/${isu}?${params.toString()}`)
}

export async function updateSmoking(isu: number, smoking: string) {
    const params = new URLSearchParams();
    params.append('smoking', smoking);
    await putJson(`/profile/update_smoking/${isu}?${params.toString()}`)
}

export async function updateTags(isu: number, tagIds: string[]) {
    return await putJson(`/profile/update_tags`, {
        isu,
        tags: tagIds
    });
}
