// src/screens/ChatScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import {
    View,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    Animated,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { Measurements } from "@/constants/Measurements";
import { ChatInput } from "@/components/AtAGlance/ChatInput";
import { ChatMessage } from "@/components/AtAGlance/ChatMessage";
import { AtAGlance } from "@/components/AtAGlance";
import { useRecordingControls } from "@/hooks/useRecordingControls";
import { useDismissKeyboardOnScroll } from "@/hooks/useDismissKeyboardOnScroll";
import { Feather } from "@expo/vector-icons";
const HEADER_HEIGHT = 100;

export default function ChatScreen() {
    
    const tabBarHeight = Measurements.tabBar.TAB_HEIGHT;

    const [messages, setMessages] = useState([
        { id: "1", text: "Hello, how can I help you today?", sender: "ai" },
        { id: "2", text: "Hi there!", sender: "user" },
        { id: "3", text: "Hello, how can I help you today?", sender: "ai" },
        // ...other messages
    ]);
    const [inputText, setInputText] = useState("");
    const [showChatHistory, setShowChatHistory] = useState<boolean>(false);

    // Animation value for AtAGlance fade out/in
    const atAGlanceOpacity = useRef(new Animated.Value(1)).current;

    const flatListRef = useRef<FlatList>(null);
    const keyboardDismissHandlers = useDismissKeyboardOnScroll();

    // Extracted recording logic
    const { showAnimation, fadeAnim, handlePressIn, handlePressOut } = useRecordingControls();

    // Keyboard handling and input focus
    const handleInputFocus = () => {
        Animated.timing(atAGlanceOpacity, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            setShowChatHistory(true);
        });
    };

    const handleBackToAAG = () => {
        Animated.timing(atAGlanceOpacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            setShowChatHistory(false);
        });
    };

    const handleSend = () => {
        if (inputText.trim() !== "") {
            const newMessage = { id: Date.now().toString(), text: inputText, sender: "user" };
            setMessages((prev) => [newMessage, ...prev]);
            setInputText("");
            flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }
    };

    const handleSwitchChatIcon = () => {
        showChatHistory ? handleBackToAAG() : handleInputFocus()
    }

    const renderMessage = ({ item }: any) => (
        <ChatMessage text={item.text} isUser={item.sender === "user"} />
    );

    return (
        <View style={{ flex: 1, marginBottom: tabBarHeight + 20 }}>
            <View style={styles.header}>
                {/* Overlay handling for mic long press, etc. */}
                {/** ... overlay with fadeAnim if needed ... */}
                <TouchableOpacity style={styles.switchChatIcon} onPress={handleSwitchChatIcon}>
                    {showChatHistory ? 
                        <Feather name="eye" size={24} color={'#fff'}/> :
                        <Feather name="message-circle" size={24} color={'#fff'}/>
                    }
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === "ios" ? 15 : 0}
            >
                
                <View style={styles.inner}>
                    {/** AtAGlance vs. Chat History */}
                    {!showChatHistory ? (
                        <Animated.View style={{ opacity: atAGlanceOpacity }}>
                            <AtAGlance />
                        </Animated.View>
                    ) : (
                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            keyExtractor={(item) => item.id}
                            renderItem={renderMessage}
                            inverted
                            contentContainerStyle={styles.messagesList}
                        />
                    )}

                    <ChatInput
                        value={inputText}
                        onChangeText={setInputText}
                        onSend={handleSend}
                        onInputFocus={handleInputFocus}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        showAnimation={showAnimation}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // Add a top margin equal to the header height so content starts below it
        marginTop: HEADER_HEIGHT,
    },
    // Fixed header style: explicitly set a height and position it at the top
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT,
        backgroundColor: 'blue',
        zIndex: 100, // Keeps header above other content
        elevation: 4, // For Android shadow
        // Optionally, add a shadow for iOS:
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        justifyContent: 'center',
    },
    inner: {
        flex: 1,
        justifyContent: "flex-end",
        paddingHorizontal: 20,
    },
    messagesList: { 
        flexGrow: 1, 
        padding: 16 
    },
    // Adjust the icon position relative to the header
    switchChatIcon: {
        position: 'absolute',
        top: 40, // for example, 20 pixels from the top of the header
        left: 20, // adjust as needed
        padding: 8,
        backgroundColor: 'green',
        borderRadius: 20,
        zIndex: 101, // Make sure it stays above the header background if needed
    },
});