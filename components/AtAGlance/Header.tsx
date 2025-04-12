import { ThemeColors } from "@/constants/Colors"
import { Feather } from "@expo/vector-icons";
import {Text, StyleSheet, TouchableOpacity, View } from "react-native"

type HeaderProps = {
    headerHeight: number
    todayDate: string
    showChatHistory: boolean
    theme: ThemeColors
    onhandleSwitchChatIconPress: () => void;
} 

export const Header = ({headerHeight, todayDate, showChatHistory, theme, onhandleSwitchChatIconPress}: HeaderProps) => {
    const styles = getStyles(theme, headerHeight)

    return (
        <View style={styles.header}>
            {/* Overlay handling for mic long press, etc. */}
            {/** ... overlay with fadeAnim if needed ... */}
            <TouchableOpacity style={styles.switchChatIcon} onPress={onhandleSwitchChatIconPress}>
                {showChatHistory ? 
                    <Feather name="eye" size={24} color={theme.background}/> :
                    <Feather name="message-circle" size={24} color={theme.background}/>
                }
            </TouchableOpacity>
            <TouchableOpacity style={styles.extraFuncIcon} onPress={() => console.log("clicked")}>
                {showChatHistory ? 
                    <Feather name="search" size={24} color={theme.background}/> :
                    <Feather name="filter" style={{top:1}} size={24} color={theme.background}/>
                }
            </TouchableOpacity>
            <View style={styles.todayDate}>
                <Text style={{fontSize: 25, color:theme.text}}>{todayDate}</Text>
            </View>
        </View>
    )
}

const getStyles = (theme: ThemeColors, headerHeight: number) => StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: headerHeight,
        zIndex: 100, // Keeps header above other content
        elevation: 4, // Android shadow
        shadowColor: '#000', // iOS shadow (?)
        backgroundColor: theme.header,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        justifyContent: 'center',
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
    extraFuncIcon: {
        position: 'absolute',
        top: 45,
        right: 20,
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

})