import { ThemeColors } from "@/constants/Colors"
import { Feather } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native"
import { enGB, registerTranslation, DatePickerModal } from 'react-native-paper-dates'
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { SafeAreaProvider } from "react-native-safe-area-context";
type HeaderProps = {
    headerHeight: number
    showChatHistory: boolean
    theme: ThemeColors
    onhandleSwitchChatIconPress: () => void;
}

const formatDate = (input: any) => {
    const date = new Date(input);
    const options: any = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

export const Header = ({ headerHeight, showChatHistory, theme, onhandleSwitchChatIconPress }: HeaderProps) => {
    registerTranslation('en', enGB)

    const styles = getStyles(theme, headerHeight)

    const [date, setDate] = useState<CalendarDate>(new Date());
    const [open, setOpen] = useState(false);

    const onDismiss = useCallback(() => {
        setOpen(false);
    }, []);

    const onConfirm = useCallback((params: any) => {
        setOpen(false);
        setDate(params.date);
        // TODO: add backend call to fetch the correct date texts/cals!
    }, []);


    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.switchChatIcon} onPress={onhandleSwitchChatIconPress}>
                {showChatHistory ?
                    <Feather name="eye" size={24} color={theme.background} /> :
                    <Feather name="message-circle" size={24} color={theme.background} />
                }
            </TouchableOpacity>
            <TouchableOpacity style={styles.extraFuncIcon} onPress={() => console.log("clicked")}>
                {showChatHistory ?
                    <Feather name="search" size={24} color={theme.background} /> :
                    <Feather name="filter" style={{ top: 1 }} size={24} color={theme.background} />
                }
            </TouchableOpacity>
            <SafeAreaProvider>
                <TouchableOpacity style={styles.todayDate} onPress={() => setOpen(true)}>
                    <Text style={{ fontSize: 25, color: theme.text }}>{formatDate(date)}</Text>
                </TouchableOpacity>
                <DatePickerModal
                    locale="en"
                    mode="single"
                    visible={open}
                    onDismiss={onDismiss}
                    date={date}
                    onConfirm={onConfirm}
                />
            </SafeAreaProvider>
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