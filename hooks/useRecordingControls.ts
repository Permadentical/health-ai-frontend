// src/hooks/useRecordingControls.ts
import { useState, useRef } from "react";
import { Animated } from "react-native";

export function useRecordingControls() {
  const [isRecording, setIsRecording] = useState(false);
  const [isLongPress, setIsLongPress] = useState(false);

  const startRecording = async () => {
    setIsRecording(true);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return { startRecording, stopRecording };
}
