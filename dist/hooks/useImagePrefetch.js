/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useEffect } from "react";
import { Image } from "react-native";
const useImagePrefetch = (images) => {
    useEffect(() => {
        images.forEach((image) => {
            //@ts-ignore
            if (image.uri) {
                //@ts-ignore
                return Image.prefetch(image.uri);
            }
        });
    }, []);
};
export default useImagePrefetch;
