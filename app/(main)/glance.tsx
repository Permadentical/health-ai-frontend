import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Home() {

    const getCompletion = async (message: string) => {
        console.log("completion", message)
    }

    return (
        <View style={styles.container}>
            <Text style={{flex: 1, left: 50, top: 100}}>EMPTY</Text>
        </View>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: 'white'
    }
})