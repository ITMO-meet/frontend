import { makeAutoObservable, runInAction } from "mobx";
import { getProfile, Profile } from "../api/profile";

class UserProfileStore {
    profile: Profile | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async loadProfile(isu: number) {

        try {
            const profile = await getProfile(isu);
            runInAction(() => {
                this.profile = profile;
            });
        } catch (error) {
            console.error("Error:", error)
        }
    }

    clearProfile() {
        this.profile = null;
    }
}

export const userProfileStore = new UserProfileStore();
