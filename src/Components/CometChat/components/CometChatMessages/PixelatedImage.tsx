import { useEffect, useRef } from "react";

const PixelatedImage = ({ imageUrl }: { imageUrl: string }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        // Turn off image smoothing
        ctx.imageSmoothingEnabled = false;
        (ctx as any).mozImageSmoothingEnabled = false;
        (ctx as any).webkitImageSmoothingEnabled = false;
        (ctx as any).msImageSmoothingEnabled = false;
        const img = new Image();
        img.crossOrigin = "anonymous"; // Prevent CORS issues
        img.src = imageUrl;
        img.onload = () => {
            const scale = 5 * 0.01;
            const w = canvas.width * scale;
            const h = canvas.height * scale;
            // Step 1: Draw a scaled-down image
            ctx.drawImage(img, 0, 0, w, h);
            // Step 2: Stretch that image back to original canvas size (creates pixelation)
            ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
        };
    }, []);
    return (
        <canvas
            id="pixelCanvas"
            ref={canvasRef}
            // width={500}
            // height={400}
            className="h-full w-full object-contain object-center"
            style={{
                imageRendering: "pixelated",
                // maxWidth: "260px",
                // maxHeight: "260px",
                // display: "block",
                // borderRadius: "8px",
            }}
        />
    );
};
export default PixelatedImage;
