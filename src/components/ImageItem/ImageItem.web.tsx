/**
 * Web implementation for ImageItem
 */

import React, { useCallback, useMemo, useRef, useState } from "react";

import {
  Animated,
  ScrollView,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Dimensions,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import useImageDimensions from "../../hooks/useImageDimensions";
import { getImageStyles, getImageTransform } from "../../utils";
import { ImageSource } from "../../@types";
import { ImageLoading } from "./ImageLoading";

const SWIPE_CLOSE_OFFSET = 75;

type Props = {
  imageSrc: ImageSource;
  onRequestClose: () => void;
  onZoom: (isZoomed: boolean) => void;
  onLongPress: (image: ImageSource) => void;
  delayLongPress: number;
  swipeToCloseEnabled?: boolean;
  doubleTapToZoomEnabled?: boolean;
};

const SCREEN = Dimensions.get("screen");
const SCREEN_WIDTH = SCREEN.width;
const SCREEN_HEIGHT = SCREEN.height;

const ImageItem = ({
  imageSrc,
  onZoom,
  onRequestClose,
  onLongPress,
  delayLongPress,
  swipeToCloseEnabled = true,
  doubleTapToZoomEnabled = true,
}: Props) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const imageDimensions = useImageDimensions(imageSrc);

  const [loaded, setLoaded] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  // initial fit-to-screen transform
  const [initialTranslate, initialScale] = useMemo(() => {
    const [t, s] = getImageTransform(imageDimensions, SCREEN);
    return [t ?? { x: 0, y: 0 }, s ?? 1] as const;
  }, [imageDimensions, SCREEN]);

  // max zoom scale (similar idea to iOS file)
  const maxScale = useMemo(() => {
    const s = initialScale || 1;
    return s > 0 ? Math.max(1 / s, 1) : 1;
  }, [initialScale]);

  const scrollValueY = useMemo(() => new Animated.Value(0), []);
  const scaleValue = useMemo(
    () => new Animated.Value(initialScale || 1),
    [initialScale]
  );
  const translateValue = useMemo(
    () => new Animated.ValueXY(initialTranslate),
    [initialTranslate]
  );

  // Opacity change while swiping vertically (web friendly)
  const imageOpacity = scrollValueY.interpolate({
    inputRange: [-SWIPE_CLOSE_OFFSET, 0, SWIPE_CLOSE_OFFSET],
    outputRange: [0.7, 1, 0.7],
  });

  const imagesStyles = getImageStyles(
    imageDimensions,
    translateValue,
    scaleValue
  );
  const imageStylesWithOpacity = useMemo(
    () => ({ ...imagesStyles, opacity: imageOpacity }),
    [imagesStyles, imageOpacity]
  );

  const onLoaded = useCallback(() => setLoaded(true), []);

  const onLongPressHandler = useCallback(() => {
    onLongPress(imageSrc);
  }, [imageSrc, onLongPress]);

  const maybeCloseByOffset = useCallback(
    (offsetY: number) => {
      if (!swipeToCloseEnabled) return;

      // 어느 정도 끌어내리면 닫기
      if (offsetY > SCREEN_HEIGHT / 2 || offsetY > SCREEN_HEIGHT * 0.4) {
        onRequestClose();
      }
    },
    [SCREEN_HEIGHT, onRequestClose, swipeToCloseEnabled]
  );

  const onScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = nativeEvent?.contentOffset?.y ?? 0;

      if (zoomed) return;

      scrollValueY.setValue(offsetY);
    },
    [scrollValueY, zoomed]
  );

  const onScrollEndDrag = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = nativeEvent?.contentOffset?.y ?? 0;
      if (!zoomed) maybeCloseByOffset(offsetY);
    },
    [maybeCloseByOffset, zoomed]
  );

  const lastTapRef = useRef<number>(0);

  const toggleZoom = useCallback(() => {
    const nextZoomed = !zoomed;

    setZoomed(nextZoomed);
    onZoom(nextZoomed);

    Animated.timing(scaleValue, {
      toValue: nextZoomed ? maxScale : initialScale || 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [zoomed, onZoom, scaleValue, maxScale, initialScale]);

  const onPress = useCallback(() => {
    if (!doubleTapToZoomEnabled) return;

    const now = Date.now();
    const delta = now - lastTapRef.current;
    lastTapRef.current = now;

    // 280ms 안에 두 번 누르면 더블탭으로 간주
    if (delta > 0 && delta < 280) {
      toggleZoom();
    }
  }, [doubleTapToZoomEnabled, toggleZoom]);

  return (
    <View>
      <ScrollView
        ref={scrollViewRef}
        style={styles.listItem}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.imageScrollContainer]}
        scrollEnabled={swipeToCloseEnabled}
        scrollEventThrottle={16}
        {...(swipeToCloseEnabled
          ? {
              onScroll,
              onScrollEndDrag,
            }
          : {})}
      >
        <TouchableWithoutFeedback
          onPress={onPress}
          onLongPress={onLongPressHandler}
          delayLongPress={delayLongPress}
        >
          <Animated.Image
            source={imageSrc}
            style={imageStylesWithOpacity}
            onLoad={onLoaded}
          />
        </TouchableWithoutFeedback>

        {(!loaded || !imageDimensions) && <ImageLoading />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  imageScrollContainer: {
    height: SCREEN_HEIGHT,
  },
});

export default React.memo(ImageItem);
