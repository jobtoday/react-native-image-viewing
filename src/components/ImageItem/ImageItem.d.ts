/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from "react";
import { GestureResponderEvent } from "react-native";
import { ImageSource } from "../../@types";

declare type Props = {
  imageSrc: ImageSource;
  onRequestClose: () => void;
  onZoom: (isZoomed: boolean) => void;
  onLongPress: (image: ImageSource) => void;
  onPress: (image: ImageSource) => void;
  delayLongPress: number;
  swipeToCloseEnabled?: boolean;
  doubleTapToZoomEnabled?: boolean;
  onScroll: (offsetY: number) => void;
  LoaderComponent?: ComponentType;
  ItemComponent?: ComponentType<{
    onLoad?: () => void;
    source: ImageSource;
    style: any;
  }>;
};

declare const _default: React.MemoExoticComponent<
  ({
    imageSrc,
    onZoom,
    onRequestClose,
    onLongPress,
    onPress,
    delayLongPress,
    swipeToCloseEnabled,
    onScroll,
    LoaderComponent,
    ItemComponent,
  }: Props) => JSX.Element
>;

export default _default;
