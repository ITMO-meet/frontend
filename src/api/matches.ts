import { getJson, postJson } from ".";
import { UserAction } from "../types";

export async function getUserChats(isu: number): Promise<{ chat_id: string; isu_1: number; isu_2: number }[]> {
  const response = await getJson<{ chats: { chat_id: string; isu_1: number; isu_2: number }[] }>(`/chats/user_chats/${isu}`);
  return response.chats;
}

export async function blockPerson(user_id: number, target_id: number): Promise<{ message: string }> {
  return await postJson<{ message: string }>(
    '/matches/block_person',
    { user_id, target_id } as UserAction
  )
}
