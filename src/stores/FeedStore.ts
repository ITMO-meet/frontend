import { makeAutoObservable } from "mobx";
import { getRandomPerson } from "../api/feed";
import { userData } from "./UserDataStore";
import { Profile } from "../api/profile";
import { calculateAge } from "../utils";

class FeedStore {
    loading: boolean = false;

    private person: Profile | undefined

    // dont have db fields
    private agePreference: number[] | undefined
    private heightPreference: number[] | undefined
    private relationshipPreference: string[] | undefined // is this the same as userData.relationshipPreference ???

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
        this.setLoading(true);

        let attempt = 0;
        const maxAttempt = 10;
        let profile: Profile | undefined;

        const preferredGender = userData.getGenderPreference();
        const agePreference = this.getAgePreference();
        console.log("Preferred Gender:", preferredGender, "Age Preference:", agePreference);

        do {
            profile = await getRandomPerson(userData.getIsu());
            attempt++;


            let genderOk = true;
            if (preferredGender.trim().toLowerCase() !== "everyone") {
                const profileGenderFeature = profile.mainFeatures.find(f => f.icon === "gender");
                const profileGender = profileGenderFeature ? profileGenderFeature.text : "";
                genderOk = profileGender.trim().toLowerCase() === preferredGender.trim().toLowerCase();
            }

            let ageOk = false;
            const birthdateFeature = profile.mainFeatures.find(f => f.icon === "birthdate");
            if (birthdateFeature && birthdateFeature.text) {
                const profileAge = calculateAge(birthdateFeature.text);
                ageOk = profileAge >= agePreference[0] && profileAge <= agePreference[1];
            }

            if (genderOk && ageOk) {
                break;
            }

            if (attempt >= maxAttempt) {
                console.warn("Не найден профиль, удовлетворяющий фильтрам за максимальное число попыток.");
                break;
            }
        } while (true);

        this.person = profile;
        console.log("Loaded Profile:", profile);
        this.setLoading(false);
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