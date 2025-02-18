import React, { useEffect, useRef, useState } from "react";
import {
    View,
    TextInput,
    FlatList,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Animated,
} from "react-native";
import { Audio } from "expo-av";
import axios from "axios";
import * as FileSystem from "expo-file-system";

const ChatScreen = () => {
    const [messages, setMessages] = useState<any>([]);
    const [input, setInput] = useState<any>("");
    const [recording, setRecording] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [displayedText, setDisplayedText] = useState<string>("");
    const userId = "user123"; // Replace with actual user ID
    const fadeAnim = useRef(new Animated.Value(0)).current; // For fade-in animation

    const sendMessage = async () => {
        if (!input) return;
        console.debug("Message Sent: ", input);

        // Add user message
        setMessages((prev: any) => [...prev, { text: input, isUser: true }]);
        const url = "http://192.168.1.155:8002/chat/text";
        try {
            const response = await axios.post(url, {
                user_id: userId,
                content: input,
                is_audio: false,
            });

            // setMessages((prev: any) => [
            //     ...prev,
            //     {
            //         text: response,
            //     },
            // ]);

            console.debug("Message r: ", response.data);
        } catch (error) {
            console.error(error);
        }
        setInput("");
    };

    const startRecording = async () => {
        try {
            // Request permission
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== "granted") {
                console.error("Permission to access microphone denied.");
                return;
            }

            // Enable recording mode (needed for iOS)
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            // Start recording
            const recordingInstance = new Audio.Recording();
            await recordingInstance.prepareToRecordAsync(
                Audio.RecordingOptionsPresets.LOW_QUALITY
            );
            await recordingInstance.startAsync();

            setRecording(recordingInstance); // Ensure recording is set before stopping
        } catch (err) {
            console.error("Error starting recording:", err);
        }
    };

    const stopRecording = async () => {
        if (!recording) {
            console.error("No active recording found.");
            return;
        }

        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
        });
        let uri = recording.getURI();

        if (!uri) {
            console.error("Recording URI is null.");
            return;
        }

        setRecording(null);

        // Clear the displayed text when a new recording starts
        setDisplayedText("");

        // Prepare FormData
        const formData: any = new FormData();
        formData.append("file", {
            uri: uri,
            name: "audio.mp3",
            type: "audio/mpeg",
        });

        try {
            setLoading(true);

            // 1. Send Audio (Start, don't wait for completion)
            const audioPromise = fetch(
                `http://192.168.1.155:8002/chat/audio-stream?user_id=${userId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    body: formData,
                }
            ); // Don't await here!

            // 2. Fetch Text (Start immediately, don't wait for audio)
            const textPromise = fetch(
                `http://192.168.1.155:8002/chat/get-response?user_id=${userId}`
            ); // Don't await here either!

            // 3. Process Audio (in parallel with text display)
            audioPromise
                .then(async (audioResponse) => {
                    if (!audioResponse.ok) {
                        throw new Error(
                            `HTTP error! Status: ${audioResponse.status}`
                        );
                    }

                    const responseBlob = await audioResponse.blob();
                    const fileUri = `${FileSystem.cacheDirectory}response.mp3`;

                    const reader: any = new FileReader();
                    reader.readAsDataURL(responseBlob);
                    reader.onloadend = async () => {
                        const base64Data = reader.result.split(",")[1];
                        await FileSystem.writeAsStringAsync(
                            fileUri,
                            base64Data,
                            {
                                encoding: FileSystem.EncodingType.Base64,
                            }
                        );

                        const { sound } = await Audio.Sound.createAsync({
                            uri: fileUri,
                        });
                        await sound.playAsync(); // Play the sound
                    };
                })
                .catch((error) => {
                    console.error("Error processing audio:", error);
                    setLoading(false); // Important: Set loading to false even if audio fails
                });

            // 4. Process and Display Text (in parallel with audio)
            textPromise
                .then(async (textResponse) => {
                    if (!textResponse.ok) {
                        throw new Error(
                            `HTTP error! Status: ${textResponse.status}`
                        );
                    }

                    const textData = await textResponse.json();
                    const text = textData.response;

                    let currentText = "";
                    for (let i = 0; i < text.length; i++) {
                        currentText += text[i];
                        setDisplayedText(currentText);
                        await new Promise((resolve) => setTimeout(resolve, 50));
                    }
                })
                .catch((error) => {
                    console.error("Error fetching text:", error);
                    setLoading(false); // Important: Set loading to false even if text fails
                });

            // The loading indicator will be set to false when *both* the audio and text promises have resolved or rejected.
            Promise.all([audioPromise, textPromise]).finally(() =>
                setLoading(false)
            );
        } catch (error) {
            console.error("General error in stopRecording:", error);
            setLoading(false); // Make sure to set loading to false in the outer catch block as well
        }
    };

    // Function to fade in the text
    const fadeInText = () => {
        fadeAnim.setValue(0); // Reset opacity to 0
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000, // Adjust duration here
            useNativeDriver: true,
        }).start();
    };

    // Trigger fade-in animation when displayedText changes
    useEffect(() => {
        if (displayedText) {
            fadeInText();
        }
    }, [displayedText]);

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
                        <Text>{item.isUser ? item.text : displayedText}</Text>
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

            {loading && <ActivityIndicator size="large" color="#0000ff" />}

            {/* Fade-in text container */}
            <Animated.View style={{ opacity: fadeAnim }}>
                <Text>{displayedText}</Text>
            </Animated.View>
        </View>
    );
};

export default ChatScreen;
