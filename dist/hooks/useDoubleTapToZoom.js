/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useCallback } from 'react';
let lastTapTS = null;
let singleTapTimeout = null;
/**
 * This is iOS only.
 * Same functionality for Android implemented inside usePanResponder hook.
 */
function useDoubleTapToZoom({ scrollViewRef, scaled, screen, onPress, doubleTapToZoomEnabled, doubleTapDelay, }) {
    return useCallback((event) => {
        var _a;
        if (singleTapTimeout) {
            clearTimeout(singleTapTimeout);
        }
        const nowTS = new Date().getTime();
        const scrollResponderRef = (_a = scrollViewRef === null || scrollViewRef === void 0 ? void 0 : scrollViewRef.current) === null || _a === void 0 ? void 0 : _a.getScrollResponder();
        if (doubleTapToZoomEnabled &&
            lastTapTS &&
            nowTS - lastTapTS < doubleTapDelay) {
            const { pageX, pageY } = event.nativeEvent;
            let targetX = 0;
            let targetY = 0;
            let targetWidth = screen.width;
            let targetHeight = screen.height;
            // Zooming in
            // TODO: Add more precise calculation of targetX, targetY based on touch
            if (!scaled) {
                targetX = pageX / 2;
                targetY = pageY / 2;
                targetWidth = screen.width / 2;
                targetHeight = screen.height / 2;
            }
            scrollResponderRef === null || scrollResponderRef === void 0 ? void 0 : scrollResponderRef.scrollResponderZoomTo({
                x: targetX,
                y: targetY,
                width: targetWidth,
                height: targetHeight,
                animated: true,
            });
        }
        else {
            lastTapTS = nowTS;
            singleTapTimeout = setTimeout(onPress, doubleTapDelay);
        }
    }, [scaled, doubleTapToZoomEnabled, doubleTapDelay, onPress]);
}
export default useDoubleTapToZoom;
