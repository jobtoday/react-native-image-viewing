/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { Image } from "react-native";

import { createCache } from "../utils";
import { Dimensions, ImageSource } from "../@types";

const CACHE_SIZE = 50;
const imageDimensionsCache = createCache(CACHE_SIZE);

const useImageDimensions = (image: ImageSource): Dimensions | null => {
  const [dimensions, setDimensions] = useState<Dimensions | null>(null);

  const getImageDimensions = (image: ImageSource): Promise<Dimensions> => {
    return new Promise((resolve) => {
      const imageDimensions = imageDimensionsCache.get(image.uri);

      if (imageDimensions) {
        resolve(imageDimensions);
      } else {
        // @ts-ignore
        Image.getSizeWithHeaders(
          image.uri,
          image.headers,
          // @ts-ignore
          (width, height) => {
            imageDimensionsCache.set(image.uri, { width, height });
            resolve({ width, height });
          },
          // @ts-ignore
          (error) => {
            resolve({ width: 0, height: 0 });
          }
        );
      }
    });
  };

  let isImageUnmounted = false;

  useEffect(() => {
    getImageDimensions(image).then((dimensions) => {
      if (!isImageUnmounted) {
        setDimensions(dimensions);
      }
    });

    return () => {
      isImageUnmounted = true;
    };
  }, [image]);

  return dimensions;
};

export default useImageDimensions;
