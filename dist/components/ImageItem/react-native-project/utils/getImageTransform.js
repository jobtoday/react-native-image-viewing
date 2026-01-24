import { Dimensions } from "react-native";
const SCREEN = Dimensions.get("window");
export const getImageTransform = (imageDimensions, screen) => {
    const scale = Math.min(screen.width / imageDimensions.width, screen.height / imageDimensions.height);
    const translateX = (screen.width - imageDimensions.width * scale) / 2;
    const translateY = (screen.height - imageDimensions.height * scale) / 2;
    return [{ x: translateX, y: translateY }, scale];
};
