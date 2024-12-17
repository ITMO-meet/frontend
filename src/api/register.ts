// src/api/register.ts
// Логика для регистрации.
// Все операции, связанные с регистрацией, здесь.
// В случае ошибок бросаются исключения.

import { postJson, postForm, getJson } from './index';

interface UsernameData {
    isu: number,
    username: string
}
export async function selectUsername(data: UsernameData) {
    await postJson('/auth/register/select_username', data);
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
    formData.append('file', file);
    await postForm(`/auth/register/upload_logo?isu=${isu}`, formData);
}

export async function uploadCarousel(isu: number, files: File[]) {
    const formData = new FormData();
    for (const f of files) {
        formData.append('files', f);
    }
    await postForm(`/auth/register/upload_carousel?isu=${isu}`, formData);
}

interface RelationshipData {
    isu: number,
    relationship_preference: string[]
}
export async function selectRelationship(data: RelationshipData) {
    await postJson('/auth/register/select_relationship', data);
}

export async function fetchTags(): Promise<string[]> {
    const data = await getJson<{tags: {name: string}[]}>('/tags');
    return data.tags.map(t => t.name);
}

export async function fetchPreferences(): Promise<string[]> {
    const data = await getJson<{preferences: {name: string}[]}>('/preferences');
    return data.preferences.map(p => p.name);
}
