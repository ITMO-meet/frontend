import { makeAutoObservable } from "mobx";
import { getProfile, updateBio, updateHeight, updateGenderPreference, updateWeight, updateZodiac, updateRelationshipPreferences, updateUsername, updateWorldview, updateChildren, updateLanguages, updateAlcohol, updateSmoking, updateTags } from "../api/profile";
import { calculateAge } from "../utils";

class UserData {
    public loading: boolean = false;

    private isu: number | undefined
    private username: string | undefined
    private bio: string | undefined
    private birthdate: string | undefined
    private age: number | undefined
    private weight: number | undefined
    private height: number | undefined
    private zodiac: string | undefined
    private gender: string | undefined
    private genderPreference: string | undefined
    private relationshipPreferenceId: string | undefined
    private worldview: string | undefined
    private photo: string | undefined
    private additionalPhotos: string[] | undefined
    private alcohol: string | undefined
    private smoking: string | undefined
    private interestIDs: string[] | null = null;
    private interests: string[] = [];
    private children: string | null | undefined
    private languages: string[] | null | undefined

    constructor() {
        makeAutoObservable(this);
    }

    private setLoading(value: boolean) {
        this.loading = value;
    }

    private async loadUserData() {
        this.setLoading(true);

        const profile = await getProfile(this.getIsu()); // get profile from server
        console.log("Recieved profile: ", profile);

        // set variables in store
        this.username = profile.username;
        this.bio = profile.bio;

        const temp_gender = profile.mainFeatures.find(feature => feature.icon === "gender")?.text;
        this.gender = temp_gender ? temp_gender?.charAt(0).toUpperCase() + temp_gender?.slice(1) : "Helicopter"

        const birthdate = profile.mainFeatures.find(feature => feature.icon === "birthdate")?.text;
        this.age = birthdate ? calculateAge(birthdate) : 20;
        this.birthdate = birthdate;

        const weightFeature = profile.mainFeatures.find(feature => feature.icon === "weight")?.text;
        this.weight = weightFeature ? parseFloat(weightFeature.split(" ")[0]) : 80; // Assuming weight is stored as a string

        const heightFeature = profile.mainFeatures.find(feature => feature.icon === "height")?.text;
        this.height = heightFeature ? parseFloat(heightFeature.split(" ")[0]) : 170; // Assuming height is stored as a string

        this.zodiac = profile.mainFeatures.find(feature => feature.icon === "zodiac_sign")?.text || "None";
        this.genderPreference = profile.gender_preferences[0]?.text || "Everyone"

        this.relationshipPreferenceId = profile.relationship_preferences[0]?.id || "672b44eab151637e969889bb"; // default is "Dates"

        this.worldview = profile.mainFeatures.find(feature => feature.icon === "worldview")?.text;

        this.children = profile.mainFeatures.find(feature => feature.icon === "children")?.text;

        const languagesFeature = profile.mainFeatures[7];
        this.languages = languagesFeature.map((item: { text: string; }) => item.text);

        this.alcohol = profile.mainFeatures.find(feature => feature.icon === "alcohol")?.text;

        this.smoking = profile.mainFeatures.find(feature => feature.icon === "smoking")?.text;


        this.photo = profile.logo
        this.additionalPhotos = profile.photos

        this.interests = (profile.interests || []).map(item => item.text);


        this.setLoading(false);
    }

    // сеттеры.
    setUsername(username: string) {
        this.username = username;
        if (this.isu) {
            updateUsername(this.isu, username);
        }
    }

    setBio(bio: string) {
        this.bio = bio;
        if (this.isu) {
            updateBio(this.isu, bio);
        };
    }

    setWeight(weight: number) {
        this.weight = weight;
        if (this.isu) {
            updateWeight(this.isu, weight);
        };
    }

    setHeight(height: number) {
        this.height = height;
        if (this.isu) {
            updateHeight(this.isu, height);
        };
    }

    setZodiac(zodiac: string) {
        this.zodiac = zodiac;
        if (this.isu) {
            updateZodiac(this.isu, zodiac);
        };
    }

    setGenderPreference(genderPreference: string) {
        this.genderPreference = genderPreference;
        if (this.isu) {
            updateGenderPreference(this.isu, genderPreference);
        }
    }

    setRelationshipPreference(preferenceId: string) {
        this.relationshipPreferenceId = preferenceId;
        if (this.isu) {
            updateRelationshipPreferences(this.isu, [preferenceId]);
        }
    }

    setWorldview(worldview: string) {
        this.worldview = worldview;
        if (this.isu) {
            updateWorldview(this.isu, worldview);
        }
    }

    setChildren(children: string) {
        this.children = children;
        if (this.isu) {
            updateChildren(this.isu, children);
        }
    }

    setLanguages(languages: string[]) {
        this.languages = languages;
        if (this.isu) {
            updateLanguages(this.isu, languages)
        }
    }

    setAlcohol(alcohol: string) {
        this.alcohol = alcohol;
        if (this.isu) {
            updateAlcohol(this.isu, alcohol)
        }
    }

    setSmoking(smoking: string) {
        this.smoking = smoking;
        if (this.isu) {
            updateSmoking(this.isu, smoking)
        }
    }

