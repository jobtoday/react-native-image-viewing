/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useCallback } from "react";
import { BackHandler } from "react-native";

const useBackHandler = (visible?: boolean, onRequestClose?: () => void) => {
  const backHandler = useCallback(() => {
    if (typeof onRequestClose === "function") {
      onRequestClose();
      return true;
    }

    return false;
  }, []);

  useEffect(
    () => () => {
      BackHandler.removeEventListener("hardwareBackPress", backHandler);
    },
    []
  );

  useEffect(() => {
    if (visible) {
      BackHandler.addEventListener("hardwareBackPress", backHandler);
    } else {
      BackHandler.removeEventListener("hardwareBackPress", backHandler);
    }
  }, [visible]);
};

export default useBackHandler;
