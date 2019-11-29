/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from "react";

import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  NativeScrollEvent,
  NativeSyntheticEvent
} from "react-native";

import useImageDimensions from "../hooks/useImageDimensions";

import { styleFromImageDimensions } from "../utils";
import { ImageSource } from "../@types";
import { ImageLoading } from "./ImageLoading";

const SWIPE_CLOSE_OFFSET = 75;
const SWIPE_CLOSE_VELOCITY = 1.55;
const SCREEN = Dimensions.get("screen");
const SCREEN_WIDTH = SCREEN.width;
const SCREEN_HEIGHT = SCREEN.height;

type Props = {
  imageSrc: ImageSource;
  onRequestClose: () => void;
  onZoom: (isZoomed: boolean) => void;
  swipeToCloseEnabled?: boolean;
};

const ImageItem = ({
  imageSrc,
  onZoom,
  onRequestClose,
  swipeToCloseEnabled = true
}: Props) => {
  const imageDimensions = useImageDimensions(imageSrc);
  const [isLoaded, setLoadEnd] = useState(false);
  const scrollY = new Animated.Value(0);

  const imageOpacity = scrollY.interpolate({
    inputRange: [-SWIPE_CLOSE_OFFSET, 0, SWIPE_CLOSE_OFFSET],
    outputRange: [0.33, 1, 0.33]
  });

  const [imagesStyles, scale] = styleFromImageDimensions(
    imageDimensions,
    SCREEN
  );

  const imageStylesWithOpacity = {
    ...imagesStyles,
    opacity: imageOpacity
  };

  const onScrollEndDrag = ({
    nativeEvent
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const velocityY = nativeEvent?.velocity?.y ?? 0;
    const isZoomed = nativeEvent?.zoomScale > 1;

    onZoom(isZoomed);

    if (!isZoomed && Math.abs(velocityY) > SWIPE_CLOSE_VELOCITY) {
      onRequestClose();
    }
  };

  const onScroll = ({
    nativeEvent
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = nativeEvent?.contentOffset?.y ?? 0;

    if (nativeEvent?.zoomScale > 1) {
      return;
    }

    scrollY.setValue(offsetY);
  };

  return (
    <View>
      <Animated.ScrollView
        style={styles.listItem}
        pinchGestureEnabled
        nestedScrollEnabled={true}
        maximumZoomScale={1 / scale}
        contentContainerStyle={styles.imageScrollContainer}
        scrollEnabled={swipeToCloseEnabled}
        {...(swipeToCloseEnabled && {
          onScroll,
          onScrollEndDrag
        })}
      >
        {(!isLoaded || !imageDimensions) && <ImageLoading />}
        <Animated.Image
          source={imageSrc}
          style={imageStylesWithOpacity}
          onLoad={() => setLoadEnd(true)}
        />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },
  imageScrollContainer: {
    height: SCREEN_HEIGHT
  }
});

export default React.memo(ImageItem);
