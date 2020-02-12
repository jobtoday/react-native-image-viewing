/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import get from "lodash/get";
import memoize from "lodash/memoize";

import ImageViewing from "../src/ImageViewing";
import ImageList from "./components/ImageList";
import ImageHeader from "./components/ImageHeader";
import ImageFooter from "./components/ImageFooter";

import { architecture } from "./data/architecture";
import { travel } from "./data/travel";
import { city } from "./data/city";
import { food } from "./data/food";

export default function App() {
  const [currentImageIndex, setImageIndex] = useState(0);
  const [images, setImages] = useState(architecture);
  const [isVisible, setIsVisible] = useState(false);

  const onSelect = (images, index) => {
    setImageIndex(index);
    setImages(images);
    setIsVisible(true);
  };

  const onRequestClose = () => setIsVisible(false);
  const getImageUrls = memoize(images =>
    images.map(image => ({ uri: image.original as string }))
  );

  return (
    <SafeAreaView style={styles.root}>
      <ImageList
        images={travel.map(image => image.thumbnail)}
        onPress={index => onSelect(travel, index)}
        shift={0.25}
      />
      <ImageList
        images={architecture.map(image => image.thumbnail)}
        onPress={index => onSelect(architecture, index)}
        shift={0.75}
      />
      <View style={styles.about}>
        <Text style={styles.name}>[ react-native-image-viewing ]</Text>
      </View>
      <ImageViewing
        wrapperStyle={{ top: 10 }}
        images={getImageUrls(images)}
        imageIndex={currentImageIndex}
        visible={isVisible}
        onRequestClose={onRequestClose}
        HeaderComponent={
          images === travel
            ? ({ imageIndex }) => {
                const title = get(images, `${imageIndex}.title`);
                return (
                  <ImageHeader title={title} onRequestClose={onRequestClose} />
                );
              }
            : undefined
        }
        FooterComponent={({ imageIndex }) => (
          <ImageFooter imageIndex={imageIndex} imagesCount={images.length} />
        )}
      />
      <ImageList
        images={food.map(image => image.thumbnail)}
        onPress={index => onSelect(food, index)}
        shift={0.5}
      />
      <ImageList
        images={city.map(image => image.thumbnail)}
        onPress={index => onSelect(city, index)}
        shift={0.75}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
    ...Platform.select({
      android: { paddingTop: StatusBar.currentHeight },
      default: null
    })
  },
  about: {
    flex: 1,
    marginTop: -12,
    alignItems: "center",
    justifyContent: "center"
  },
  name: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "200",
    color: "#FFFFFFEE"
  }
});
