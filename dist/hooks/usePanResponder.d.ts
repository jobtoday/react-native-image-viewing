/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Animated, GestureResponderHandlers } from 'react-native';
import { Position } from '../@types';
type Props = {
    initialScale: number;
    initialTranslate: Position;
    onZoom: (isZoomed: boolean) => void;
    doubleTapToZoomEnabled: boolean;
    onLongPress: () => void;
    delayLongPress: number;
    onPress: () => void;
    doubleTapDelay: number;
};
declare const usePanResponder: ({ initialScale, initialTranslate, onZoom, doubleTapToZoomEnabled, onLongPress, delayLongPress, onPress, doubleTapDelay, }: Props) => readonly [GestureResponderHandlers, Animated.Value, Animated.ValueXY];
export default usePanResponder;
