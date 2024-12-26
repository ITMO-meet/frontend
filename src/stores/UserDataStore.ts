import { makeAutoObservable } from "mobx";
import { Preference, Tag } from "../types";

class UserData {
    private isu: number | undefined
    private age: number | undefined
    private username: string | undefined
    private bio: string | undefined
    private weight: number | undefined
    private height: number | undefined
    private zodiac: string | undefined
    private genderPreference: string | undefined
    private tags: Tag[] | undefined
    private photo: File | undefined
    private additionalPhotos: File[] | undefined
    private relationshipPreference: Preference | undefined

    constructor() {
        makeAutoObservable(this);
    }

    // сеттеры.
    // TODO: отправлять на сервер
    setUsername(username: string) {
        this.username = username;
    }

    setBio(bio: string) {
        this.bio = bio;
    }

    setWeight(weight: number) {
        this.weight = weight;
    }

    setHeight(height: number) {
        this.height = height;
    }

    setZodiac(zodiac: string) {
        this.zodiac = zodiac;
    }

    setGenderPreference(genderPreference: string) {
        this.genderPreference = genderPreference;
    }

    setTags(tags: Tag[]) {
        this.tags = tags;
    }

    setPhoto(photo: File) {
        this.photo = photo;
    }

    setAdditionalPhotos(photos: File[]) {
        this.additionalPhotos = photos;
    }

    setRelationshipPreference(preference: Preference) {
        this.relationshipPreference = preference;
    }

    // Computed свойства (геттеры)
    // TODO: если undefined сделать запрос на сервер.
    get getIsu() {
        if (this.isu === undefined) {
            console.warn("ISU is undefined. Returning default value.");
            return -1; // Значение по умолчанию
        }
        return this.isu;
    }

    get getUsername() {
        if (this.username === undefined) {
            console.warn("Username is undefined. Returning default value.");
            return "Default Username"; // Значение по умолчанию
        }
        return this.username;
    }

    get getAge() {
        if (this.age === undefined) {
            console.warn("Age is undefined. Returning default value.");
            return 0; // Значение по умолчанию
        }
        return this.age;
    }

    get getBio() {
        if (this.bio === undefined) {
            console.warn("Bio is undefined. Returning default value.");
            return "No bio available"; // Значение по умолчанию
        }
        return this.bio;
    }

    get getWeight() {
        if (this.weight === undefined) {
            console.warn("Weight is undefined. Returning default value.");
            return 0; // Значение по умолчанию
        }
        return this.weight;
    }

    get getHeight() {
        if (this.height === undefined) {
            console.warn("Height is undefined. Returning default value.");
            return 0; // Значение по умолчанию
        }
        return this.height;
    }

    get getZodiac() {
        if (this.zodiac === undefined) {
            console.warn("Zodiac is undefined. Returning default value.");
            return "Not specified"; // Значение по умолчанию
        }
        return this.zodiac;
    }

    get getGenderPreference() {
        if (this.genderPreference === undefined) {
            console.warn("Gender preference is undefined. Returning default value.");
            return "Not specified"; // Значение по умолчанию
        }
        return this.genderPreference;
    }

    get getTags() {
        if (this.tags === undefined) {
            console.warn("Tags are undefined. Returning empty array.");
            return []; // Значение по умолчанию
        }
        return this.tags;
    }

    get getPhoto() {
        if (this.photo === undefined) {
            console.warn("Photo is undefined. Returning null.");
            return null; // Значение по умолчанию
        }
        return this.photo;
    }

    get getAdditionalPhotos() {
        if (this.additionalPhotos === undefined) {
            console.warn("Additional photos are undefined. Returning empty array.");
            return []; // Значение по умолчанию
        }
        return this.additionalPhotos;
    }

    get getRelationshipPreference() {
        if (this.relationshipPreference === undefined) {
            console.warn("Relationship preference is undefined. Returning default value.");
            return null; // Значение по умолчанию
        }
        return this.relationshipPreference;
    }
}

export const userData = new UserData();