import React, { useState } from "react";
import {
    View,
    TextInput,
    FlatList,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
} from "react-native";
import { Audio } from "expo-av";
import axios from "axios";
import * as FileSystem from "expo-file-system";

const ChatScreen = () => {
    const [messages, setMessages] = useState<any>([]);
    const [input, setInput] = useState<any>("");
    const [recording, setRecording] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const userId = "user123"; // Replace with actual user ID

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

    // const stopRecording = async () => {
    //     if (!recording) {
    //         console.error("No active recording found.");
    //         return;
    //     }

    //     await recording.stopAndUnloadAsync(); // Ensure this is only called if recording exists
    //     let uri = recording.getURI();

    //     if (!uri) {
    //         console.error("Recording URI is null.");
    //         return;
    //     }

    //     setRecording(null);

    //     // Convert to Blob
    //     const formData: any = new FormData();
    //     formData.append("file", {
    //         uri: uri,
    //         name: "audio.mp3",
    //         type: "audio/mpeg",
    //     });

    //     console.log(formData);

    //     try {
    //         setLoading(true); // Show loading indicator during processing
    //         console.log("MADE IT");

    //         const response: any = await fetch(
    //             `http://192.168.1.155:8002/chat/audio-stream?user_id=${userId}`, // Include user_id
    //             {
    //                 method: "POST",
    //                 body: formData,
    //                 headers: {
    //                     "Content-Type": "multipart/form-data",
    //                     Accept: "application/json", // Important for streaming
    //                 },
    //             }
    //         );

    //         console.log("MADE IT");
    //         console.log(response);

    //         let audioChunks = [];
    //         const reader: any = response.data.getReader();

    //         const processStream = async () => {
    //             let { done, value } = await reader.read();

    //             while (!done) {
    //                 audioChunks.push(value);
    //                 if (audioChunks.length > 2) {
    //                     startStreamingPlayback(audioChunks);
    //                 }
    //                 ({ done, value } = await reader.read());
    //             }

    //             // Final playback for any remaining chunks
    //             startStreamingPlayback(audioChunks);
    //             setLoading(false);
    //         };

    //         processStream();
    //         setLoading(false);
    //     } catch (error) {
    //         console.error("Error streaming audio:", error);
    //         setLoading(false);
    //     }
    // };

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

        // Prepare FormData
        const formData: any = new FormData();
        formData.append("file", {
            uri: uri,
            name: "audio.mp3",
            type: "audio/mpeg",
        });

        try {
            setLoading(true);

            // Make a POST request to send audio and receive MP3 file
            const response = await fetch(
                `http://100.96.26.7:8002/chat/audio-stream?user_id=${userId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Accept: "audio/mpeg", // Expect MP3 response
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Convert response to a Blob
            const responseBlob = await response.blob();

            // Define file path for the received MP3
            const fileUri = `${FileSystem.cacheDirectory}response.mp3`;

            // Save the MP3 file
            const reader: any = new FileReader();
            reader.readAsDataURL(responseBlob);
            reader.onloadend = async () => {
                const base64Data = reader.result.split(",")[1]; // Extract Base64 data
                await FileSystem.writeAsStringAsync(fileUri, base64Data, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                // Check if file exists
                const fileInfo = await FileSystem.getInfoAsync(fileUri);
                console.log("File info:", fileInfo);

                // Play the received MP3 file
                const { sound } = await Audio.Sound.createAsync({
                    uri: fileUri,
                });
                await sound.playAsync();
            };

            setLoading(false);
        } catch (error) {
            console.error("Error receiving audio:", error);
            setLoading(false);
        }
    };

    const startStreamingPlayback = async (chunks: BlobPart[]) => {
        const blob = new Blob(chunks, { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(blob);
        const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
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

            {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
    );
};

export default ChatScreen;
