import React, { useState, useEffect } from "react";
import {
    View,
    TextInput,
    FlatList,
    Text,
    TouchableOpacity,
} from "react-native";
import { Audio } from "expo-av";
import axios from "axios";

const ChatScreen = () => {
    const [messages, setMessages] = useState<any>([]);
    const [input, setInput] = useState<any>("");
    const [recording, setRecording] = useState<any>(null);
    const [sound, setSound] = useState<any>(null);
    const userId = "user123"; // Replace with actual user ID

    const sendMessage = async () => {
        if (!input) return;
        console.debug("Message Sent: ", input);
        // Add user message
        setMessages((prev: any) => [...prev, { text: input, isUser: true }]);

        try {
            const response = await axios.post("http://your-backend/chat/text", {
                user_id: userId,
                content: input,
            });

            setMessages((prev: any) => [
                ...prev,
                {
                    text: response.data.text,
                    audioUrl: response.data.audio_url,
                    isUser: false,
                },
            ]);

            playAudio(response.data.audio_url);
        } catch (error) {
            console.error(error);
        }
        setInput("");
    };

    const startRecording = async () => {
        try {
            await Audio.requestPermissionsAsync();
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
        } catch (err) {
            console.error(err);
        }
    };

    const stopRecording = async () => {
        setRecording(null);
        await recording.stopAndUnloadAsync();

        // Send audio file
        const uri = recording.getURI();
        const response = await fetch(uri);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append("file", blob, "recording.mp3");

        try {
            const response = await axios.post(
                "http://your-backend/chat/audio",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    params: { user_id: userId },
                }
            );

            setMessages((prev: any) => [
                ...prev,
                {
                    text: response.data.text,
                    audioUrl: response.data.audio_url,
                    isUser: false,
                },
            ]);

            playAudio(response.data.audio_url);
        } catch (error) {
            console.error(error);
        }
    };

    const playAudio = async (url: any) => {
        const { sound } = await Audio.Sound.createAsync(
            { uri: url },
            { shouldPlay: true }
        );
        setSound(sound);
        await sound.playAsync();
    };

    return (
        <View style={{ marginVertical: 300 }}>
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View
                        style={{
                            alignSelf: item.isUser ? "flex-end" : "flex-start",
                            backgroundColor: item.isUser
                                ? "#DCF8C6"
                                : "#E8E8E8",
                            padding: 10,
                            margin: 5,
                            borderRadius: 10,
                        }}
                    >
                        <Text>{item.text}</Text>
                    </View>
                )}
            />
            <View style={{ flexDirection: "row", padding: 10 }}>
                <TextInput
                    style={{
                        flex: 1,
                        borderColor: "gray",
                        borderWidth: 1,
                        padding: 10,
                    }}
                    value={input}
                    onChangeText={setInput}
                />
                <TouchableOpacity
                    onPressIn={startRecording}
                    onPressOut={stopRecording}
                    style={{ padding: 10 }}
                >
                    <Text>🎤</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={sendMessage} style={{ padding: 10 }}>
                    <Text>📤</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ChatScreen;