    setInterests(newIDs: string[]) {
        this.interestIDs = newIDs;
        localStorage.setItem("interestIDs", JSON.stringify(newIDs));

        if (this.isu) {
            updateTags(this.isu, newIDs)
                .then(() => {
                    this.loadUserData();
                })
                .catch(err => {
                    console.error("Failed to update tags in DB: ", err);
                });
        }
    }


    // геттеры
    getIsu() {
        if (this.isu === undefined) {
            const locIsu = localStorage.getItem("isu");
            if (locIsu === null) {
                console.warn("ISU is undefined. Returning default value.");
                return -1; // Значение по умолчанию
            }
            this.isu = parseInt(locIsu);
            this.loadUserData();
            return this.isu;
        }
        return this.isu;
    }

    getUsername() {
        if (this.username === undefined) {
            if (!this.loading) {
                this.loadUserData();
            }
            console.warn("Username is undefined. Returning default value.");
            return "Default Username"; // Значение по умолчанию
        }
        return this.username;
    }

    getAge() {
        if (this.age === undefined) {
            if (!this.loading) {
                this.loadUserData();
            }
            console.warn("Age is undefined. Returning default value.");
            return 0; // Значение по умолчанию
        }
        return this.age;
    }

    getBirthdate() {
        if (this.birthdate === undefined) {
            if (!this.loading) {
                this.loadUserData();
            }
            console.warn("Birthdate is undefined. Returning default value.");
            return ""; // Значение по умолчанию
        }
        return this.birthdate;
    }

    getGender() {
        if (this.gender === undefined) {
            if (!this.loading) {
                this.loadUserData();
            }
            console.warn("Gender is undefined. Returning default value.");
            return "helicopter"; // default val
        }
        return this.gender;
    }

    getBio() {
        if (this.bio === undefined) {
            if (!this.loading) {
                this.loadUserData();
            }
            console.warn("Bio is undefined. Returning default value.");
            return "No bio available"; // Значение по умолчанию
        }
        return this.bio;
    }

    getWeight() {
        if (this.weight === undefined) {
            if (!this.loading) {
                this.loadUserData();
            }
            console.warn("Weight is undefined. Returning default value.");
            return 0; // Значение по умолчанию
        }
        return this.weight;
    }

    getHeight() {
        if (this.height === undefined) {
            if (!this.loading) {
                this.loadUserData();
            }
            console.warn("Height is undefined. Returning default value.");
            return 0; // Значение по умолчанию
        }
        return this.height;
    }

    getZodiac() {
        if (this.zodiac === undefined) {
            if (!this.loading) {
                this.loadUserData();
            }
            console.warn("Zodiac is undefined. Returning default value.");
            return "Not specified"; // Значение по умолчанию
        }
        return this.zodiac;
    }

    getGenderPreference() {
        if (this.genderPreference === undefined) {
            if (!this.loading) {
                this.loadUserData();
            }
            console.warn("Gender preference is undefined. Returning default value.");
            return "Not specified"; // Значение по умолчанию
        }
        return this.genderPreference;
    }

    getRelationshipPreference() {
        if (this.relationshipPreferenceId === undefined) {
            if (!this.loading) {
                this.loadUserData();
            }
            console.warn("Relationship preference is undefined. Returning default value.");
            return ""; // Значение по умолчанию
        }
        return this.relationshipPreferenceId;
    }

    getWorldview() {
        if (this.worldview === undefined) {
            if (!this.loading) {
                this.loadUserData();
            }
            console.warn("Worldview is undefined. Returning default value.");
            return "Not specified"; // Значение по умолчанию
        }
        return this.worldview;
    }

    getChildren() {
        if (this.children === undefined) {
            if (!this.loading) {
                this.loadUserData();
            }
            console.warn("Children is undefined. Returning default value.");
            return "Not specified"; // Значение по умолчанию
        }
        return this.children;
    }

    getLanguages() {
        if (this.languages === undefined) {
            if (!this.loading) {
                this.loadUserData();
            }
            console.warn("Languages are undefined. Returning empty array.");
            return [];
        }
        return this.languages;
    }

    getAlcohol() {
        if (this.alcohol === undefined) {
            if (!this.loading) {
                this.loadUserData();
            }
            console.warn("Alcohol is undefined. Returning default value.");
            return "Not specified"; // Значение по умолчанию
        }
        return this.alcohol;
    }

    getSmoking() {
        if (this.smoking === undefined) {
            if (!this.loading) {
                this.loadUserData();
            }
            console.warn("Smoking is undefined. Returning default value.");
            return "Not specified"; // Значение по умолчанию
        }
        return this.smoking;
    }

    getInterests() {
        return this.interests;
    }

    getInterestIDs() {
        if (!this.interestIDs) {
            const local = localStorage.getItem("interestIDs");
            if (local) {
                this.interestIDs = JSON.parse(local);
            } else {
                this.interestIDs = [];
            }
        }
        return this.interestIDs;
    }


    getPhoto() {
        if (this.photo === undefined) {
            console.warn("Photo is undefined. Returning empty string.");
            return ""; // Значение по умолчанию
        }
        return this.photo;
    }

    getAdditionalPhotos() {
        if (this.additionalPhotos === undefined) {
            console.warn("Additional photos are undefined. Returning empty array.");
            return []; // Значение по умолчанию
        }
        return this.additionalPhotos;
    }

}

export const userData = new UserData();