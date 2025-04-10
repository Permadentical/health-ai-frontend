import { Measurements } from "@/constants/Measurements";
import React, { useEffect, useRef, useState } from "react";
import {
    View,
    KeyboardAvoidingView,
    TextInput,
    StyleSheet,
    Text,
    Platform,
    TouchableWithoutFeedback,
    Button,
    Keyboard,
    Animated,
    TouchableOpacity,
    FlatList,
} from "react-native";
import { FadeIn, FadeOut } from "react-native-reanimated";

import { Feather } from "@expo/vector-icons";
import { useDismissKeyboardOnScroll } from "@/hooks/useDismissKeyboardOnScroll";
import { AnimatedMicrophone } from "@/components/AnimatedMicrophone";
import { AtAGlance } from "@/components/AtAGlance";

export default function ChatScreen() {
    const tabBarHeight = Measurements.tabBar.TAB_HEIGHT;

    const [messages, setMessages] = useState([
        { id: "1", text: "Hello, how can I help you today?", sender: "ai" },
        { id: "2", text: "Hi there!", sender: "user" },
        { id: "3", text: "Hello, how can I help you today?", sender: "ai" },
        { id: "4", text: "Hi there!", sender: "user" },
        { id: "5", text: "Hello, how can I help you today?", sender: "ai" },
        { id: "6", text: "Hi there!", sender: "user" },
        { id: "7", text: "Hello, how can I help you today?", sender: "ai" },
        { id: "8", text: "Hi there!", sender: "user" },
        { id: "9", text: "Hello, how can I help you today?", sender: "ai" },
        { id: "10", text: "Hi there!", sender: "user" },
        { id: "11", text: "Hello, how can I help you today?", sender: "ai" },
        { id: "12", text: "Hi there!", sender: "user" },
    ]);
    const [inputText, setInputText] = useState("");
    const [isInputActive, setIsInputActive] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [isLongPress, setIsLongPress] = useState(false);
    const [showChatHistory, setIsShowHistory] = useState<boolean>(false);

    // Animated values for the chat bar and the floating icons
    const chatBarOpacity = useRef(new Animated.Value(0)).current;
    const iconsOpacity = useRef(new Animated.Value(1)).current;
    const contentTranslateY = useRef(new Animated.Value(0)).current;
    const inputRef = useRef<TextInput>(null);
    const flatListRef = useRef<FlatList>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Hooks
    const keyboardDismissHandlers = useDismissKeyboardOnScroll();

    useEffect(() => {
        // Force a recalculation on the first render
        setTimeout(() => {
            setIsInputActive(false);
        }, 100);
    }, []);

    // Listen for keyboard events
    useEffect(() => {
        const keyboardWillShowListener =
            Platform.OS === "ios"
                ? Keyboard.addListener("keyboardWillShow", handleKeyboardShow)
                : Keyboard.addListener("keyboardDidShow", handleKeyboardShow);

        const keyboardWillHideListener =
            Platform.OS === "ios"
                ? Keyboard.addListener("keyboardWillHide", handleKeyboardHide)
                : Keyboard.addListener("keyboardDidHide", handleKeyboardHide);

        return () => {
            keyboardWillShowListener.remove();
            keyboardWillHideListener.remove();
        };
    }, []);

    const handleKeyboardShow = (event: any) => {
        setIsInputActive(true);

        // Animate content up when keyboard shows
        Animated.timing(contentTranslateY, {
            toValue: tabBarHeight - 20,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleKeyboardHide = () => {
        // Animate content back down when keyboard hides
        setIsInputActive(false);

        // When the keyboard hides, fade out the chat bar and fade in the icons.
        Animated.parallel([
            Animated.timing(chatBarOpacity, {
                toValue: 40,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(iconsOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    // RECORING EVENTS

    const startRecording = async () => {
        // Start recording logic
        setIsRecording(true);
        setShowAnimation(true);
    };

    const stopRecording = async () => {
        // Stop recording logic
        setIsRecording(false);
        // Keep the animation visible until recording is fully stopped
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async stop
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
        console.log("Out");
        setIsLongPress(false);
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
        stopRecording();
    };

    const handleLongPress = () => {
        if (isLongPress) {
            // Handle Press Out (release the press)
            setIsLongPress(false);
            Animated.timing(fadeAnim, {
                toValue: 0, // Fade out
                duration: 300, // Smooth transition
                useNativeDriver: true,
            }).start();

            stopRecording();
        } else {
            // Handle Press In (start long press)
            setIsLongPress(true);
            Animated.timing(fadeAnim, {
                toValue: 0.9, // Fade in
                duration: 300, // Smooth transition
                useNativeDriver: true,
            }).start();

            startRecording();
        }
    };

    // RECORDING EVENTS END

    const handleSend = () => {
        /*

        ADD POST REQ FOR TEXT SENT

        */
        console.log("User entered", inputText);
        if (inputText.trim() !== "") {
            // Add the user's message to the list
            const newMessage = {
                id: Date.now().toString(),
                text: inputText,
                sender: "user",
            };
            setMessages((prev) => [newMessage, ...prev]);
            setInputText("");

            // Scroll to the top for inverted list when new message is added
            flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }
    };

    const renderMessage = ({ item }: any) => {
        const isUser = item.sender === "user";
        return (
            <View
                style={[
                    styles.messageContainer,
                    isUser ? styles.messageRight : styles.messageLeft,
                ]}
            >
                <Text style={styles.messageText}>{item.text}</Text>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, marginBottom: tabBarHeight + 20 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === "ios" ? 15 : 0}
            >
                {/* Full-screen overlay when mic icon is long pressed */}
                {isLongPress && (
                    <Animated.View
                        style={[
                            styles.overlay,
                            { opacity: fadeAnim, zIndex: 2 }, // Ensure it's above other content
                        ]}
                    />
                )}

                <View style={styles.inner}>
                    {showChatHistory && (
                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            keyExtractor={(item) => item.id}
                            renderItem={renderMessage}
                            inverted // renders messages from bottom to top
                            contentContainerStyle={[styles.messagesList]}
                        />
                    )}
                    {!showChatHistory && <AtAGlance />}

                    <Animated.View style={[styles.floatingIconContainer]}>
                        <TextInput
                            ref={inputRef}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="talk or chat..."
                            placeholderTextColor={"black"}
                            style={styles.chatInput}
                            onSubmitEditing={handleSend}
                            returnKeyType={"done"}
                            multiline={false}
                        />

                        <TouchableOpacity
                            onPress={() => {
                                if (inputText.trim()) {
                                    handleSend();
                                }
                            }}
                            onPressIn={
                                inputText.trim() ? handleSend : handlePressIn
                            }
                            onPressOut={handlePressOut}
                            // onLongPress={handlePressIn} // Trigger long press
                            style={[
                                styles.iconButton,
                                inputText.trim()
                                    ? styles.sendButton
                                    : styles.micButton,
                            ]}
                        >
                            {showAnimation ? (
                                <AnimatedMicrophone />
                            ) : inputText.trim() ? (
                                <Feather name="send" size={20} color="#fff" />
                            ) : (
                                <Feather name="mic" size={20} color="#fff" />
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark semi-transparent background
        zIndex: 1, // Ensures it's on top of the content
    },
    inner: {
        flex: 1,
        justifyContent: "flex-end",
        paddingHorizontal: 20,
    },
    floatingIconContainer: {
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
    messagesList: {
        flexGrow: 1,
        padding: 16,
    },
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
