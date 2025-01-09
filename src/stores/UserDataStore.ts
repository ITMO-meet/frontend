import { makeAutoObservable } from "mobx";
import { getProfile, updateBio, updateHeight, updateGenderPreference, updateWeight, updateZodiac, updateRelationshipPreferences, updateUsername, updateWorldview, updateChildren, updateLanguages } from "../api/profile";
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
    // private tags: Tag[] | undefined
    private photo: string | undefined
    private additionalPhotos: string[] | undefined

    // dont have db fields (yet?)
    private children: string | null | undefined
    private languages: string[] | null | undefined
    private alcohol: string | null | undefined
    private smoking: string | null | undefined
    private interests: {[key: string] : string} | null | undefined

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
        this.languages = languagesFeature.map((item: { text: any; }) => item.text);

        // TODO: tags, relationshipPreference and other

        this.photo = profile.logo
        this.additionalPhotos = profile.photos
        
        this.setLoading(false);
    }

    // сеттеры.
    // TODO: отправлять на сервер, photos
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
        if (this.isu){
            updateWorldview(this.isu, worldview);
        }
        // localStorage.setItem("worldview", worldview)
    }

    setChildren(children: string) {
        this.children = children;
        if (this.isu) {
            updateChildren(this.isu, children);
        }
        // localStorage.setItem("children", children);
    }

    setLanguages(languages: string[]) {
        this.languages = languages;
        if (this.isu) {
            updateLanguages(this.isu, languages)
        }
        //localStorage.setItem("languages", JSON.stringify(languages));
    }

    setAlcohol(alcohol: string) {
        this.alcohol = alcohol;
        localStorage.setItem("alcohol", alcohol);
    }

    setSmoking(smoking: string) {
        this.smoking = smoking;
        localStorage.setItem("smoking", smoking);
    }

    setInterests(interests: {[key: string] : string}) {
        this.interests = interests;
        localStorage.setItem("interests", JSON.stringify(interests)); // Store as JSON string
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
            if(!this.loading) {
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
        // if (this.children) {
        //     return this.children;
        // }
        // const c = localStorage.getItem("children");
        // this.children = c;
        // return c;
    }

    // getLanguages() {
    //     if (this.languages) {
    //         return this.languages;
    //     }
    //     const l = localStorage.getItem("languages");
    //     this.languages = l ? JSON.parse(l) : [];
    //     console.log(this.languages);
    //     return this.languages;
    // }
    getLanguages() {
        if (this.languages === undefined) {
            if (!this.loading) {
                this.loadUserData();
            }
            console.warn("Languages are undefined. Returning empty array.");
            return [];
        }
        console.log(this.languages)
        return this.languages;
    }

    getAlcohol() {
        if (this.alcohol) {
            return this.alcohol;
        }
        const a = localStorage.getItem("alcohol");
        this.alcohol = a;
        return a;
    }

    getSmoking() {
        if (this.smoking) {
            return this.smoking;
        }
        const s = localStorage.getItem("smoking");
        this.smoking = s;
        return s;
    }

    getInterests() {
        if (this.interests) {
            return this.interests;
        }
        const i = localStorage.getItem("interests");
        this.interests = i ? JSON.parse(i) : null; // Parse JSON string
        return this.interests;
    }

    //  getTags() {
    //     if (this.tags === undefined) {
    //         console.warn("Tags are undefined. Returning empty array.");
    //         return []; // Значение по умолчанию
    //     }
    //     return this.tags;
    // }

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