import { useRef, useEffect } from "react";
import { PanResponder } from "react-native";
const usePanResponder = ({ initialScale, initialTranslate, onZoom, doubleTapToZoomEnabled, onLongPress, delayLongPress, }) => {
    const scaleValue = useRef(new Animated.Value(initialScale)).current;
    const translateValue = useRef(new Animated.ValueXY(initialTranslate)).current;
    const panResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            // Handle gesture start
        },
        onPanResponderMove: (evt, gestureState) => {
            // Handle gesture move
        },
        onPanResponderRelease: (evt, gestureState) => {
            // Handle gesture release
        },
        onPanResponderTerminate: () => {
            // Handle gesture termination
        },
        onLongPress: (evt) => {
            if (onLongPress) {
                onLongPress(evt);
            }
        },
    })).current;
    useEffect(() => {
        // Handle double tap to zoom if enabled
    }, [doubleTapToZoomEnabled]);
    return [panResponder, scaleValue, translateValue];
};
export default usePanResponder;
