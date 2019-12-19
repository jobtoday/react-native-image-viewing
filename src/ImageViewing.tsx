/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ComponentType, useCallback } from "react";
import { Dimensions, StyleSheet, View, VirtualizedList } from "react-native";

import Modal from "./Modal/Modal";
import ImageItem from "./ImageItem/ImageItem";
import ImageDefaultHeader from "./ImageDefaultHeader";

import useImageIndexChange from "./hooks/useImageIndexChange";
import useRequestClose from "./hooks/useRequestClose";
import { ImageSource } from "./@types";

type Props = {
  images: ImageSource[];
  imageIndex: number;
  visible: boolean;
  onRequestClose: () => void;
  animationType?: "none" | "fade" | "slide";
  backgroundColor?: string;
  swipeToCloseEnabled?: boolean;
  HeaderComponent?: ComponentType<{ imageIndex: number }>;
  FooterComponent?: ComponentType<{ imageIndex: number }>;
};

const DEFAULT_ANIMATION_TYPE = "fade";
const DEFAULT_BG_COLOR = "#000";
const SCREEN = Dimensions.get("screen");
const SCREEN_WIDTH = SCREEN.width;

function ImageViewing({
  images,
  imageIndex,
  visible,
  onRequestClose,
  animationType = DEFAULT_ANIMATION_TYPE,
  backgroundColor = DEFAULT_BG_COLOR,
  swipeToCloseEnabled,
  HeaderComponent,
  FooterComponent
}: Props) {
  const imageList = React.createRef<VirtualizedList<ImageSource>>();
  const [opacity, onRequestCloseEnhanced] = useRequestClose(onRequestClose);
  const [currentImageIndex, onScroll] = useImageIndexChange(imageIndex, SCREEN);
  const onZoom = useCallback(
    (isZoomed: boolean) => {
      if (imageList?.current) {
        // @ts-ignore
        imageList.current.setNativeProps({
          scrollEnabled: !isZoomed
        });
      }
    },
    [imageList]
  );

  return (
    <Modal
      transparent
      visible={visible}
      animationType={animationType}
      onRequestClose={onRequestCloseEnhanced}
      supportedOrientations={["portrait"]}
    >
      <View style={[styles.container, { opacity, backgroundColor }]}>
        <View style={styles.header}>
          {typeof HeaderComponent !== "undefined" ? (
            React.createElement(HeaderComponent, {
              imageIndex: currentImageIndex
            })
          ) : (
            <ImageDefaultHeader onRequestClose={onRequestCloseEnhanced} />
          )}
        </View>
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
          getItem={(_, index) => images[index]}
          getItemCount={() => images.length}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index
          })}
          renderItem={({ item: imageSrc }) => (
            <ImageItem
              onZoom={onZoom}
              imageSrc={imageSrc}
              onRequestClose={onRequestCloseEnhanced}
              swipeToCloseEnabled={swipeToCloseEnabled}
            />
          )}
          onMomentumScrollEnd={onScroll}
          keyExtractor={imageSrc => imageSrc.uri}
        />
        {typeof FooterComponent !== "undefined" && (
          <View style={styles.footer}>
            {React.createElement(FooterComponent, {
              imageIndex: currentImageIndex
            })}
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  header: {
    position: "absolute",
    width: "100%",
    zIndex: 1,
    top: 0
  },
  footer: {
    position: "absolute",
    width: "100%",
    zIndex: 1,
    bottom: 0
  }
});

const EnhancedImageViewing = (props: Props) => (
  <ImageViewing key={props.imageIndex} {...props} />
);

export default EnhancedImageViewing;
