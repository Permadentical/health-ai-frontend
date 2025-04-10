// src/hooks/useRecordingControls.ts
import { useState, useRef } from "react";
import { Animated } from "react-native";

export function useRecordingControls() {
  const [isRecording, setIsRecording] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const startRecording = async () => {
    setIsRecording(true);
    setShowAnimation(true);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setShowAnimation(false);
  };

  const handlePressIn = async () => {
    setIsLongPress(true);
    Animated.timing(fadeAnim, {
      toValue: 0.9,
      duration: 300,
      useNativeDriver: true,
    }).start();
    await startRecording();
  };

  const handlePressOut = () => {
    setIsLongPress(false);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    stopRecording();
  };

  return { isRecording, showAnimation, isLongPress, fadeAnim, handlePressIn, handlePressOut };
}
