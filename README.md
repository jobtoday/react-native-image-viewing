# react-native-image-viewing

> React Native modal component for viewing images as a sliding gallery.

[![npm version](https://badge.fury.io/js/react-native-image-viewing.svg)](https://badge.fury.io/js/react-native-image-viewing)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

- 🔥Pinch zoom for both iOS and Android
- 🔥Double tap to zoom for both iOS and Android
- 🔥Supports swipe-to-close animation
- 🔥Custom header and footer components
- 🔥Uses VirtualizedList to optimize image loading and rendering

Try with Expo: https://expo.io/@antonkalinin/react-native-image-viewing

<p align="center">
  <img src="https://github.com/jobtoday/react-native-image-viewing/blob/master/demo.gif?raw=true" height="480" />
</p>

## Installation

```bash
yarn add react-native-image-viewing
```

or

```bash
npm install --save react-native-image-viewing
```

## Usage

```jsx
import ImageView from "react-native-image-viewing";

const images = [
  {
    uri: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4",
  },
  {
    uri: "https://images.unsplash.com/photo-1573273787173-0eb81a833b34",
  },
  {
    uri: "https://images.unsplash.com/photo-1569569970363-df7b6160d111",
  },
];

const [visible, setIsVisible] = useState(false);

<ImageView
  images={images}
  imageIndex={0}
  visible={visible}
  onRequestClose={() => setIsVisible(false)}
/>
```

#### [See Example](https://github.com/jobtoday/react-native-image-viewing/blob/master/example/App.tsx#L62-L80)

## Props

| Prop name                | Description                                                                                         | Type                                                        | Required |
| ------------------------ | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | -------- |
| `images`                 | Array of images to display                                                                          | ImageSource[]                                               | true     |
| `keyExtractor`           | Uniqely identifying each image    | (imageSrc: ImageSource, index: number) => string | false |
| `imageIndex`             | Current index of image to display                                                                   | number                                                      | true     |
| `visible`                | Is modal shown or not                                                                               | boolean                                                     | true     |
| `onRequestClose`         | Function called to close the modal                                                                  | function                                                    | true     |
| `onImageIndexChange`     | Function called when image index has been changed                                                   | function                                                    | false    |
| `onLongPress`            | Function called when image long pressed                                                             | function (event: GestureResponderEvent, image: ImageSource) | false    |
| `delayLongPress`         | Delay in ms, before onLongPress is called: default `800`                                            | number                                                      | false    |
| `animationType`          | Animation modal presented with: default `fade`                                                      | `none`, `fade`, `slide`                                     | false    |
| `presentationStyle`      | Modal presentation style: default: `fullScreen` **Android:** Use `overFullScreen` to hide StatusBar | `fullScreen`, `pageSheet`, `formSheet`, `overFullScreen`    | false    |
| `backgroundColor`        | Background color of the modal in HEX (#000000EE)                                                    | string                                                      | false    |
| `swipeToCloseEnabled`    | Close modal with swipe up or down: default `true`                                                   | boolean                                                     | false    |
| `doubleTapToZoomEnabled` | Zoom image by double tap on it: default `true`                                                      | boolean                                                     | false    |
| `HeaderComponent`        | Header component, gets current `imageIndex` as a prop                                               | component, function                                         | false    |
| `FooterComponent`        | Footer component, gets current `imageIndex` as a prop                                               | component, function                                         | false    |

- type ImageSource = ImageURISource | ImageRequireSource

## Contributing

To start contributing clone this repo and then run inside `react-native-image-viewing` folder:

```bash
yarn
```

Then go inside `example` folder and run:

```bash
yarn & yarn start
```

This will start packager for expo so you can change `/src/ImageViewing` and see changes in expo example app.

## License

[MIT](LICENSE)
