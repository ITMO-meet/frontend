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
    text?: string;
    timestamp: string;
    image?: Blob;
    audio?: Blob;
    video?: Blob;
    file?: File;
}

export interface MessageType {
    // image(image: any): string | undefined;
    sender: 'me' | 'them';
    text: string;
    image?: Blob;
    audio?: Blob;
    video?: Blob;
    file?: File;
    fileName?: string;
    timestamp?: string;
}

export interface Test {
    name: string,
    description: string,
    questions_count: number
}

export interface TestResult {
    result_id: string
}

export interface TestQuestion {
    description: string,
    question_number: number
}

export interface TestGivenAnswers {
    updated_answers: number[]
}

export interface TestScore {
    score: number
}

export interface TestStatus {
    answers: number[],
    status: boolean
}