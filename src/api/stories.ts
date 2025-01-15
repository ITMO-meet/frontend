import { getJson, request } from "."; // Ensure you have a postFormData utility

// Interfaces for API responses
export interface CreateStoryResponse {
    expDate: number;
    id: string;
}

export interface GetStoryResponse {
    id: string;
    isu: number;
    url: string;
    expiration_date: number;
}

export interface GetUserStoriesResponse {
    stories: string[];
}

export interface GetStory {
    isu_from: number
    isu_whose: number
    story_id: string
}

// Function to create a new story
export async function createStory(isu: number, file: File): Promise<CreateStoryResponse> {
    const formData = new FormData();
    formData.append('isu', isu.toString());
    formData.append('file', file);

    const response = await request('/stories/create_story', {
        method: 'POST',
        body: formData
    });

    const data: CreateStoryResponse = await response.json();
    return data;
}

// Function to get a specific story
export async function getStory(storyId: string): Promise<GetStoryResponse> {
    return await getJson<GetStoryResponse>(`/stories/get_story/${storyId}`);;
}

// Function to get all stories for a specific user
export async function getUserStories(isu: number): Promise<GetUserStoriesResponse> {
    return await getJson<GetUserStoriesResponse>(`/stories/get_user_stories/${isu}`);
}
