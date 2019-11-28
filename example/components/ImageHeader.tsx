/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

type Props = {
  title?: string;
  onRequestClose: () => void;
};

const HIT_SLOP = { top: 16, left: 16, bottom: 16, right: 16 };

const ImageHeader = ({ title, onRequestClose }: Props) => (
  <SafeAreaView style={styles.root}>
    <View style={styles.space} />
    {title && <Text style={styles.text}>{title}</Text>}
    <TouchableOpacity
      style={styles.closeButton}
      onPress={onRequestClose}
      hitSlop={HIT_SLOP}
    >
      <Text style={styles.closeText}>✕</Text>
    </TouchableOpacity>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  root: {
    height: 120,
    width: "100%",
    backgroundColor: "#00000077",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  space: {
    width: 40,
    height: 40
  },
  closeButton: {
    marginRight: 20
  },
  closeText: {
    fontSize: 27,
    color: "#FFF"
  },
  text: {
    flex: 1,
    flexWrap: "wrap",
    maxWidth: 240,
    textAlign: "center",
    fontSize: 17,
    color: "#FFF"
  }
});

export default ImageHeader;
