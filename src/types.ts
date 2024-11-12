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

export interface Message {
    sender: 'me' | 'them';
    text: string;
}

export interface ChatProps {
    contacts: Contact[];
}
