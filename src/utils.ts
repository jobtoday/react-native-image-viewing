/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Animated } from "react-native";
import { Dimensions, Position } from "./@types";

type CacheStorageItem = { key: string; value: any };

export const createCache = (cacheSize: number) => ({
  _storage: [] as CacheStorageItem[],
  get(key: string): any {
    const { value } =
      this._storage.find(({ key: storageKey }) => storageKey === key) || {};

    return value;
  },
  set(key: string, value: any) {
    if (this._storage.length >= cacheSize) {
      this._storage.shift();
    }

    this._storage.push({ key, value });
  }
});

export const splitArrayIntoBatches = (arr: any[], batchSize: number): any[] =>
  arr.reduce((result, item) => {
    const batch = result.pop() || [];

    if (batch.length < batchSize) {
      batch.push(item);
      result.push(batch);
    } else {
      result.push(batch, [item]);
    }

    return result;
  }, []);

export const styleFromImageDimensions = (
  image: Dimensions | null,
  screen: Dimensions
) => {
  if (!image?.width || !image?.height) {
    return [{ width: 0, height: 0 }, 1] as const;
  }

  const wScale = screen.width / image.width;
  const hScale = screen.height / image.height;
  const scale = Math.min(wScale, hScale);
  const scaleAnimatedValue = new Animated.Value(scale);
  const { x, y } = getImageTranslate(image, screen);
  const translateValue = new Animated.ValueXY({ x, y });
  const transform = translateValue.getTranslateTransform();

  transform.push({ scale: scaleAnimatedValue });

  return [
    {
      width: image.width,
      height: image.height,
      transform
    },
    scale
  ] as const;
};

const getImageTranslate = (image: Dimensions, screen: Dimensions): Position => {
  const getTranslateForAxis = (axis: "x" | "y"): number => {
    const imageSize = axis === "x" ? image.width : image.height;
    const screenSize = axis === "x" ? screen.width : screen.height;

    if (image.width >= image.height) {
      return (screenSize - imageSize) / 2;
    }

    return screenSize / 2 - imageSize / 2;
  };

  return {
    x: getTranslateForAxis("x"),
    y: getTranslateForAxis("y")
  };
};
