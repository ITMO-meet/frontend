import { makeAutoObservable } from "mobx";
import { Person } from "../types";
import { getRandomPerson } from "../api/feed";
import { userData } from "./UserDataStore";

class FeedStore {
    loading: boolean = false;

    private person : Person | undefined 

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
        this.person = {isu: profile.isu, bio: profile.bio, logo: profile.logo, username: profile.username}
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

    getCurrentPerson(): Person {
        if (this.person === undefined) {
            if (!this.loading) {
                this.loadData();
            }
            return {isu: 0, username: "", bio: "", logo: ""};
        }
        return this.person;
    }

}

export const feedStore = new FeedStore();