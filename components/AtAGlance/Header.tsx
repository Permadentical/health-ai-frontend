import { ThemeColors } from "@/constants/Colors"
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {Text, StyleSheet, TouchableOpacity, View } from "react-native"
import DatePicker, { RangeOutput, SingleOutput } from 'react-native-neat-date-picker'

type HeaderProps = {
    headerHeight: number
    todayDate: string
    showChatHistory: boolean
    theme: ThemeColors
    onhandleSwitchChatIconPress: () => void;
} 

export const Header = ({headerHeight, todayDate, showChatHistory, theme, onhandleSwitchChatIconPress}: HeaderProps) => {
    const styles = getStyles(theme, headerHeight)

    const [showDatePickerSingle, setShowDatePickerSingle] = useState(false)

    const [date, setDate] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const openDatePickerSingle = () => setShowDatePickerSingle(true)

    const onCancelSingle = () => {
        // You should close the modal here
        setShowDatePickerSingle(false)
    }

    const onConfirmSingle = (output: SingleOutput) => {
        // You should close the modal here
        setShowDatePickerSingle(false)

        // The parameter 'output' is an object containing date and dateString (for single mode).
        // For range mode, the output contains startDate, startDateString, endDate, and endDateString
        console.log(output)
        setDate(output.dateString ?? '')
    }

    return (
        <View style={{flex:1}}>
            <DatePicker
                isVisible={showDatePickerSingle}
                mode={'single'}
                onCancel={onCancelSingle}
                onConfirm={onConfirmSingle}
                modalStyles={{flex:1, zIndex: 109}}
            />
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
                <TouchableOpacity style={styles.todayDate} onPress={openDatePickerSingle}>
                    <Text style={{fontSize: 25, color:theme.text}}>{todayDate}</Text>
                </TouchableOpacity>
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
        top: 17
    }

})