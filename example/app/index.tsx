import { useState } from "react";
import {
  Alert,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { architecture } from "../data/architecture";
import { ImageSource } from "../../src/@types";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageList from "@/components/ImageList";
import { travel } from "@/data/travel";
import ImageViewing from "../../src/ImageViewing";
import ImageHeader from "@/components/ImageHeader";
import ImageFooter from "@/components/ImageFooter";
import { food } from "@/data/food";
import { city } from "@/data/city";
import get from "lodash/get";
import memoize from "lodash/memoize";

export default function Index() {
  const [currentImageIndex, setImageIndex] = useState(0);
  const [images, setImages] = useState(architecture);
  const [isVisible, setIsVisible] = useState(false);

  const onSelect = (images, index) => {
    setImageIndex(index);
    setImages(images);
    setIsVisible(true);
  };

  const onRequestClose = () => setIsVisible(false);
  const getImageSource = memoize((images): ImageSource[] =>
    images.map((image) =>
      typeof image.original === "number"
        ? image.original
        : { uri: image.original as string }
    )
  );
  const onLongPress = (image) => {
    Alert.alert("Long Pressed", image.uri);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ImageList
        images={travel.map((image) => image.thumbnail)}
        onPress={(index) => onSelect(travel, index)}
        shift={0.25}
      />
      <ImageList
        images={architecture.map((image) => image.thumbnail)}
        onPress={(index) => onSelect(architecture, index)}
        shift={0.75}
      />
      <View style={styles.about}>
        <Text style={styles.name}>[ react-native-image-viewing ]</Text>
      </View>
      <ImageViewing
        images={getImageSource(images)}
        imageIndex={currentImageIndex}
        presentationStyle="overFullScreen"
        visible={isVisible}
        onRequestClose={onRequestClose}
        onLongPress={onLongPress}
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
        images={food.map((image) => image.thumbnail)}
        onPress={(index) => onSelect(food, index)}
        shift={0.5}
      />
      <ImageList
        images={city.map((image) => image.thumbnail)}
        onPress={(index) => onSelect(city, index)}
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
      default: null,
    }),
  },
  about: {
    flex: 1,
    marginTop: -12,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "200",
    color: "#FFFFFFEE",
  },
});
