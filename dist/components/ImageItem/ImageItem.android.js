/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { useCallback, useRef, useState } from "react";
import { Animated, ScrollView, Dimensions, StyleSheet, } from "react-native";
import useImageDimensions from "../../hooks/useImageDimensions";
import usePanResponder from "../../hooks/usePanResponder";
import { getImageStyles, getImageTransform } from "../../utils";
import { ImageLoading } from "./ImageLoading";
const SWIPE_CLOSE_OFFSET = 75;
const SWIPE_CLOSE_VELOCITY = 1.75;
const SCREEN = Dimensions.get("window");
const SCREEN_WIDTH = SCREEN.width;
const SCREEN_HEIGHT = SCREEN.height;
const ImageItem = ({ imageSrc, onZoom, onRequestClose, onLongPress, delayLongPress, swipeToCloseEnabled = true, doubleTapToZoomEnabled = true, }) => {
    const imageContainer = useRef(null);
    const imageDimensions = useImageDimensions(imageSrc);
    const [translate, scale] = getImageTransform(imageDimensions, SCREEN);
    const scrollValueY = new Animated.Value(0);
    const [isLoaded, setLoadEnd] = useState(false);
    const onLoaded = useCallback(() => setLoadEnd(true), []);
    const onZoomPerformed = useCallback((isZoomed) => {
        var _a;
        onZoom(isZoomed);
        if ((_a = imageContainer) === null || _a === void 0 ? void 0 : _a.current) {
            imageContainer.current.setNativeProps({
                scrollEnabled: !isZoomed,
            });
        }
    }, [imageContainer]);
    const onLongPressHandler = useCallback(() => {
        onLongPress(imageSrc);
    }, [imageSrc, onLongPress]);
    const [panHandlers, scaleValue, translateValue] = usePanResponder({
        initialScale: scale || 1,
        initialTranslate: translate || { x: 0, y: 0 },
        onZoom: onZoomPerformed,
        doubleTapToZoomEnabled,
        onLongPress: onLongPressHandler,
        delayLongPress,
    });
    const imagesStyles = getImageStyles(imageDimensions, translateValue, scaleValue);
    const imageOpacity = scrollValueY.interpolate({
        inputRange: [-SWIPE_CLOSE_OFFSET, 0, SWIPE_CLOSE_OFFSET],
        outputRange: [0.7, 1, 0.7],
    });
    const imageStylesWithOpacity = { ...imagesStyles, opacity: imageOpacity };
    const onScrollEndDrag = ({ nativeEvent, }) => {
        var _a, _b, _c, _d, _e, _f;
        const velocityY = (_c = (_b = (_a = nativeEvent) === null || _a === void 0 ? void 0 : _a.velocity) === null || _b === void 0 ? void 0 : _b.y, (_c !== null && _c !== void 0 ? _c : 0));
        const offsetY = (_f = (_e = (_d = nativeEvent) === null || _d === void 0 ? void 0 : _d.contentOffset) === null || _e === void 0 ? void 0 : _e.y, (_f !== null && _f !== void 0 ? _f : 0));
        if ((Math.abs(velocityY) > SWIPE_CLOSE_VELOCITY &&
            offsetY > SWIPE_CLOSE_OFFSET) ||
            offsetY > SCREEN_HEIGHT / 2) {
            onRequestClose();
        }
    };
    const onScroll = ({ nativeEvent, }) => {
        var _a, _b, _c;
        const offsetY = (_c = (_b = (_a = nativeEvent) === null || _a === void 0 ? void 0 : _a.contentOffset) === null || _b === void 0 ? void 0 : _b.y, (_c !== null && _c !== void 0 ? _c : 0));
        scrollValueY.setValue(offsetY);
    };
    return (<ScrollView ref={imageContainer} style={styles.listItem} pagingEnabled nestedScrollEnabled showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.imageScrollContainer} scrollEnabled={swipeToCloseEnabled} {...(swipeToCloseEnabled && {
        onScroll,
        onScrollEndDrag,
    })}>
      <Animated.Image {...panHandlers} source={imageSrc} style={imageStylesWithOpacity} onLoad={onLoaded}/>
      {(!isLoaded || !imageDimensions) && <ImageLoading />}
    </ScrollView>);
};
const styles = StyleSheet.create({
    listItem: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    imageScrollContainer: {
        height: SCREEN_HEIGHT * 2,
    },
});
export default React.memo(ImageItem);
