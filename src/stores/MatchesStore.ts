import { makeAutoObservable, runInAction } from "mobx";
import { userData } from "./UserDataStore";
import { getProfile, Profile } from "../api/profile";
import { getUserChats } from "../api/matches";


class MatchesStore {
    matches: Profile[] = [] // Массив профилей пользователей, с которыми есть метч
    
    constructor() {
        makeAutoObservable(this);

        const savedMatches = localStorage.getItem("matches");
        if (savedMatches) {
            this.matches = JSON.parse(savedMatches);
        }
    }
    

    // Получаем метчи:
    // 1. Получаем список чатов
    // 2. По списоку чатов находим все исушники
    // 3. Для каждого исушника дергаем его профиль
    async loadMatches() {
        const isu = userData.getIsu();

        try {
            const chats = await getUserChats(isu);

            const matchesIsus = new Set<number>();
            for (const chat of chats){
                const otherIsu = chat.isu_1 === isu ? chat.isu_2 : chat.isu_1;
                matchesIsus.add(otherIsu);
            }

            const profiles: Profile[] = [];
            for (const matchIsu of matchesIsus) {
                const profile = await getProfile(matchIsu);
                profiles.push(profile);
            }

            runInAction(() => {
                this.matches = profiles;
                localStorage.setItem("matches", JSON.stringify(profiles));
            });
        } catch (error) {
            console.error("Error loading matches:", error);
        }
    }

    clearMatches() {
        localStorage.removeItem("matches");
        this.matches = [];
    }
}

export const matchesStore = new MatchesStore();