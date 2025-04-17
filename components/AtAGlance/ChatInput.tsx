import React from "react";
import { TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AnimatedMicrophone } from "../AnimatedMicrophone";
import { ThemeColors } from "@/constants/Colors";

type ChatInputProps = {
    value: string;
    theme: ThemeColors;
    onChangeText: (text: string) => void;
    onSend: () => void;
    onInputFocus: () => void;
    startRecording: () => void;
    stopRecording: () => void;
};

export const ChatInput = ({
    value,
    theme,
    onChangeText,
    onSend,
    onInputFocus,
    startRecording,
    stopRecording,
}: ChatInputProps) => {
    const styles = getStyles(theme);

    return (
        <View style={styles.inputContainer}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder="talk or chat..."
                placeholderTextColor={theme.text}
                style={styles.chatInput}
                onSubmitEditing={onSend}
                returnKeyType={"done"}
                multiline={false}
                onFocus={onInputFocus}
            />

            <View style={[styles.iconButton, value.trim() ? styles.sendButton : styles.micButton]}>
                {value.trim() ? (
                    <TouchableOpacity onPress={onSend}>
                        <Feather name="send" size={20} color={theme.background} style={{ right: 1, top: 1 }} />
                    </TouchableOpacity>
                ) : (
                    <AnimatedMicrophone
                        size={20}
                        style={{ width: 36, height: 36, justifyContent: 'center', alignItems: 'center' }}
                        onStart={() => {
                            startRecording();
                            onInputFocus(); 
                        }}
                        onStop={stopRecording}
                        theme={theme}
                    />


                )}
            </View>
        </View>
    );
};

const getStyles = (theme: ThemeColors) => StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: theme.card,
        borderRadius: 24,
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
        color: theme.text,
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
        backgroundColor: theme.button,
    },
    sendButton: {
        backgroundColor: theme.button,
    },
});
