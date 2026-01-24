import { useRef, useCallback } from "react";
const useDoubleTapToZoom = (scrollViewRef, scaled, screen) => {
    const lastTapRef = useRef(0);
    const handleDoubleTap = useCallback(() => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;
        if (lastTapRef.current && now - lastTapRef.current < DOUBLE_TAP_DELAY) {
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
                // Logic to toggle zoom state
                if (scaled) {
                    scrollViewRef.current.setNativeProps({ zoomScale: 1 });
                }
                else {
                    scrollViewRef.current.setNativeProps({ zoomScale: 2 });
                }
            }
        }
        lastTapRef.current = now;
    }, [scrollViewRef, scaled]);
    return handleDoubleTap;
};
export default useDoubleTapToZoom;
