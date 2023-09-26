/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { Image, ImageURISource } from "react-native";

import { createCache } from "../utils";
import { Dimensions, ImageSource } from "../@types";

const CACHE_SIZE = 50;
const imageDimensionsCache = createCache(CACHE_SIZE);

const useImageDimensions = (image: ImageSource): Dimensions | null => {
  const [dimensions, setDimensions] = useState<Dimensions | null>(() => {
    if ('uri' in image && image.uri && 'height' in image) {
      const cacheKey = image.uri;

      let imageDimensions = imageDimensionsCache.get(cacheKey);

      if (imageDimensions) {
        return imageDimensions;
      } else {
        imageDimensions = { width: image.width, height: image.height };
        imageDimensionsCache.set(cacheKey, imageDimensions);
        return imageDimensions;
      }
    }

    return null;
  });

  const getImageDimensions = (image: ImageSource): Promise<Dimensions> => {
    return new Promise((resolve) => {
      if ('uri' in image && image.uri && 'height' in image) {
        const cacheKey = image.uri;

        let imageDimensions = imageDimensionsCache.get(cacheKey);

        if (!imageDimensions) {
          imageDimensions = { width: image.width, height: image.height };
          imageDimensionsCache.set(cacheKey, imageDimensions);
        }

        resolve(imageDimensions);

        return;
      }
      if (typeof image == "number") {
        const cacheKey = `${image}`;
        let imageDimensions = imageDimensionsCache.get(cacheKey);

        if (!imageDimensions) {
          const { width, height } = Image.resolveAssetSource(image);
          imageDimensions = { width, height };
          imageDimensionsCache.set(cacheKey, imageDimensions);
        }

        resolve(imageDimensions);

        return;
      }

      // @ts-ignore
      if (image.uri) {
        const source = image as ImageURISource;

        const cacheKey = source.uri as string;

        const imageDimensions = imageDimensionsCache.get(cacheKey);

        if (imageDimensions) {
          resolve(imageDimensions);
        } else {
          // @ts-ignore
          Image.getSizeWithHeaders(
            source.uri,
            source.headers,
            (width: number, height: number) => {
              imageDimensionsCache.set(cacheKey, { width, height });
              resolve({ width, height });
            },
            () => {
              resolve({ width: 0, height: 0 });
            }
          );
        }
      } else {
        resolve({ width: 0, height: 0 });
      }
    });
  };

  let isImageUnmounted = false;

  useEffect(() => {
    if(isImageUnmounted && !dimensions) return;

    getImageDimensions(image).then((dimensions) => {
      if (!isImageUnmounted) {
        setDimensions(dimensions);
      }
    });

    return () => {
      isImageUnmounted = true;
    };
  }, [image, isImageUnmounted, dimensions]);

  return dimensions;
};

export default useImageDimensions;
