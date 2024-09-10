/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Image, ImageProps } from 'expo-image';
import React, {
  ComponentType,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import {
  Animated,
  Modal,
  ModalProps,
  StyleSheet,
  View,
  VirtualizedList,
  useWindowDimensions,
} from 'react-native';

import { ImageSource } from './@types';
import ImageDefaultHeader from './components/ImageDefaultHeader';
import ImageItem from './components/ImageItem/ImageItem';
import StatusBarManager from './components/StatusBarManager';
import useAnimatedComponents from './hooks/useAnimatedComponents';
import useRequestClose from './hooks/useRequestClose';

type Orientations =
  | 'portrait'
  | 'portrait-upside-down'
  | 'landscape'
  | 'landscape-left'
  | 'landscape-right';

type ViewToken = {
  item: any;
  key: string;
  index: number | null;
  isViewable: boolean;
  section?: any;
};

type Props = {
  images: ImageSource[];
  keyExtractor?: (imageSrc: ImageSource, index: number) => string;
  imageIndex: number;
  visible: boolean;
  onRequestClose: () => void;
  onPress?: (image: ImageSource) => void;
  onLongPress?: (image: ImageSource) => void;
  onImageIndexChange?: (imageIndex: number) => void;
  presentationStyle?: ModalProps['presentationStyle'];
  animationType?: ModalProps['animationType'];
  backgroundColor?: string;
  swipeToCloseEnabled?: boolean;
  doubleTapToZoomEnabled?: boolean;
  delayLongPress?: number;
  HeaderComponent?: ComponentType<{ imageIndex: number }>;
  FooterComponent?: ComponentType<{ imageIndex: number }>;
  doubleTapDelay?: number;
  withBlurBackground?: boolean;
  blurRadius?: number;
  blurOverlayColor?: string;
  imageProps?: ImageProps;
  supportedOrientations?: Orientations[];
};

const DEFAULT_ANIMATION_TYPE = 'fade';
const DEFAULT_BG_COLOR = '#000';
const DEFAULT_DELAY_LONG_PRESS = 800;
const DEFAULT_DOUBLE_TAP_DELAY = 300;

function ImageViewing({
  images,
  keyExtractor,
  imageIndex,
  visible,
  onRequestClose,
  onPress = () => {},
  onLongPress = () => {},
  onImageIndexChange,
  animationType = DEFAULT_ANIMATION_TYPE,
  backgroundColor = DEFAULT_BG_COLOR,
  presentationStyle,
  swipeToCloseEnabled,
  doubleTapToZoomEnabled,
  delayLongPress = DEFAULT_DELAY_LONG_PRESS,
  HeaderComponent,
  FooterComponent,
  doubleTapDelay = DEFAULT_DOUBLE_TAP_DELAY,
  withBlurBackground = true,
  blurRadius = 10,
  blurOverlayColor,
  imageProps,
  supportedOrientations = ['portrait'],
}: Props) {
  const imageList = useRef<VirtualizedList<ImageSource>>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRotating, startRotation] = useTransition();

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const [opacity, onRequestCloseEnhanced] = useRequestClose(onRequestClose);
  const [headerTransform, footerTransform, toggleBarsVisible] =
    useAnimatedComponents();

  const onZoom = useCallback(
    (isScaled: boolean) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      imageList?.current?.setNativeProps({ scrollEnabled: !isScaled });
      toggleBarsVisible(!isScaled);
    },
    [toggleBarsVisible, imageList]
  );

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
        // @ts-ignore
        imageList.current?.scrollToIndex({
          index: currentIndex,
          animated: false,
        });
      });
    }
  }, [windowWidth, imageList]);

  useEffect(() => {
    onImageIndexChange?.(currentIndex);
  }, [onImageIndexChange, currentIndex]);

  const onViewableItemsChanged = useCallback(
    ({
      viewableItems,
      changed,
    }: {
      viewableItems: ViewToken[];
      changed: ViewToken[];
    }) => {
      if (isRotating) return;
      const index = viewableItems[0].index ?? 0;
      setCurrentIndex(index);
    },
    []
  );

  const viewabilityConfigCallbackPairs = useRef([
    {
      onViewableItemsChanged,
    },
  ]);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      transparent={presentationStyle === 'overFullScreen'}
      visible={visible}
      presentationStyle={presentationStyle}
      animationType={animationType}
      onRequestClose={onRequestCloseEnhanced}
      supportedOrientations={supportedOrientations}
      hardwareAccelerated
    >
      <StatusBarManager presentationStyle={presentationStyle} />
      <View style={[styles.container, { opacity, backgroundColor }]}>
        <Animated.View style={[styles.header, { transform: headerTransform }]}>
          {typeof HeaderComponent !== 'undefined' ? (
            React.createElement(HeaderComponent, {
              imageIndex: currentIndex,
            })
          ) : (
            <ImageDefaultHeader onRequestClose={onRequestCloseEnhanced} />
          )}
        </Animated.View>
        <VirtualizedList
          ref={imageList}
          data={images}
          horizontal
          pagingEnabled
          windowSize={2}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          initialScrollIndex={imageIndex}
          getItemCount={() => images.length}
          getItem={(data: ImageSource[], index: number) => {
            return data[index];
          }}
          getItemLayout={(_: ImageSource, index: number) => ({
            length: windowWidth,
            offset: windowWidth * index,
            index,
          })}
          renderItem={({ item: imageSrc }: { item: ImageSource }) => {
            return (
              <>
                {withBlurBackground && (
                  <Image
                    {...imageProps}
                    source={imageSrc}
                    style={styles.absolute}
                    blurRadius={blurRadius}
                  />
                )}
                <View
                  style={
                    withBlurBackground && blurOverlayColor
                      ? { backgroundColor: blurOverlayColor }
                      : {}
                  }
                >
                  <ImageItem
                    onZoom={onZoom}
                    imageSrc={imageSrc}
                    onRequestClose={onRequestCloseEnhanced}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    delayLongPress={delayLongPress}
                    swipeToCloseEnabled={swipeToCloseEnabled}
                    doubleTapToZoomEnabled={doubleTapToZoomEnabled}
                    doubleTapDelay={doubleTapDelay}
                    imageProps={imageProps}
                    windowSize={{ width: windowWidth, height: windowHeight }}
                  />
                </View>
              </>
            );
          }}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 100,
          }}
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
          keyExtractor={(imageSrc: ImageSource, index: number) =>
            keyExtractor?.(imageSrc, index) ?? typeof imageSrc === 'number'
              ? imageSrc.toString()
              : imageSrc?.uri ?? index.toString()
          }
        />
        {typeof FooterComponent !== 'undefined' && (
          <Animated.View
            style={[styles.footer, { transform: footerTransform }]}
          >
            {React.createElement(FooterComponent, {
              imageIndex: currentIndex,
            })}
          </Animated.View>
        )}
      </View>
    </Modal>
  );
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

const EnhancedImageViewing = (props: Props) => (
  <ImageViewing key={props.imageIndex} {...props} />
);

export default EnhancedImageViewing;
