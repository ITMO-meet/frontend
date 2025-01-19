// src/api/register.ts
// Логика для регистрации.
// Все операции, связанные с регистрацией, здесь.
// В случае ошибок бросаются исключения.

import {postJson, postForm, getJson} from './index';
import {Preference, Tag} from "../types";
import { userData } from '../stores/UserDataStore';
import { compressImage } from '../utils';

interface UsernameData {
    isu: number,
    username: string
}

export async function selectUsername(data: UsernameData) {
    await postJson('/auth/register/select_username', data);
}

interface ProfileDetailsData {
    isu: number,
    bio: string,
    height: number,
    weight: number,
    zodiac_sign: string
}

export async function profileDetails(data: ProfileDetailsData) {
    await postJson('/auth/register/profile_details', data);
}

interface PreferencesData {
    isu: number,
    gender_preference: string
}

export async function selectPreferences(data: PreferencesData) {
    await postJson('/auth/register/select_preferences', data);
}

interface TagsData {
    isu: number,
    tags: string[]
}

export async function selectTags(data: TagsData) {
    await postJson('/auth/register/select_tags', data);
}

export async function uploadLogo(isu: number, file: File) {
    const formData = new FormData();
    const compImage = await compressImage(file);
    formData.append('file', compImage);
    await postForm(`/auth/register/upload_logo?isu=${isu}`, formData);
    userData.updatePhotos();
}

export async function uploadCarousel(isu: number, files: File[]) {
    const formData = new FormData();
    for (const f of files) {
        const compImage = await compressImage(f);
        formData.append('files', compImage);
    }
    await postForm(`/auth/register/upload_carousel?isu=${isu}`, formData);
    userData.updatePhotos();
}

interface RelationshipData {
    isu: number,
    relationship_preference: string[]
}

export async function selectRelationship(data: RelationshipData) {
    await postJson('/auth/register/select_relationship', data);
}

export async function fetchTags(): Promise<Tag[]> {
    const tags = await getJson<Tag[]>('/tags');
    return tags;
}

export async function fetchPreferences(): Promise<Preference[]> {
    const data = await getJson<{ preferences: Preference[] }>('/preferences');
    return data.preferences;
}
