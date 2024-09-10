/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, TouchableWithoutFeedback, } from 'react-native';
import useDoubleTapToZoom from '../../hooks/useDoubleTapToZoom';
import { getImageStyles, getImageTransform } from '../../utils';
import ImageLoading from './ImageLoading';
const SWIPE_CLOSE_OFFSET = 75;
const SWIPE_CLOSE_VELOCITY = 1.55;
const AnimatedImage = Animated.createAnimatedComponent(Image);
const ImageItem = ({ imageSrc, onZoom, onRequestClose, onLongPress, delayLongPress, swipeToCloseEnabled = true, doubleTapToZoomEnabled = true, onPress, doubleTapDelay, imageProps, windowSize, }) => {
    const scrollViewRef = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const [scaled, setScaled] = useState(false);
    const [size, setSize] = useState(() => ({
        width: 0,
        height: 0,
    }));
    const handleDoubleTap = useDoubleTapToZoom({
        scrollViewRef,
        scaled,
        screen: { width: windowSize.width, height: windowSize.height },
        onPress: () => onPress(imageSrc),
        doubleTapToZoomEnabled,
        doubleTapDelay,
    });
    const [translate, scale] = getImageTransform(size, {
        width: windowSize.width,
        height: windowSize.height,
    });
    const scrollValueY = new Animated.Value(0);
    const scaleValue = new Animated.Value(scale || 1);
    const translateValue = new Animated.ValueXY(translate);
    const maxScale = scale && scale > 0 ? Math.max(1 / scale, 1) : 1;
    const imageOpacity = scrollValueY.interpolate({
        inputRange: [-SWIPE_CLOSE_OFFSET, 0, SWIPE_CLOSE_OFFSET],
        outputRange: [0.5, 1, 0.5],
    });
    const imagesStyles = getImageStyles(size, translateValue, scaleValue);
    const imageStylesWithOpacity = { ...imagesStyles, opacity: imageOpacity };
    const onScrollEndDrag = useCallback(({ nativeEvent }) => {
        var _a, _b;
        const velocityY = (_b = (_a = nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.velocity) === null || _a === void 0 ? void 0 : _a.y) !== null && _b !== void 0 ? _b : 0;
        const scaled = (nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.zoomScale) > 1;
        onZoom(scaled);
        setScaled(scaled);
        if (!scaled &&
            swipeToCloseEnabled &&
            Math.abs(velocityY) > SWIPE_CLOSE_VELOCITY) {
            onRequestClose();
        }
    }, [onRequestClose, onZoom, swipeToCloseEnabled]);
    const onScroll = ({ nativeEvent, }) => {
        var _a, _b;
        const offsetY = (_b = (_a = nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.contentOffset) === null || _a === void 0 ? void 0 : _a.y) !== null && _b !== void 0 ? _b : 0;
        if ((nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.zoomScale) > 1) {
            return;
        }
        scrollValueY.setValue(offsetY);
    };
    const onLongPressHandler = useCallback(() => {
        onLongPress(imageSrc);
    }, [imageSrc, onLongPress]);
    const onLoaded = useCallback((e) => {
        setSize({
            width: e.source.width,
            height: e.source.height,
        });
        setLoaded(true);
    }, []);
    useEffect(() => {
        if (size.width === 0 && size.height === 0) {
            setSize({ width: windowSize.width, height: windowSize.height });
        }
    }, [windowSize.width, windowSize.height, size]);
    return (<ScrollView ref={scrollViewRef} style={{ width: windowSize.width, height: windowSize.height }} pinchGestureEnabled showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} maximumZoomScale={maxScale} scrollEnabled={swipeToCloseEnabled} onScrollEndDrag={onScrollEndDrag} scrollEventThrottle={1} {...(swipeToCloseEnabled && {
        onScroll,
    })}>
      {!loaded && <ImageLoading />}
      <TouchableWithoutFeedback onPress={doubleTapToZoomEnabled ? handleDoubleTap : undefined} onLongPress={onLongPressHandler} delayLongPress={delayLongPress}>
        <AnimatedImage {...imageProps} source={imageSrc} style={imageStylesWithOpacity} onLoad={onLoaded}/>
      </TouchableWithoutFeedback>
    </ScrollView>);
};
export default ImageItem;
