import axios from 'axios';
import { getConfig } from './config';
import { Contact, Message, Person, ProfileData, PersonParams } from '../types';


// Get the API base URL from config
const { API_BASE_URL } = getConfig();

// Create an Axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

// Example function to add a new story
export const addStory = async (storyUrl: string) => {
    const response = await apiClient.post('/stories', { image: storyUrl });
    return response.data;
};

// Function to send a message
export const sendMessage = async (
    chatId: string,
    senderId: number,
    receiverId: number,
    text: string
) => {
    const response = await apiClient.post('/chats/send_message', {
        chat_id: chatId,
        sender_id: senderId,
        receiver_id: receiverId,
        text,
    });
    return response.data;
};

// Function to get messages
export const getMessages = async (
    chatId: string,
    limit = 20,
    offset = 0
): Promise<Message[]> => {
    const response = await apiClient.get(`/chats/get_messages/${chatId}`, {
        params: { limit, offset },
    });
    return response.data.messages;
};

// Function to fetch contacts
export const fetchContacts = async (): Promise<Contact[]> => {
    try {
        const response = await apiClient.get('/contacts');
        return response.data.contacts;
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return []; // Return an empty array on error
    }
};

// Function to fetch people for the feed
export const fetchPeople = async (): Promise<Person[]> => {
    try {
        const response = await apiClient.get('/people');
        return response.data.people;
    } catch (error) {
        console.error('Error fetching people:', error);
        return []; // Return an empty array on error
    }
};

// Function to mark a story as viewed
export const markStoryAsViewed = async (storyId: number) => {
    await apiClient.post(`/stories/${storyId}/view`);
};

// Function to fetch stories
export const fetchStories = async (): Promise<Contact[]> => {
    try {
        const response = await apiClient.get('/stories');
        return response.data.stories;
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Функция для получения или создания chatId между двумя пользователями
export const fetchOrCreateChatId = async (
    userId1: number,
    userId2: number
): Promise<string> => {
    try {
        // Attempt to get existing chat
        const getResponse = await apiClient.get('/chats/get_chat', {
            params: { user1: userId1, user2: userId2 },
        });

        if (getResponse.data && getResponse.data.chat_id) {
            return getResponse.data.chat_id;
        } else {
            // If chat doesn't exist, create a new one
            const createResponse = await apiClient.post('/chats/create_chat', {
                user1: userId1,
                user2: userId2,
            });

            if (createResponse.data && createResponse.data.chat_id) {
                return createResponse.data.chat_id;
            } else {
                throw new Error('Failed to create chat');
            }
        }
    } catch (error) {
        console.error('Error in fetchOrCreateChatId:', error);
        throw error;
    }
};




// Function to like a person
export const likePerson = async (personId: number, currentUserId: number) => {
    try {
        const response = await apiClient.post(`/people/${personId}/like`, null, {
            params: { current_user_id: currentUserId },
        });
        return response.data;
    } catch (error) {
        console.error('Error liking person:', error);
        throw error;
    }
};

// Function to dislike a person
export const dislikePerson = async (personId: number, currentUserId: number) => {
    try {
        const response = await apiClient.post(`/people/${personId}/dislike`, null, {
            params: { current_user_id: currentUserId },
        });
        return response.data;
    } catch (error) {
        console.error('Error disliking person:', error);
        throw error;
    }
};

// Function to superlike a person
export const superlikePerson = async (
    personId: number,
    currentUserId: number
) => {
    try {
        const response = await apiClient.post(`/people/${personId}/superlike`, null, {
            params: { current_user_id: currentUserId },
        });
        return response.data;
    } catch (error) {
        console.error('Error superliking person:', error);
        throw error;
    }
};

// Function to fetch profile
export const fetchProfile = async (isu: number): Promise<ProfileData> => {
    try {
        const response = await apiClient.get(`/profile/get_profile/${isu}`);
        return response.data.profile;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

// Function to update bio
export const updateBio = async (isu: number, bio: string) => {
    try {
        const response = await apiClient.put(`/profile/update_bio/${isu}`, { bio });
        return response.data;
    } catch (error) {
        console.error('Error updating bio:', error);
        throw error;
    }
};

// Function to update person_params
export const updatePersonParams = async (
    isu: number,
    personParams: PersonParams
) => {
    try {
        const response = await apiClient.put(`/profile/update_person_params/${isu}`, {
            person_params: personParams,
        });
        return response.data;
    } catch (error) {
        console.error('Error updating person_params:', error);
        throw error;
    }
};

// Function to update interests (tags)
export const updateInterests = async (isu: number, tags: string[]) => {
    try {
        const response = await apiClient.put(`/profile/update_tags/${isu}`, { tags });
        return response.data;
    } catch (error) {
        console.error('Error updating interests:', error);
        throw error;
    }
};

// Function to update gallery images
export const updateGalleryImages = async (isu: number, images: string[]) => {
    try {
        const response = await apiClient.put(`/profile/update_gallery/${isu}`, {
            images,
        });
        return response.data;
    } catch (error) {
        console.error('Error updating gallery images:', error);
        throw error;
    }
};

export default apiClient;