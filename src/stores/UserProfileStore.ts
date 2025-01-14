import { makeAutoObservable, runInAction } from "mobx";
import { getProfile, Profile } from "../api/profile";

class UserProfileStore {
    profile: Profile | null = null;
    isLoading: boolean = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async loadProfile(isu: number) {
        this.isLoading = true;
        this.error = null;

        try {
            const profile = await getProfile(isu);
            runInAction(() => {
                this.profile = profile;
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.error = "Failed to load profile.";
                this.isLoading = false;
            });
        }
    }

    clearProfile() {
        this.profile = null;
        this.error = null;
    }
}

export const userProfileStore = new UserProfileStore();
