import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import ChatBar from "@/components/ChatBar";

export default function Home() {

    const getCompletion = async (message: string) => {
        console.log("completion", message)
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView 
                style={{flex: 1}}
                keyboardVerticalOffset={70}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ChatBar onShouldSendMessage={getCompletion}/>
            </KeyboardAvoidingView>
        </View>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: 'white'
    }
})