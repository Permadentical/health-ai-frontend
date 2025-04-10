// src/components/ChatMessage.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

type ChatMessageProps = {
  text: string;
  isUser: boolean;
};

export const ChatMessage = ({ text, isUser }: ChatMessageProps) => {
  return (
    <View style={[styles.messageContainer, isUser ? styles.messageRight : styles.messageLeft]}>
      <Text style={styles.messageText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "75%",
  },
  messageLeft: {
    alignSelf: "flex-start",
    backgroundColor: "#ECECEC",
  },
  messageRight: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  messageText: {
    fontSize: 16,
  },
});
