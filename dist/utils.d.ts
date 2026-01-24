/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Animated, GestureResponderEvent, PanResponderGestureState, PanResponderInstance, NativeTouchEvent } from "react-native";
import { Dimensions, Position } from "./@types";
declare type CacheStorageItem = {
    key: string;
    value: any;
};
export declare const createCache: (cacheSize: number) => {
    _storage: CacheStorageItem[];
    get(key: string): any;
    set(key: string, value: any): void;
};
export declare const splitArrayIntoBatches: (arr: any[], batchSize: number) => any[];
export declare const getImageTransform: (image: Dimensions | null, screen: Dimensions) => readonly [] | readonly [{
    readonly x: number;
    readonly y: number;
}, number];
export declare const getImageStyles: (image: Dimensions | null, translate: Animated.ValueXY, scale?: Animated.Value | undefined) => {
    width: number;
    height: number;
    transform?: undefined;
} | {
    width: number;
    height: number;
    transform: {
        [key: string]: Animated.Value;
    }[];
};
export declare const getImageTranslate: (image: Dimensions, screen: Dimensions) => Position;
export declare const getImageDimensionsByTranslate: (translate: Position, screen: Dimensions) => Dimensions;
export declare const getImageTranslateForScale: (currentTranslate: Position, targetScale: number, screen: Dimensions) => Position;
declare type HandlerType = (event: GestureResponderEvent, state: PanResponderGestureState) => void;
declare type PanResponderProps = {
    onGrant: HandlerType;
    onStart?: HandlerType;
    onMove: HandlerType;
    onRelease?: HandlerType;
    onTerminate?: HandlerType;
};
export declare const createPanResponder: ({ onGrant, onStart, onMove, onRelease, onTerminate, }: PanResponderProps) => PanResponderInstance;
export declare const getDistanceBetweenTouches: (touches: NativeTouchEvent[]) => number;
export {};
