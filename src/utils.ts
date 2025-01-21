import imageCompression from "browser-image-compression";

export function calculateAge(birthdate: string) {
    const birthDateObj = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }

    return age;
}

export async function urlToFile(url: string, filename: string): Promise<File> {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
}

export function dataURLtoFile(dataURL: string, filename: string): File {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}

export async function compressImage(file: File, maxSizeMB: number = 1, maxRes: number = 1920) {
    const options = {
        maxSizeMB: maxSizeMB,
        maxWidthOrHeight: maxRes, 
        useWebWorker: true,
    };

    try {
        const compressedFile = await imageCompression(file, options);
        return new File([compressedFile], compressImage.name, { type: compressedFile.type });
    } catch (error) {
        console.error('Ошибка сжатия изображения:', error);
        return file;
    }
}
