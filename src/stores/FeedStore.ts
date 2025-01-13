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
    private relationshipPreference: string[] | undefined

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
        const heightPreference = this.getHeightPreference();
        const relPreference = this.getRelationshipPreference();


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

            let heightOk = false;
            const heightFeature = profile.mainFeatures.find(f => f.icon === "height");
            if (heightFeature && heightFeature.text) {
                const profileHeight = parseFloat(heightFeature.text.split(" ")[0]);
                heightOk = profileHeight >= heightPreference[0] && profileHeight <= heightPreference[1];
            }

            let relationshipOk = false;
            if (!relPreference || relPreference.length === 0) {
                relationshipOk = true;
            } else if (profile.relationship_preferences && profile.relationship_preferences.length > 0) {
                relationshipOk = profile.relationship_preferences.some(rp => relPreference.includes(rp.id));
            } else {
                relationshipOk = false;
            }

            if (genderOk && ageOk && heightOk && relationshipOk) {
                break;
            }

            if (attempt >= maxAttempt) {
                console.warn("Не найден профиль, удовлетворяющий фильтрам за максимальное число попыток.");
                break;
            }
        } while (true);

        this.person = profile;
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
        const temp = localStorage.getItem("relationshipPreference");
        this.relationshipPreference = temp ? JSON.parse(temp) : [];
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