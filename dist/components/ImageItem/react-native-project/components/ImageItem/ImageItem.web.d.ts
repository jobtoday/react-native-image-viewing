import React from "react";
import { ImageSource } from "../../@types";
declare type Props = {
    imageSrc: ImageSource;
    onRequestClose: () => void;
    onZoom: (scaled: boolean) => void;
    onLongPress: (image: ImageSource) => void;
    delayLongPress: number;
    swipeToCloseEnabled?: boolean;
    doubleTapToZoomEnabled?: boolean;
};
declare const _default: React.MemoExoticComponent<({ imageSrc, onZoom, onRequestClose, onLongPress, delayLongPress, swipeToCloseEnabled, doubleTapToZoomEnabled, }: Props) => JSX.Element>;
export default _default;
