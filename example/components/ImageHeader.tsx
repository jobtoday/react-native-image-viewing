/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity
} from "react-native";

type Props = {
  title?: string;
  onRequestClose: () => void;
};

const HIT_SLOP = { top: 16, left: 16, bottom: 16, right: 16 };

const ImageHeader = ({ title, onRequestClose }: Props) => (
  <SafeAreaView style={styles.root}>
    <View style={styles.container}>
      <View style={styles.space} />
      {title && <Text style={styles.text}>{title}</Text>}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onRequestClose}
        hitSlop={HIT_SLOP}
      >
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#00000077"
  },
  container: {
    flex: 1,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  space: {
    width: 45,
    height: 45
  },
  closeButton: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center"
  },
  closeText: {
    lineHeight: 25,
    fontSize: 25,
    paddingTop: 2,
    includeFontPadding: false,
    color: "#FFF"
  },
  text: {
    maxWidth: 240,
    marginTop: 12,
    flex: 1,
    flexWrap: "wrap",
    textAlign: "center",
    fontSize: 17,
    lineHeight: 17,
    color: "#FFF"
  }
});

export default ImageHeader;
