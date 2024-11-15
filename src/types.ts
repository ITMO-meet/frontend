export interface Story {
    id: number;
    image: string;
    expiresAt: number;  // Timestamp
}

export interface Contact {
    id: number;
    name: string;
    pfp: string;
    lastMessage?: string;
    stories: Story[];
}

export interface Message {
    sender: 'me' | 'them';
    text: string;
    timestamp?: string;
}

export interface ChatProps {
    contacts: Contact[];
}

export interface Person {
   id: number; // Уникальный идентификатор
   name: string; // Имя человека
   description: string; // Описание человека
   imageUrl: string; // Ссылка на изображение
}

export interface PersonParams {
    height?: number;
    worldview?: string;
    zodiacSign?: string;
    children?: string;
    alcohol?: string;
    smoking?: string;
    languages?: string[];
}

export interface ProfileData {
    username: string;
    bio: string;
    tags: string[];
    photos: {
        logo: string;
        carousel: string[];
    };
    person_params: PersonParams;
}