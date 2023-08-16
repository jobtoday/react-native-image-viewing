/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useRef } from "react";
import { Animated } from "react-native";

const INITIAL_POSITION = { x: 0, y: 0 };
const ANIMATION_CONFIG = {
  duration: 200,
  useNativeDriver: true,
};

const useAnimatedComponents = () => {
  const headerTranslate = useRef(new Animated.ValueXY(INITIAL_POSITION));
  const footerTranslate = useRef(new Animated.ValueXY(INITIAL_POSITION));

  const isVisible = useRef(true);

  const setIsVisible = (shouldMakeVisible: boolean) => {
    if (shouldMakeVisible) {
      Animated.parallel([
        Animated.timing(headerTranslate.current.y, {
          ...ANIMATION_CONFIG,
          toValue: 0,
        }),
        Animated.timing(footerTranslate.current.y, {
          ...ANIMATION_CONFIG,
          toValue: 0,
        }),
      ]).start(() => (isVisible.current = true));
    } else {
      Animated.parallel([
        Animated.timing(headerTranslate.current.y, {
          ...ANIMATION_CONFIG,
          toValue: -300,
        }),
        Animated.timing(footerTranslate.current.y, {
          ...ANIMATION_CONFIG,
          toValue: 300,
        }),
      ]).start(() => (isVisible.current = false));
    }
  };

  const toggleIsVisible = () => {
    setIsVisible(!isVisible.current);
  };

  const headerTransform = headerTranslate.current.getTranslateTransform();
  const footerTransform = footerTranslate.current.getTranslateTransform();

  return [
    headerTransform,
    footerTransform,
    setIsVisible,
    toggleIsVisible,
  ] as const;
};

export default useAnimatedComponents;
