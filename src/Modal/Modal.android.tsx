/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";

type Props = {
  visible: boolean;
  transparent: boolean;
  children: JSX.Element;
};

const Modal = ({ visible, children }: Props) => {
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
