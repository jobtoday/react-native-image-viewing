/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from "react";
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
  if (!visible) {
    return null;
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (typeof onRequestClose === "function") {
          onRequestClose();
        }

        return true;
      }
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  const statusBarHidden = presentationStyle === "overFullScreen";
  const statusBarStateStyle =
    presentationStyle === "overFullScreen"
      ? styles.overFullscreen
      : styles.defaultStyle;

  return (
    <>
      {statusBarHidden && <StatusBar hidden />}
      <View style={[styles.root, statusBarStateStyle]}>{children}</View>
    </>
  );
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
