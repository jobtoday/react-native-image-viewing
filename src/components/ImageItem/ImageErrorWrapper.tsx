import React from "react";

import { Dimensions, StyleSheet, View } from "react-native";

const SCREEN = Dimensions.get("screen");
const SCREEN_WIDTH = SCREEN.width;
const SCREEN_HEIGHT = SCREEN.height;

type Props = {
  ErrorComponent: React.ComponentType | undefined
}

export const ImageErrorWrapper: React.FunctionComponent<Props> = ({ ErrorComponent }) => (
  <View style={styles.container}>
    {ErrorComponent && React.createElement(ErrorComponent)}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});