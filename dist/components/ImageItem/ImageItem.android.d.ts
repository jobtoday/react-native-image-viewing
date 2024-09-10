/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
import { ImageProps } from 'react-native';
import { ImageSource } from '../../@types';
type Props = {
    imageSrc: ImageSource;
    onRequestClose: () => void;
    onZoom: (isZoomed: boolean) => void;
    onPress: (image: ImageSource) => void;
    onLongPress: (image: ImageSource) => void;
    delayLongPress: number;
    swipeToCloseEnabled?: boolean;
    doubleTapToZoomEnabled?: boolean;
    doubleTapDelay: number;
    imageProps?: ImageProps;
    windowSize: {
        width: number;
        height: number;
    };
};
declare const _default: React.MemoExoticComponent<({ imageSrc, onZoom, onRequestClose, onPress, onLongPress, delayLongPress, swipeToCloseEnabled, doubleTapToZoomEnabled, doubleTapDelay, imageProps, windowSize, }: Props) => JSX.Element>;
export default _default;
