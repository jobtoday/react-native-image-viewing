import React, { useCallback, useRef, useState } from "react";
import { Animated, Dimensions, ScrollView, StyleSheet, View, TouchableWithoutFeedback, } from "react-native";
import useDoubleTapToZoom from "../../hooks/useDoubleTapToZoom";
import useImageDimensions from "../../hooks/useImageDimensions";
import { getImageStyles, getImageTransform } from "../../utils";
import { ImageLoading } from "./ImageLoading";
const SCREEN = Dimensions.get("window");
const SCREEN_WIDTH = SCREEN.width;
const SCREEN_HEIGHT = SCREEN.height;
const ImageItem = ({ imageSrc, onZoom, onRequestClose, onLongPress, delayLongPress, swipeToCloseEnabled = true, doubleTapToZoomEnabled = true, }) => {
    const scrollViewRef = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const [scaled, setScaled] = useState(false);
    const imageDimensions = useImageDimensions(imageSrc);
    const handleDoubleTap = useDoubleTapToZoom(scrollViewRef, scaled, SCREEN);
    const [translate, scale] = getImageTransform(imageDimensions, SCREEN);
    const scrollValueY = new Animated.Value(0);
    const scaleValue = new Animated.Value(scale || 1);
    const translateValue = new Animated.ValueXY(translate);
    const imagesStyles = getImageStyles(imageDimensions, translateValue, scaleValue);
    const imageStylesWithOpacity = { ...imagesStyles };
    const onScrollEndDrag = useCallback(() => {
        if (!scaled && swipeToCloseEnabled) {
            onRequestClose();
        }
    }, [scaled, swipeToCloseEnabled]);
    const onLongPressHandler = useCallback(() => {
        onLongPress(imageSrc);
    }, [imageSrc, onLongPress]);
    return (<View>
      <ScrollView ref={scrollViewRef} style={styles.listItem} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} scrollEnabled={swipeToCloseEnabled} onScrollEndDrag={onScrollEndDrag}>
        {(!loaded || !imageDimensions) && <ImageLoading />}
        <TouchableWithoutFeedback onPress={doubleTapToZoomEnabled ? handleDoubleTap : undefined} onLongPress={onLongPressHandler} delayLongPress={delayLongPress}>
          <Animated.Image source={imageSrc} style={imageStylesWithOpacity} onLoad={() => setLoaded(true)}/>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>);
};
const styles = StyleSheet.create({
    listItem: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
});
export default React.memo(ImageItem);
