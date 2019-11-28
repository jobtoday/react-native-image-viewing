/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ComponentType } from "react";
import { Dimensions, FlatList, Modal, StyleSheet, View } from "react-native";

import ImageItem from "./ImageItem/ImageItem";
import ImageDefaultHeader from "./ImageDefaultHeader";

import useImageIndexChange from "./hooks/useImageIndexChange";
import useRequestClose from "./hooks/useRequestClose";
import { ImageSource } from "./@types";

type Props = {
  images: ImageSource[];
  imageIndex: number;
  isVisible: boolean;
  onRequestClose: () => void;
  animationType?: "none" | "fade" | "slide";
  backgroundColor?: string;
  isSwipeToCloseEnabled?: boolean;
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
  isVisible,
  onRequestClose,
  animationType = DEFAULT_ANIMATION_TYPE,
  backgroundColor = DEFAULT_BG_COLOR,
  isSwipeToCloseEnabled,
  HeaderComponent,
  FooterComponent
}: Props) {
  let flatList = React.createRef<FlatList<ImageSource>>();
  const [opacity, onRequestCloseEnhanced] = useRequestClose(onRequestClose);
  const [currentImageIndex, onScroll] = useImageIndexChange(imageIndex, SCREEN);

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType={animationType}
      onRequestClose={onRequestCloseEnhanced}
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
        <FlatList
          ref={flatList}
          data={images}
          horizontal
          pagingEnabled
          nestedScrollEnabled={true}
          initialScrollIndex={imageIndex}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index
          })}
          renderItem={({ item: imageSrc }) => (
            <ImageItem
              onZoom={isZoomed => {
                if (flatList?.current) {
                  // @ts-ignore
                  flatList.current.setNativeProps({ scrollEnabled: !isZoomed });
                }
              }}
              imageSrc={imageSrc}
              onRequestClose={onRequestCloseEnhanced}
              isSwipeToCloseEnabled={isSwipeToCloseEnabled}
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
