/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Animated } from "react-native";

const INITIAL_POSITION = { x: 0, y: 0 };
const ANIMATION_CONFIG = {
  duration: 200,
  useNativeDriver: true,
};

const useAnimatedComponents = () => {
  const headerTranslate = new Animated.ValueXY(INITIAL_POSITION);
  const footerTranslate = new Animated.ValueXY(INITIAL_POSITION);

  const toggleVisible = (
    isVisible: boolean,
    hideHeaderOnZoom: boolean,
    hideFooterOnZoom: boolean
  ) => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(headerTranslate.y, { ...ANIMATION_CONFIG, toValue: 0 }),
        Animated.timing(footerTranslate.y, { ...ANIMATION_CONFIG, toValue: 0 }),
      ]).start();
    } else {
      const hideHeaderAnimation = hideHeaderOnZoom
        ? [Animated.timing(headerTranslate.y, {
            ...ANIMATION_CONFIG,
            toValue: -300,
          })]
        : [];
      const hideFooterAnimation = hideFooterOnZoom
        ? [Animated.timing(footerTranslate.y, {
            ...ANIMATION_CONFIG,
            toValue: 300,
          })]
        : [];
      Animated.parallel([...hideHeaderAnimation, ...hideFooterAnimation]).start();
    }
  };

  const headerTransform = headerTranslate.getTranslateTransform();
  const footerTransform = footerTranslate.getTranslateTransform();

  return [headerTransform, footerTransform, toggleVisible] as const;
};

export default useAnimatedComponents;
