import { makeAutoObservable } from "mobx";
import { getRandomPerson } from "../api/feed";
import { userData } from "./UserDataStore";
import { Profile } from "../api/profile";

class FeedStore {
    loading: boolean = false;

    private person : Profile | undefined 

    // dont have db fields
    private agePreference: number[] | undefined
    private heightPreference: number[] | undefined
    private relationshipPreference : string[] | undefined // is this the same as userData.relationshipPreference ???

    constructor() {
        makeAutoObservable(this);
    }

    private async loadData() {
        this.setLoading(true);

        if (!this.person) {
            await this.loadNewPerson();
        }

        this.setLoading(false);
    }

    private setLoading(value: boolean) {
        this.loading = value;
    }

    // custom methods
    async loadNewPerson() {
        const profile = await getRandomPerson(userData.getIsu());
        this.person = profile
        return this.person;
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
        const temp = localStorage.getItem("relationshipPreference")
        this.relationshipPreference = temp ? JSON.parse(temp) : [150, 200]
        return this.relationshipPreference;
    }

    getCurrentPerson(): Profile {
        if (!this.person) {
            if (!this.loading) {
                this.loadData();
            }
            return {
                _id: "",
                isu: 0,
                username: "",
                bio: "",
                logo: "",
                photos: [],
                mainFeatures: [],
                interests: [],
                itmo: [],
                gender_preferences: [],
                relationship_preferences: [],
                isStudent: false,
                selected_preferences: []
            };
        }
        return this.person;
    }

}

export const feedStore = new FeedStore();