/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useRef, useState, useTransition, } from 'react';
import { Animated, Modal, StyleSheet, View, VirtualizedList, useWindowDimensions, } from 'react-native';
import ImageDefaultHeader from './components/ImageDefaultHeader';
import ImageItem from './components/ImageItem/ImageItem';
import StatusBarManager from './components/StatusBarManager';
import useAnimatedComponents from './hooks/useAnimatedComponents';
import useRequestClose from './hooks/useRequestClose';
const DEFAULT_ANIMATION_TYPE = 'fade';
const DEFAULT_BG_COLOR = '#000';
const DEFAULT_DELAY_LONG_PRESS = 800;
const DEFAULT_DOUBLE_TAP_DELAY = 300;
function ImageViewing({ images, keyExtractor, imageIndex, visible, onRequestClose, onPress = () => { }, onLongPress = () => { }, onImageIndexChange, animationType = DEFAULT_ANIMATION_TYPE, backgroundColor = DEFAULT_BG_COLOR, presentationStyle, swipeToCloseEnabled, doubleTapToZoomEnabled, delayLongPress = DEFAULT_DELAY_LONG_PRESS, HeaderComponent, FooterComponent, doubleTapDelay = DEFAULT_DOUBLE_TAP_DELAY, withBlurBackground = true, blurRadius = 10, blurOverlayColor, imageProps, supportedOrientations = ['portrait'], }) {
    const imageList = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isRotating, startRotation] = useTransition();
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const [opacity, onRequestCloseEnhanced] = useRequestClose(onRequestClose);
    const [headerTransform, footerTransform, toggleBarsVisible] = useAnimatedComponents();
    const onZoom = useCallback((isScaled) => {
        var _a;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (_a = imageList === null || imageList === void 0 ? void 0 : imageList.current) === null || _a === void 0 ? void 0 : _a.setNativeProps({ scrollEnabled: !isScaled });
        toggleBarsVisible(!isScaled);
    }, [toggleBarsVisible, imageList]);
    // Set default index when visible change
    useEffect(() => {
        if (visible) {
            setCurrentIndex(imageIndex);
        }
    }, [visible, imageIndex]);
    // When windowWidth change, reset list to currentIndex
    useEffect(() => {
        if (imageList.current) {
            startRotation(() => {
                var _a;
                // @ts-ignore
                (_a = imageList.current) === null || _a === void 0 ? void 0 : _a.scrollToIndex({
                    index: currentIndex,
                    animated: false,
                });
            });
        }
    }, [windowWidth, imageList]);
    useEffect(() => {
        onImageIndexChange === null || onImageIndexChange === void 0 ? void 0 : onImageIndexChange(currentIndex);
    }, [onImageIndexChange, currentIndex]);
    const onViewableItemsChanged = useCallback(({ viewableItems, changed, }) => {
        var _a;
        if (isRotating)
            return;
        const index = (_a = viewableItems[0].index) !== null && _a !== void 0 ? _a : 0;
        setCurrentIndex(index);
    }, []);
    const viewabilityConfigCallbackPairs = useRef([
        {
            onViewableItemsChanged,
        },
    ]);
    if (!visible) {
        return null;
    }
    return (<Modal transparent={presentationStyle === 'overFullScreen'} visible={visible} presentationStyle={presentationStyle} animationType={animationType} onRequestClose={onRequestCloseEnhanced} supportedOrientations={supportedOrientations} hardwareAccelerated>
      <StatusBarManager presentationStyle={presentationStyle}/>
      <View style={[styles.container, { opacity, backgroundColor }]}>
        <Animated.View style={[styles.header, { transform: headerTransform }]}>
          {typeof HeaderComponent !== 'undefined' ? (React.createElement(HeaderComponent, {
            imageIndex: currentIndex,
        })) : (<ImageDefaultHeader onRequestClose={onRequestCloseEnhanced}/>)}
        </Animated.View>
        <VirtualizedList ref={imageList} data={images} horizontal pagingEnabled windowSize={2} initialNumToRender={1} maxToRenderPerBatch={1} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} initialScrollIndex={imageIndex} getItemCount={() => images.length} getItem={(data, index) => {
            return data[index];
        }} getItemLayout={(_, index) => ({
            length: windowWidth,
            offset: windowWidth * index,
            index,
        })} renderItem={({ item: imageSrc }) => {
            return (<>
                {withBlurBackground && (<Image {...imageProps} source={imageSrc} style={styles.absolute} blurRadius={blurRadius}/>)}
                <View style={withBlurBackground && blurOverlayColor
                    ? { backgroundColor: blurOverlayColor }
                    : {}}>
                  <ImageItem onZoom={onZoom} imageSrc={imageSrc} onRequestClose={onRequestCloseEnhanced} onPress={onPress} onLongPress={onLongPress} delayLongPress={delayLongPress} swipeToCloseEnabled={swipeToCloseEnabled} doubleTapToZoomEnabled={doubleTapToZoomEnabled} doubleTapDelay={doubleTapDelay} imageProps={imageProps} windowSize={{ width: windowWidth, height: windowHeight }}/>
                </View>
              </>);
        }} viewabilityConfig={{
            itemVisiblePercentThreshold: 100,
        }} viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current} keyExtractor={(imageSrc, index) => {
            var _a, _b;
            return ((_a = keyExtractor === null || keyExtractor === void 0 ? void 0 : keyExtractor(imageSrc, index)) !== null && _a !== void 0 ? _a : typeof imageSrc === 'number')
                ? imageSrc.toString()
                : (_b = imageSrc === null || imageSrc === void 0 ? void 0 : imageSrc.uri) !== null && _b !== void 0 ? _b : index.toString();
        }}/>
        {typeof FooterComponent !== 'undefined' && (<Animated.View style={[styles.footer, { transform: footerTransform }]}>
            {React.createElement(FooterComponent, {
                imageIndex: currentIndex,
            })}
          </Animated.View>)}
      </View>
    </Modal>);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    absolute: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    header: {
        position: 'absolute',
        width: '100%',
        zIndex: 1,
        top: 0,
    },
    footer: {
        position: 'absolute',
        width: '100%',
        zIndex: 1,
        bottom: 0,
    },
});
const EnhancedImageViewing = (props) => (<ImageViewing key={props.imageIndex} {...props}/>);
export default EnhancedImageViewing;
