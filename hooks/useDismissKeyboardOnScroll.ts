import { Keyboard, PanResponder, Dimensions } from "react-native";
import { useMemo } from "react";
import { useKeyboard } from "@react-native-community/hooks";

const screenHeight = Dimensions.get("window").height;

export const useDismissKeyboardOnScroll = () => {
    const { keyboardHeight } = useKeyboard();
    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onPanResponderMove: (evt) => {
                    const touchY = evt.nativeEvent.pageY;
                    const keyboardTop = screenHeight - keyboardHeight;

                    if (touchY > keyboardTop) Keyboard.dismiss();
                },
            }),
        [keyboardHeight]
    );

    return panResponder.panHandlers;
};
