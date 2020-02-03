/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from "react";
import { BackHandler, View, StyleSheet, StatusBar } from "react-native";

type Props = {
  visible: boolean;
  transparent: boolean;
  children: JSX.Element;
  onRequestClose: () => void;
};

const Modal = ({ visible, children, onRequestClose }: Props) => {
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

  return <>{visible && <View style={styles.root}>{children}</View>}</>;
};

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    backgroundColor: "transparent",
    top: StatusBar.currentHeight
  }
});

export default Modal;
