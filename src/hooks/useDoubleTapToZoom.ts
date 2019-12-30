/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { Animated } from "react-native";

const DOUBLE_TAP_DELAY = 300;
let lastTapTS: number | null = null;

/**
 * This is iOS only.
 * Same functionality for Android implemented inside useZoomPanResponder hook.
 */
function useDoubleTapToZoom(
  initialScale: number,
  targetScale: number,
  ref: any,
  onZoom: (isScaled: boolean) => void
) {
  const [scale, setScale] = useState(initialScale);
  const scaleValue = new Animated.Value(initialScale);

  useEffect(() => {
    scaleValue.addListener(({ value }) => {
      ref?.current?.setNativeProps({ zoomScale: value });
    });

    return () => {
      scaleValue.removeAllListeners();
    };
  });

  const handleDoubleTap = () => {
    const nowTS = new Date().getTime();

    if (lastTapTS && nowTS - lastTapTS < DOUBLE_TAP_DELAY) {
      lastTapTS = null;
      const nextScale =
        !scale || scale === initialScale ? targetScale : initialScale;

      const isScaled = nextScale !== initialScale;

      onZoom(isScaled);

      Animated.timing(scaleValue, {
        toValue: nextScale,
        duration: 300
      }).start(() => setScale(nextScale));
    } else {
      lastTapTS = nowTS;
    }
  };

  return [scale, handleDoubleTap] as const;
}

export default useDoubleTapToZoom;
