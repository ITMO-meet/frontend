import { makeAutoObservable } from "mobx";
import { getProfile, updateBio, updateHeight, updateGenderPreference, updateWeight, updateZodiac, updateRelationshipPreferences } from "../api/profile";
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
    private genderPreference: string | undefined
    private relationshipPreferenceId: string | undefined
    // private tags: Tag[] | undefined
    // private photo: string | undefined // url
    // private additionalPhotos: string[] | undefined // urls

    constructor() {
        makeAutoObservable(this);
    }

    private setLoading(value: boolean) {
        this.loading = value;
    }

    private async loadUserData() {
        this.setLoading(true);

        const profile = await getProfile(this.getIsu()); // get profile from server
        console.log(profile);

        // set variables in store
        this.username = profile.username;
        this.bio = profile.bio;
        
        const birthdate = profile.mainFeatures.find(feature => feature.icon === "birthdate")?.text;
        this.age = birthdate ? calculateAge(birthdate) : 20;
        this.birthdate = birthdate;

        const weightFeature = profile.mainFeatures.find(feature => feature.icon === "weight")?.text;
        this.weight = weightFeature ? parseFloat(weightFeature) : 80; // Assuming weight is stored as a string

        const heightFeature = profile.mainFeatures.find(feature => feature.icon === "height")?.text;
        this.height = heightFeature ? parseFloat(heightFeature) : 170; // Assuming height is stored as a string

        const zodiacFeature = profile.mainFeatures.find(feature => feature.icon === "zodiac_sign")?.text;
        this.zodiac = zodiacFeature ? zodiacFeature : "None";

        const genderPreferenceFeature = profile.gender_preferences[0]?.text; // Assuming the first preference is the desired one
        this.genderPreference = genderPreferenceFeature ? genderPreferenceFeature : "Everyone"

        const relationship = profile.relationship_preferences[0]?.text;
        this.relationshipPreferenceId = relationship ? relationship : "672b44eab151637e969889bb" // default is 'Dates' 
        
        // TODO: tags, photo, additionalPhotos, relationshipPreference and other
        
        this.setLoading(false);
    }

    // сеттеры.
    // TODO: отправлять на сервер
    setUsername(username: string) {
        this.username = username;
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

    // setTags(tags: Tag[]) {
    //     this.tags = tags;
    // }

    // setPhoto(photo: string) {
    //     this.photo = photo;
    // }

    // setAdditionalPhotos(photos: string[]) {
    //     this.additionalPhotos = photos;
    // }


    // геттеры
    // TODO: если undefined сделать запрос на сервер.
    getIsu() {
        if (this.isu === undefined) {
            const locIsu = localStorage.getItem("isu"); 
            if (locIsu === null) {
                console.warn("ISU is undefined. Returning default value.");
                return -1; // Значение по умолчанию
            }
            this.isu = parseInt(locIsu);
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

    //  getTags() {
    //     if (this.tags === undefined) {
    //         console.warn("Tags are undefined. Returning empty array.");
    //         return []; // Значение по умолчанию
    //     }
    //     return this.tags;
    // }

    //  getPhoto() {
    //     if (this.photo === undefined) {
    //         console.warn("Photo is undefined. Returning empty string.");
    //         return ""; // Значение по умолчанию
    //     }
    //     return this.photo;
    // }

    //  getAdditionalPhotos() {
    //     if (this.additionalPhotos === undefined) {
    //         console.warn("Additional photos are undefined. Returning empty array.");
    //         return []; // Значение по умолчанию
    //     }
    //     return this.additionalPhotos;
    // }

}

export const userData = new UserData();