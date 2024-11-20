import { PixelCrop } from 'react-image-crop';

const TO_RADIANS = Math.PI / 180;

export function canvasPreview(
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    crop: PixelCrop,
    scale = 1,
    rotate = 0
) {
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio;

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    ctx.save();

    ctx.translate(-crop.x * scaleX, -crop.y * scaleY);
    ctx.translate(image.width / 2, image.height / 2);
    ctx.scale(scale, scale);
    ctx.rotate(rotate * TO_RADIANS);
    ctx.translate(-image.width / 2, -image.height / 2);
    ctx.drawImage(
        image,
        0,
        0,
        image.width,
        image.height
    );

    ctx.restore();
}
