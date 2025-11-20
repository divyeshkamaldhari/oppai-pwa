import { useEffect, useRef, useState } from "react";

import { BACKEND_URL, DEVLOPMENT_ENVIRONMENT } from "../../constants/EnvConstants";

interface IPixelatedGalleryImage {
    imageUrl: string;
    className: string;
}

const PixelatedGalleryImage = ({ imageUrl, className }: IPixelatedGalleryImage) => {
    const converImgURL = DEVLOPMENT_ENVIRONMENT === "local" ? imageUrl.replace(BACKEND_URL, "") : imageUrl;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!imageUrl) return;

        const canvas = canvasRef.current;

        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        const img = new Image();

        img.crossOrigin = "anonymous";
        img.decoding = "async";
        img.loading = "eager";
        img.src = converImgURL;

        img.onload = () => {
            setLoaded(true);
            const width = img.naturalWidth;
            const height = img.naturalHeight;

            canvas.width = width;
            canvas.height = height;

            const offCanvas = document.createElement("canvas");
            const scale = 0.1; // pixelation

            offCanvas.width = Math.max(1, width * scale);
            offCanvas.height = Math.max(1, height * scale);

            const offCtx = offCanvas.getContext("2d");

            if (!offCtx) return;

            offCtx.imageSmoothingEnabled = false;
            offCtx.drawImage(img, 0, 0, offCanvas.width, offCanvas.height);

            ctx.imageSmoothingEnabled = false;
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(offCanvas, 0, 0, offCanvas.width, offCanvas.height, 0, 0, width, height);
        };

        img.onerror = () => {
            ctx.fillStyle = "#222";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#fff";
            ctx.font = "16px sans-serif";
            ctx.fillText("Image not loaded", 10, 30);
        };
    }, [imageUrl]);

    return (
        <>
            {!loaded && <div className={`w-full h-full ${className}`} style={{ background: "#222" }} />}
            <canvas
                ref={canvasRef}
                className={`w-full h-full ${className} ${loaded ? "" : "hidden"}`}
                style={{
                    display: "block",
                    imageRendering: "pixelated",
                    objectFit: "cover",
                }}
            />
        </>
    );
};

export default PixelatedGalleryImage;
