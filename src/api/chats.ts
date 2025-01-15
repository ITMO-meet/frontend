import { getProfile } from "./profile";
import { RawMessage } from "../types";
import { getJson } from ".";

export interface UserChat {
    chat_id: string;
    isu_1: number;
    isu_2: number;
}

interface UserMessage {
    message_id: string;
    chat_id: string;
    sender_id: number;
    receiver_id: number;
    text?: string;
    media_id?: string;
    timestamp: string;
}


export async function getUserContacts(isu: number, return_profiles: boolean) {
    const userChats = (await getJson<{ chats: UserChat[] }>(`/chats/user_chats/${isu}`)).chats;
    if (return_profiles) return await Promise.all(userChats.map(chat => getProfile(chat.isu_2)));
    else return userChats;
}

export async function getUserMessages(UserContacts: UserChat[]) {
    const messages = await Promise.all(
        UserContacts.map(contact => getJson<{ messages: UserMessage[] }>(`/chats/get_messages/${contact.chat_id}`))
    );

    const raw_messages = await Promise.all(messages.flatMap(messageGroup =>
        messageGroup.messages.map(async message => {
            const rawMessage: RawMessage = {
                id: message.message_id,
                chat_id: message.chat_id,
                sender_id: message.sender_id,
                receiver_id: message.receiver_id,
                text: message.text,
                timestamp: message.timestamp
            };

            if (message.media_id) {
                const media = await getJson<{ url: string }>(`/chats/get_media?media_id=${message.media_id}`);
                const response = await fetch(media.url);
                const contentType = response.headers.get("Content-Type") || "";
                if (contentType.startsWith("image/")) {
                    rawMessage.image = await response.blob();
                } else if (contentType.startsWith("audio/")) {
                    rawMessage.audio = await response.blob();
                } else if (contentType.startsWith("video/")) {
                    rawMessage.video = await response.blob();
                } else {
                    rawMessage.file = new File([await response.blob()], "media", { type: contentType });
                }
            }
            return rawMessage;
        })));

    return raw_messages;
}