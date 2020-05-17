import { useEffect, useCallback } from "react";
import { BackHandler } from "react-native";

const useBackHandler = (visible?: boolean, onRequestClose?: () => void) => {
  const backHandler = useCallback(() => {
    if (typeof onRequestClose === "function") {
      onRequestClose();
      return true;
    }

    return false;
  }, []);

  useEffect(
    () => () => {
      BackHandler.removeEventListener("hardwareBackPress", backHandler);
    },
    []
  );

  useEffect(() => {
    if (visible) {
      BackHandler.addEventListener("hardwareBackPress", backHandler);
    } else {
      BackHandler.removeEventListener("hardwareBackPress", backHandler);
    }
  }, [visible]);
};

export default useBackHandler;
