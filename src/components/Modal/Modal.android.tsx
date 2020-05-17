/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useCallback } from "react";
import {
  BackHandler,
  View,
  StyleSheet,
  StatusBar,
  ModalProps,
} from "react-native";

type Props = ModalProps & {
  children: JSX.Element;
};

const Modal = ({
  visible,
  children,
  presentationStyle,
  onRequestClose,
}: Props) => {
  const statusBarHidden = presentationStyle === "overFullScreen";
  const statusBarStateStyle =
    presentationStyle === "overFullScreen"
      ? styles.overFullscreen
      : styles.defaultStyle;

  useBackHandler(visible, onRequestClose);

  if (!visible) {
    return null;
  }

  return (
    <>
      {statusBarHidden && <StatusBar hidden />}
      <View style={[styles.root, statusBarStateStyle]}>{children}</View>
    </>
  );
};

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
      console.warn("unmount");
      BackHandler.removeEventListener("hardwareBackPress", backHandler);
    },
    []
  );

  useEffect(() => {
    if (visible) {
      console.warn("add");
      BackHandler.addEventListener("hardwareBackPress", backHandler);
    } else {
      console.warn("remove");
      BackHandler.removeEventListener("hardwareBackPress", backHandler);
    }
  }, [visible]);
};

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    backgroundColor: "transparent",
  },
  overFullscreen: {
    top: 0,
  },
  defaultStyle: {
    top: StatusBar.currentHeight,
  },
});

export default Modal;
