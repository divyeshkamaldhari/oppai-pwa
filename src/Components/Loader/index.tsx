import { useEffect, useState } from "react";

import loader1 from "../../../public/assets/loader-1.png";
import loader2 from "../../../public/assets/loader-2.png";

interface LoaderProps {
    isPurchase?: boolean;
}

const Loader = ({ isPurchase = false }: LoaderProps) => {
    const [scale, setScale] = useState(0.75);

    useEffect(() => {
        let growing = true;
        const interval = setInterval(() => {
            setScale((prev) => {
                if (growing && prev >= 1) growing = false;
                if (!growing && prev <= 0.75) growing = true;

                return +(prev + (growing ? 0.02 : -0.02)).toFixed(2);
            });
        }, 45);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={`fixed left-1/2 z-[999999] mx-auto flex flex-col h-full w-full max-w-md -translate-x-1/2 items-center justify-center bg-[#130C1E] text-black ${isPurchase ? "purchase-loader fixed overflow-hidden pointer-events-none" : ""}`}
        >
            <div className="relative mb-12" style={{ transform: `scale(0.8)` }}>
                <img alt="Loading..." src={loader1} />
                <img
                    alt="Loading..."
                    className="absolute"
                    src={loader2}
                    style={{ bottom: "-80px", transform: `scale(${scale})`, transition: "transform 0.016s linear" }}
                />
            </div>
        </div>
    );
};

export default Loader;
