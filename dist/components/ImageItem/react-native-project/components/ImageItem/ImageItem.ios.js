/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { useState } from "react";
import { Animated, Dimensions, ScrollView, StyleSheet, View } from "react-native";
import useImageDimensions from "../../hooks/useImageDimensions";
import { getImageStyles, getImageTransform } from "../../utils";
import { ImageLoading } from "./ImageLoading";
const SCREEN = Dimensions.get("window");
const SCREEN_WIDTH = SCREEN.width;
const SCREEN_HEIGHT = SCREEN.height;
const ImageItem = ({ imageSrc, onZoom, onRequestClose, onLongPress, delayLongPress, }) => {
    const imageDimensions = useImageDimensions(imageSrc);
    const [loaded, setLoaded] = useState(false);
    const [translate, scale] = getImageTransform(imageDimensions, SCREEN);
    const scrollValueY = new Animated.Value(0);
    const imagesStyles = getImageStyles(imageDimensions, translate, scale);
    const imageOpacity = scrollValueY.interpolate({
        inputRange: [-75, 0, 75],
        outputRange: [0.7, 1, 0.7],
    });
    const imageStylesWithOpacity = { ...imagesStyles, opacity: imageOpacity };
    const onScrollEndDrag = (event) => {
        const velocityY = event.nativeEvent.velocity.y;
        const offsetY = event.nativeEvent.contentOffset.y;
        if (Math.abs(velocityY) > 1.75 && offsetY > 75) {
            onRequestClose();
        }
    };
    const onScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        scrollValueY.setValue(offsetY);
    };
    return (<View>
      <ScrollView style={styles.listItem} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} scrollEnabled={true} onScroll={onScroll} onScrollEndDrag={onScrollEndDrag}>
        {(!loaded || !imageDimensions) && <ImageLoading />}
        <Animated.Image source={imageSrc} style={imageStylesWithOpacity} onLoad={() => setLoaded(true)}/>
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
