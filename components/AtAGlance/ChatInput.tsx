// src/components/ChatInput.tsx
import React from "react";
import { TextInput, TouchableOpacity, View, StyleSheet, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AnimatedMicrophone } from "../AnimatedMicrophone";

type ChatInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onInputFocus: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  showAnimation: boolean;
};

export const ChatInput = ({
  value,
  onChangeText,
  onSend,
  onInputFocus,
  onPressIn,
  onPressOut,
  showAnimation,
}: ChatInputProps) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="talk or chat..."
        placeholderTextColor="black"
        style={styles.chatInput}
        onSubmitEditing={onSend}
        returnKeyType={"done"}
        multiline={false}
        onFocus={onInputFocus}
      />
      <TouchableOpacity
        onPress={() => value.trim() && onSend()}
        onPressIn={value.trim() ? onSend : onPressIn}
        onPressOut={onPressOut}
        style={[styles.iconButton, value.trim() ? styles.sendButton : styles.micButton]}
      >
        {showAnimation ? (
          <AnimatedMicrophone />
        ) : value.trim() ? (
          <Feather name="send" size={20} color="#fff" />
        ) : (
          <Feather name="mic" size={20} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "white",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chatInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  micButton: {
    backgroundColor: "#6A96FF",
  },
  sendButton: {
    backgroundColor: "#35C759",
  },
});
