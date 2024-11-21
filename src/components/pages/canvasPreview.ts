import { PixelCrop } from "react-image-crop";

const TO_RADIANS = Math.PI / 180;

export async function canvasPreview(
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    crop: PixelCrop,
    scale = 1,
    rotate = 0,
    textBoxes = []
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

    ctx.translate(
        canvas.width / (2 * pixelRatio),
        canvas.height / (2 * pixelRatio)
    );
    ctx.rotate(rotate * TO_RADIANS);
    ctx.scale(scale, scale);
    ctx.translate(
        -((crop.x + crop.width / 2) * scaleX),
        -((crop.y + crop.height / 2) * scaleY)
    );

    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

    ctx.restore();

    textBoxes.forEach((box) => {
        ctx.save();
        

        const x = (box.x - crop.x) * scaleX;
        const y = (box.y - crop.y) * scaleY;
        const width = box.width * scaleX;
        const height = box.height * scaleY;
        const fontSize = box.fontSize * ((scaleX + scaleY) / 2);

        ctx.translate(x + width / 2, y + height / 2);
        ctx.rotate((box.rotation * Math.PI) / 180);

        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = box.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const lines = box.text.split("\n");
        const lineHeight = fontSize * 1.2;

        lines.forEach((line, index) => {
            ctx.fillText(
                line,
                0,
                (index - (lines.length - 1) / 2) * lineHeight,
                width
            );
        });

        ctx.restore();
    });
}
