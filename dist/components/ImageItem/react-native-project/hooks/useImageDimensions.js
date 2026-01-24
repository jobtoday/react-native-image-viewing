import { useEffect, useState } from "react";
const useImageDimensions = (imageSrc) => {
    const [dimensions, setDimensions] = useState(null);
    useEffect(() => {
        const img = new Image();
        img.src = imageSrc;
        const handleLoad = () => {
            setDimensions({ width: img.width, height: img.height });
        };
        img.addEventListener("load", handleLoad);
        return () => {
            img.removeEventListener("load", handleLoad);
        };
    }, [imageSrc]);
    return dimensions;
};
export default useImageDimensions;
