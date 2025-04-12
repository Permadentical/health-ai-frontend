// src/components/ChatMessage.tsx
import { ThemeColors } from "@/constants/Colors";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

type ChatMessageProps = {
  text: string;
  isUser: boolean;
  theme: ThemeColors;
};

export const ChatMessage = ({ text, isUser, theme }: ChatMessageProps) => {

  const styles = getStyles(theme)
  return (
    <View style={[styles.messageContainer, isUser ? styles.messageRight : styles.messageLeft]}>
      <Text style={styles.messageText}>{text}</Text>
    </View>
  );
};

const getStyles = (theme: ThemeColors) => StyleSheet.create({
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "75%",
  },
  messageLeft: {
    alignSelf: "flex-start",
    backgroundColor: theme.chatBoxAlernate,
  },
  messageRight: {
    alignSelf: "flex-end",
    backgroundColor: theme.chatBox,
  },
  messageText: {
    fontSize: 16,
    color: theme.text,
  },
});
