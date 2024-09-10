/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { useCallback, useRef, useState } from 'react';
import { Animated, Image, ScrollView, } from 'react-native';
import usePanResponder from '../../hooks/usePanResponder';
import { getImageStyles, getImageTransform } from '../../utils';
import ImageLoading from './ImageLoading';
const SWIPE_CLOSE_OFFSET = 75;
const SWIPE_CLOSE_VELOCITY = 1.75;
const AnimatedImage = Animated.createAnimatedComponent(Image);
const ImageItem = ({ imageSrc, onZoom, onRequestClose, onPress, onLongPress, delayLongPress, swipeToCloseEnabled = true, doubleTapToZoomEnabled = true, doubleTapDelay, imageProps, windowSize, }) => {
    const imageContainer = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const [isLoaded, setIsLoaded] = useState(false);
    const [translate, scale] = getImageTransform(size, {
        width: windowSize.width,
        height: windowSize.height,
    });
    const scrollValueY = new Animated.Value(0);
    const onLoaded = useCallback((e) => {
        setSize({
            width: e.source.width,
            height: e.source.height,
        });
        setIsLoaded(true);
    }, []);
    const onZoomPerformed = useCallback((isZoomed) => {
        onZoom(isZoomed);
        if (imageContainer === null || imageContainer === void 0 ? void 0 : imageContainer.current) {
            imageContainer.current.setNativeProps({
                scrollEnabled: !isZoomed,
            });
        }
    }, [imageContainer]);
    const onLongPressHandler = useCallback(() => {
        onLongPress(imageSrc);
    }, [imageSrc, onLongPress]);
    const onPressHandler = useCallback(() => {
        onPress(imageSrc);
    }, [imageSrc, onPress]);
    const [panHandlers, scaleValue, translateValue] = usePanResponder({
        initialScale: scale || 1,
        initialTranslate: translate || { x: 0, y: 0 },
        onZoom: onZoomPerformed,
        doubleTapToZoomEnabled,
        onLongPress: onLongPressHandler,
        delayLongPress,
        onPress: onPressHandler,
        doubleTapDelay,
    });
    const imagesStyles = getImageStyles(size, translateValue, scaleValue);
    const imageOpacity = scrollValueY.interpolate({
        inputRange: [-SWIPE_CLOSE_OFFSET, 0, SWIPE_CLOSE_OFFSET],
        outputRange: [0.7, 1, 0.7],
    });
    const imageStylesWithOpacity = { ...imagesStyles, opacity: imageOpacity };
    const onScrollEndDrag = ({ nativeEvent, }) => {
        var _a, _b, _c, _d;
        const velocityY = (_b = (_a = nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.velocity) === null || _a === void 0 ? void 0 : _a.y) !== null && _b !== void 0 ? _b : 0;
        const offsetY = (_d = (_c = nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.contentOffset) === null || _c === void 0 ? void 0 : _c.y) !== null && _d !== void 0 ? _d : 0;
        if ((Math.abs(velocityY) > SWIPE_CLOSE_VELOCITY &&
            offsetY > SWIPE_CLOSE_OFFSET) ||
            offsetY > windowSize.height / 2) {
            onRequestClose();
        }
    };
    const onScroll = ({ nativeEvent, }) => {
        var _a, _b;
        const offsetY = (_b = (_a = nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.contentOffset) === null || _a === void 0 ? void 0 : _a.y) !== null && _b !== void 0 ? _b : 0;
        scrollValueY.setValue(offsetY);
    };
    return (<ScrollView ref={imageContainer} style={{ width: windowSize.width, height: windowSize.height }} pagingEnabled nestedScrollEnabled showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} contentContainerStyle={{
            height: windowSize.height * 2,
        }} scrollEnabled={swipeToCloseEnabled} {...(swipeToCloseEnabled && {
        onScroll,
        onScrollEndDrag,
    })}>
      <AnimatedImage {...imageProps} {...panHandlers} source={imageSrc} onLoad={(e) => {
            onLoaded(e.nativeEvent);
        }} style={imageStylesWithOpacity}/>
      {!isLoaded && <ImageLoading />}
    </ScrollView>);
};
export default React.memo(ImageItem);
