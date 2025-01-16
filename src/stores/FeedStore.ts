import { makeAutoObservable } from "mobx";
import { getFilteredPerson } from "../api/feed";
import { userData } from "./UserDataStore";
import { Profile } from "../api/profile";

class FeedStore {
    loading: boolean = false;

    person: Profile | null = null;
    notFound: boolean = false;


    // dont have db fields
    private agePreference: number[] | undefined
    private heightPreference: number[] | undefined
    private relationshipPreference: string[] | undefined

    constructor() {
        makeAutoObservable(this);
    }

    private setLoading(value: boolean) {
        this.loading = value;
    }

    async loadNewPerson(isPremium: boolean) {
        this.setLoading(true);
        this.notFound = false;

        try {
            const user_id = userData.getIsu();
            const gender = userData.getGenderPreference() || "Everyone";

            const ageRange = this.getAgePreference() || [18, 60];

            const heightRange = isPremium
                ? (this.getHeightPreference() || [75, 300])
                : [100, 300];

            const relPref = isPremium
                ? this.getRelationshipPreference()
                : [];

            const response = await getFilteredPerson(
                user_id,
                gender,
                ageRange,
                heightRange,
                relPref
            );

            this.person = response.profile;
        } catch (err) {
            console.error("Failed to load new person: ", err);
            this.person = null;
            this.notFound = true;
        } finally {
            this.setLoading(false);
        }
    }

    // setters
    setAgePreference(agePreference: number[]) {
        this.agePreference = agePreference;
        localStorage.setItem("agePreference", JSON.stringify(agePreference));
    }

    setHeightPreference(heightPreference: number[]) {
        this.heightPreference = heightPreference;
        localStorage.setItem("heightPreference", JSON.stringify(heightPreference));
    }

    setRelationshipPreference(relationshipPreference: string[]) {
        this.relationshipPreference = relationshipPreference;
        localStorage.setItem("relationshipPreference", JSON.stringify(relationshipPreference));
    }

    // getters
    getAgePreference() {
        if (this.agePreference) {
            return this.agePreference;
        }
        const temp = localStorage.getItem("agePreference")
        this.agePreference = temp ? JSON.parse(temp) : [18, 60]
        return this.agePreference;
    }

    getHeightPreference() {
        if (this.heightPreference) {
            return this.heightPreference;
        }
        const temp = localStorage.getItem("heightPreference")
        this.heightPreference = temp ? JSON.parse(temp) : [150, 200]
        return this.heightPreference;
    }

    getRelationshipPreference() {
        if (this.relationshipPreference) {
            return this.relationshipPreference;
        }
        const temp = localStorage.getItem("relationshipPreference");
        this.relationshipPreference = temp ? JSON.parse(temp) : [];
        return this.relationshipPreference;
    }

    getCurrentPerson(): Profile | null {
        return this.person;
    }

}

export const feedStore = new FeedStore();