import { PixelCrop } from "react-image-crop";

const TO_RADIANS = Math.PI / 180;

export async function canvasPreview(
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    crop: PixelCrop,
    scale = 1,
    rotate = 0
) {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("No 2d context");
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio;

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";

    ctx.save();

    ctx.translate(canvas.width / (2 * pixelRatio), canvas.height / (2 * pixelRatio));
    ctx.rotate(rotate * TO_RADIANS);
    ctx.scale(scale, scale);
    ctx.translate(
        -((crop.x + crop.width / 2) * scaleX),
        -((crop.y + crop.height / 2) * scaleY)
    );

    ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
    );

    ctx.restore();
}
