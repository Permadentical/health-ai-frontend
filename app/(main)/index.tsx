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

const HEADER_HEIGHT = 100;

export default function ChatScreen() {
    
    const tabBarHeight = Measurements.tabBar.TAB_HEIGHT;
    const today = new Date().toLocaleDateString();

    const colorScheme = useColorScheme()
    const theme: ThemeColors = Colors[colorScheme ?? "light"];
    const styles = getStyles(theme)

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
            <View style={styles.header}>
                {/* Overlay handling for mic long press, etc. */}
                {/** ... overlay with fadeAnim if needed ... */}
                <TouchableOpacity style={styles.switchChatIcon} onPress={handleSwitchChatIcon}>
                    {showChatHistory ? 
                        <Feather name="eye" size={24} color={theme.background}/> :
                        <Feather name="message-circle" size={24} color={theme.background}/>
                    }
                </TouchableOpacity>
                <View style={styles.todayDate}>
                    <Text style={{fontSize: 25, color:theme.text}}>{today}</Text>
                </View>
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

const getStyles = (theme: ThemeColors) => StyleSheet.create({
    container: {
        flex: 1,
        marginTop: HEADER_HEIGHT,
        backgroundColor: theme.background
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT,
        zIndex: 100, // Keeps header above other content
        elevation: 4, // Android shadow
        shadowColor: '#000', // iOS shadow (?)
        backgroundColor: theme.header,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        justifyContent: 'center',
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
    switchChatIcon: {
        position: 'absolute',
        top: 45,
        left: 20,
        padding: 8,
        backgroundColor: theme.button,
        borderRadius: 20,
        zIndex: 101,
    },
    todayDate: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        top: 15
    }
});