export interface Story {
    id: string;
    image: string;
    expiresAt: number;  // Timestamp
}

export interface Contact {
    id: string;
    name: string;
    pfp: string;
    lastMessage?: string;
    stories: Story[];
}

export interface Person {
    isu: number
    bio: string
    logo: string
    username: string
}

export interface UserAction {
    user_id: number;
    target_id: number;
}

export interface LikeResponse {
    message: string;
    matched?: boolean;
    chat_id?: string;
}

export interface DislikeResponse {
    message: string;
}

export type SuperLikeResponse = LikeResponse;

export interface Message {
    sender: 'me' | 'them';
    text: string;
}

export interface ChatProps {
    contacts: Contact[];
}

export interface Preference {
    id: string;
    text: string;
    title?: string; // Optional, if not provided by backend
    description?: string; // Optional, if not provided by backend
    icon: string;
}

export interface Tag {
    id: string;
    text: string;
    icon: string;
}

export interface RawMessage {
    id: string;
    chat_id: string;
    sender_id: number;
    receiver_id: number;
    text: string;
    timestamp: string;
}

export interface MessageType {
    sender: 'me' | 'them';
    text: string;
    audio?: Blob;
    video?: Blob;
}
