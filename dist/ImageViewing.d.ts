/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ImageProps } from 'expo-image';
import { ComponentType } from 'react';
import { ModalProps } from 'react-native';
import { ImageSource } from './@types';
type Orientations = 'portrait' | 'portrait-upside-down' | 'landscape' | 'landscape-left' | 'landscape-right';
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
    HeaderComponent?: ComponentType<{
        imageIndex: number;
    }>;
    FooterComponent?: ComponentType<{
        imageIndex: number;
    }>;
    doubleTapDelay?: number;
    withBlurBackground?: boolean;
    blurRadius?: number;
    blurOverlayColor?: string;
    imageProps?: ImageProps;
    supportedOrientations?: Orientations[];
};
declare const EnhancedImageViewing: (props: Props) => JSX.Element;
export default EnhancedImageViewing;
