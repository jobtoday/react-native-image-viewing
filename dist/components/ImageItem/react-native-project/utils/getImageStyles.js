import { StyleSheet } from "react-native";
export const getImageStyles = (imageDimensions, translateValue, scaleValue) => {
    const { width, height } = imageDimensions;
    return StyleSheet.create({
        image: {
            width: width * scaleValue,
            height: height * scaleValue,
            transform: [
                { translateX: translateValue.x },
                { translateY: translateValue.y },
                { scale: scaleValue },
            ],
            resizeMode: "contain",
        },
    });
};
