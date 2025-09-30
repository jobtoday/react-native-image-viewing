/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useEffect, useMemo } from "react";
import { Animated, Dimensions, } from "react-native";
import { createPanResponder, getDistanceBetweenTouches, getImageDimensionsByTranslate, getImageTranslate, } from "../utils";
const SCREEN = Dimensions.get("window");
const SCREEN_WIDTH = SCREEN.width;
const SCREEN_HEIGHT = SCREEN.height;
const MIN_DIMENSION = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT);
const SCALE_MAX = 2;
const DOUBLE_TAP_DELAY = 300;
const OUT_BOUND_MULTIPLIER = 0.75;
const CENTER_THRESHOLD = 0.3; // adjust 0.3 = 30% before initial scale
const usePanResponder = ({ initialScale, initialTranslate, onZoom, doubleTapToZoomEnabled, onLongPress, delayLongPress, }) => {
    let numberInitialTouches = 1;
    let initialTouches = [];
    let currentScale = initialScale;
    let currentTranslate = initialTranslate;
    let tmpScale = 0;
    let tmpTranslate = null;
    let isDoubleTapPerformed = false;
    let lastTapTS = null;
    let longPressHandlerRef = null;
    const meaningfulShift = MIN_DIMENSION * 0.01;
    const scaleValue = new Animated.Value(initialScale);
    const translateValue = new Animated.ValueXY(initialTranslate);
    const imageDimensions = getImageDimensionsByTranslate(initialTranslate, SCREEN);
    const getBounds = (scale) => {
        const scaledImageDimensions = {
            width: imageDimensions.width * scale,
            height: imageDimensions.height * scale,
        };
        const translateDelta = getImageTranslate(scaledImageDimensions, SCREEN);
        const left = initialTranslate.x - translateDelta.x;
        const right = left - (scaledImageDimensions.width - SCREEN.width);
        const top = initialTranslate.y - translateDelta.y;
        const bottom = top - (scaledImageDimensions.height - SCREEN.height);
        return [top, left, bottom, right];
    };
    const getTranslateInBounds = (translate, scale) => {
        const inBoundTranslate = { x: translate.x, y: translate.y };
        const [topBound, leftBound, bottomBound, rightBound] = getBounds(scale);
        if (translate.x > leftBound) {
            inBoundTranslate.x = leftBound;
        }
        else if (translate.x < rightBound) {
            inBoundTranslate.x = rightBound;
        }
        if (translate.y > topBound) {
            inBoundTranslate.y = topBound;
        }
        else if (translate.y < bottomBound) {
            inBoundTranslate.y = bottomBound;
        }
        return inBoundTranslate;
    };
    const fitsScreenByWidth = () => imageDimensions.width * currentScale < SCREEN_WIDTH;
    const fitsScreenByHeight = () => imageDimensions.height * currentScale < SCREEN_HEIGHT;
    useEffect(() => {
        scaleValue.addListener(({ value }) => {
            if (typeof onZoom === "function") {
                onZoom(value !== initialScale);
            }
        });
        return () => scaleValue.removeAllListeners();
    });
    const cancelLongPressHandle = () => {
        longPressHandlerRef && clearTimeout(longPressHandlerRef);
    };
    const handlers = {
        onGrant: (_, gestureState) => {
            numberInitialTouches = gestureState.numberActiveTouches;
            if (gestureState.numberActiveTouches > 1)
                return;
            longPressHandlerRef = setTimeout(onLongPress, delayLongPress);
        },
        onStart: (event, gestureState) => {
            initialTouches = event.nativeEvent.touches;
            numberInitialTouches = gestureState.numberActiveTouches;
            if (gestureState.numberActiveTouches > 1)
                return;
            const tapTS = Date.now();
            // Handle double tap event by calculating diff between first and second taps timestamps
            isDoubleTapPerformed = Boolean(lastTapTS && tapTS - lastTapTS < DOUBLE_TAP_DELAY);
            if (doubleTapToZoomEnabled && isDoubleTapPerformed) {
                const isScaled = currentTranslate.x !== initialTranslate.x; // currentScale !== initialScale;
                const { pageX: touchX, pageY: touchY } = event.nativeEvent.touches[0];
                const targetScale = SCALE_MAX;
                const nextScale = isScaled ? initialScale : targetScale;
                const nextTranslate = isScaled
                    ? initialTranslate
                    : getTranslateInBounds({
                        x: initialTranslate.x +
                            (SCREEN_WIDTH / 2 - touchX) * (targetScale / currentScale),
                        y: initialTranslate.y +
                            (SCREEN_HEIGHT / 2 - touchY) * (targetScale / currentScale),
                    }, targetScale);
                onZoom(!isScaled);
                Animated.parallel([
                    Animated.timing(translateValue.x, {
                        toValue: nextTranslate.x,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateValue.y, {
                        toValue: nextTranslate.y,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleValue, {
                        toValue: nextScale,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ], { stopTogether: false }).start(() => {
                    currentScale = nextScale;
                    currentTranslate = nextTranslate;
                });
                lastTapTS = null;
            }
            else {
                lastTapTS = Date.now();
            }
        },
        onMove: (event, gestureState) => {
            const { dx, dy } = gestureState;
            if (Math.abs(dx) >= meaningfulShift || Math.abs(dy) >= meaningfulShift) {
                cancelLongPressHandle();
            }
            // Don't need to handle move because double tap in progress (was handled in onStart)
            if (doubleTapToZoomEnabled && isDoubleTapPerformed) {
                cancelLongPressHandle();
                return;
            }
            if (numberInitialTouches === 1 &&
                gestureState.numberActiveTouches === 2) {
                numberInitialTouches = 2;
                initialTouches = event.nativeEvent.touches;
            }
            const isTapGesture = numberInitialTouches == 1 && gestureState.numberActiveTouches === 1;
            const isPinchGesture = numberInitialTouches === 2 && gestureState.numberActiveTouches === 2;
            if (isPinchGesture) {
                cancelLongPressHandle();
        
                const initialDistance = getDistanceBetweenTouches(initialTouches);
                const currentDistance = getDistanceBetweenTouches(event.nativeEvent.touches);

                let nextScale = (currentDistance / initialDistance) * currentScale;
                if (nextScale < initialScale) {
                nextScale = nextScale + (initialScale - nextScale) * OUT_BOUND_MULTIPLIER;
                }

                // new part – use the pinch focal point instead of fixed centre
                const touch1 = event.nativeEvent.touches[0];
                const touch2 = event.nativeEvent.touches[1];
                const focusX = (touch1.pageX + touch2.pageX) / 2;
                const focusY = (touch1.pageY + touch2.pageY) / 2;

                const dx = (SCREEN_WIDTH / 2 - focusX) * (nextScale / currentScale - 1);
                const dy = (SCREEN_HEIGHT / 2 - focusY) * (nextScale / currentScale - 1);

                const nextTranslateX = currentTranslate.x + dx;
                const nextTranslateY = currentTranslate.y + dy;

                translateValue.x.setValue(nextTranslateX);
                translateValue.y.setValue(nextTranslateY);
                tmpTranslate = { x: nextTranslateX, y: nextTranslateY };

                // keep the existing scale assignment
                scaleValue.setValue(nextScale);
                tmpScale = nextScale;
              }
            if (isTapGesture && currentScale > initialScale) {
                const { x, y } = currentTranslate;
                const { dx, dy } = gestureState;
                const [topBound, leftBound, bottomBound, rightBound] = getBounds(currentScale);
                let nextTranslateX = x + dx;
                let nextTranslateY = y + dy;
                if (nextTranslateX > leftBound) {
                    nextTranslateX =
                        nextTranslateX -
                            (nextTranslateX - leftBound) * OUT_BOUND_MULTIPLIER;
                }
                if (nextTranslateX < rightBound) {
                    nextTranslateX =
                        nextTranslateX -
                            (nextTranslateX - rightBound) * OUT_BOUND_MULTIPLIER;
                }
                if (nextTranslateY > topBound) {
                    nextTranslateY =
                        nextTranslateY - (nextTranslateY - topBound) * OUT_BOUND_MULTIPLIER;
                }
                if (nextTranslateY < bottomBound) {
                    nextTranslateY =
                        nextTranslateY -
                            (nextTranslateY - bottomBound) * OUT_BOUND_MULTIPLIER;
                }
                if (fitsScreenByWidth()) {
                    nextTranslateX = x;
                }
                if (fitsScreenByHeight()) {
                    nextTranslateY = y;
                }
                translateValue.x.setValue(nextTranslateX);
                translateValue.y.setValue(nextTranslateY);
                tmpTranslate = { x: nextTranslateX, y: nextTranslateY };
            }
        },
        onRelease: () => {
            cancelLongPressHandle();

             const wasDoubleTap = isDoubleTapPerformed;
            if (isDoubleTapPerformed) {
                isDoubleTapPerformed = false;
            }
            if (tmpScale > 0) {
                if (tmpScale < initialScale || tmpScale > SCALE_MAX) {
                    tmpScale = tmpScale < initialScale ? initialScale : SCALE_MAX;
                    Animated.timing(scaleValue, {
                        toValue: tmpScale,
                        duration: 100,
                        useNativeDriver: true,
                    }).start();
                }
                currentScale = tmpScale;
                tmpScale = 0;
            }
            if (tmpTranslate) {
                const { x, y } = tmpTranslate;
                const [topBound, leftBound, bottomBound, rightBound] = getBounds(currentScale);
                let nextTranslateX = x;
                let nextTranslateY = y;
                if (!fitsScreenByWidth()) {
                    if (nextTranslateX > leftBound) {
                        nextTranslateX = leftBound;
                    }
                    else if (nextTranslateX < rightBound) {
                        nextTranslateX = rightBound;
                    }
                }
                if (!fitsScreenByHeight()) {
                    if (nextTranslateY > topBound) {
                        nextTranslateY = topBound;
                    }
                    else if (nextTranslateY < bottomBound) {
                        nextTranslateY = bottomBound;
                    }
                }
                Animated.parallel([
                    Animated.timing(translateValue.x, {
                        toValue: nextTranslateX,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateValue.y, {
                        toValue: nextTranslateY,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                ]).start();
                currentTranslate = { x: nextTranslateX, y: nextTranslateY };
                tmpTranslate = null;
            }
            if (!wasDoubleTap &&  currentScale <= initialScale * (1 + CENTER_THRESHOLD)) {
                Animated.parallel([
                  Animated.timing(translateValue.x, {
                    toValue: initialTranslate.x,
                    duration: 100,
                    useNativeDriver: true,
                  }),
                  Animated.timing(translateValue.y, {
                    toValue: initialTranslate.y,
                    duration: 100,
                    useNativeDriver: true,
                  }),
                ]).start();
                currentTranslate = initialTranslate;
              }
        },
    };
    const panResponder = useMemo(() => createPanResponder(handlers), [handlers]);
    return [panResponder.panHandlers, scaleValue, translateValue];
};
export default usePanResponder;
