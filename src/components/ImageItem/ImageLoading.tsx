/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from "react";

import { ActivityIndicator, StyleSheet, View, ViewProps } from "react-native";

const ImageLoading: React.FC<ViewProps> = ({style}) => (
  <View style={[style, styles.loading]}>
    <ActivityIndicator size="small" color="#FFF" />
  </View>
);

const styles = StyleSheet.create({
  loading: {
    alignItems: "center",
    justifyContent: "center"
  },
});

export default React.memo(ImageLoading);
