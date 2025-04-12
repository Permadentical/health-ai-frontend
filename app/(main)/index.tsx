// src/screens/ChatScreen.tsx
import React, { useRef, useState } from "react";
import {
    View,
    KeyboardAvoidingView,
    Platform,
    Animated,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Text,
    useColorScheme,
} from "react-native";
import { Measurements } from "@/constants/Measurements";
import { ChatInput } from "@/components/AtAGlance/ChatInput";
import { ChatMessage } from "@/components/AtAGlance/ChatMessage";
import { AtAGlance } from "@/components/AtAGlance";
import { useRecordingControls } from "@/hooks/useRecordingControls";
import { Feather } from "@expo/vector-icons";
import { Colors, ThemeColors } from "@/constants/Colors";
import { Header } from "@/components/AtAGlance/Header";

export default function ChatScreen() {
    const HEADER_HEIGHT = 100;
    const tabBarHeight = Measurements.tabBar.TAB_HEIGHT;
    const today = new Date().toLocaleDateString();

    const colorScheme = useColorScheme()
    const theme: ThemeColors = Colors[colorScheme ?? "light"];
    const styles = getStyles(theme, HEADER_HEIGHT)

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

    // Extracted recording logic
    const { showAnimation, fadeAnim, handlePressIn, handlePressOut } = useRecordingControls();

    // Keyboard handling and input focus
    const handleInputFocus = () => {
        Animated.timing(atAGlanceOpacity, { 
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
        }).start(() => {
            setShowChatHistory(true);
        });
    };

    const handleBackToAAG = () => {
        if (showChatHistory) setShowChatHistory(false)
        Animated.timing(atAGlanceOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
        }).start();
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
        <ChatMessage text={item.text} isUser={item.sender === "user"} theme={theme} />
    );

    return (
        <View style={{ flex: 1, marginBottom: tabBarHeight}}>
            <Header
                headerHeight={HEADER_HEIGHT}
                todayDate={today}
                showChatHistory={showChatHistory} 
                theme={theme} 
                onhandleSwitchChatIconPress={handleSwitchChatIcon}
            />

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
                        theme={theme}
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

const getStyles = (theme: ThemeColors, header_height: number) => StyleSheet.create({
    container: {
        flex: 1,
        marginTop: header_height,
        backgroundColor: theme.background
    },

    inner: {
        flex: 1,
        justifyContent: "flex-end",
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    messagesList: { 
        flexGrow: 1, 
        padding: 6,
        top: 5,
    },
});