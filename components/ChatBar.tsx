import { Colors } from "@/constants/Colors";
import { Measurements } from "@/constants/Measurements";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type MessageInputProps = {
    // TODO
    onShouldSendMessage: (message: string) => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

export default function ChatBar({onShouldSendMessage} : MessageInputProps) {

    const [message, setMessage] = useState<string>('');
    const { bottom } = useSafeAreaInsets();
    const expanded = useSharedValue<Number>(0);

    const expandItems = () => {
        // TODO
    }

    const collapseItems = () => {
        // TODO
    }

    const startRecording = () => {
        // TODO
        console.log("RECORDING")
    }

    const onSendMessage = () => {
        // TODO
        console.log("SENDING MSG")
    }
    return (
        <BlurView intensity={90} style={[styles.chatBar, { paddingBottom: bottom }]}>
            <View style={styles.row}>
                <AnimatedTouchableOpacity onPress={expandItems} style={styles.roundBtn}>
                    {/* // TODO figure out how to define light/dark across app easier */}
                    <Ionicons name="add" size={24} color={Colors.light.MessageInputAddIcon} />

                </AnimatedTouchableOpacity>

                <TextInput
                    placeholder="Message"
                    style={styles.messageInput}
                    multiline
                    value={message}
                    onChangeText={setMessage}
                    onFocus={() => { }}
                />

                {message.length > 0 ? (
                    <TouchableOpacity onPress={onSendMessage}>
                        <Ionicons name='arrow-up-circle' size={24} color={Colors.light.icon}/>
                    </TouchableOpacity>) : (
                    <TouchableOpacity onPress={startRecording}>
                        <FontAwesome5 name='microphone' size={24} color={Colors.light.icon} />
                    </TouchableOpacity>
                )}
            </View>
        </BlurView>)
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    chatBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: Measurements.tabBar.TAB_HEIGHT, // floats just above tab bar
        backgroundColor: 'rgb(240, 240, 240)', // or whatever suits your theme
    },
    roundBtn: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: 'silver', // TODO change this to something better?
        alignItems: 'center',
        justifyContent: 'center'
    },

    messageInput: {
        flex: 1,
        marginHorizontal: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 20,
        padding: 10
    }
})