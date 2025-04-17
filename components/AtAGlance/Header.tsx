import { ThemeColors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
import { Text, StyleSheet, TouchableOpacity, View, TextInput } from "react-native";
import { enGB, registerTranslation, DatePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
} from "react-native-reanimated";

type HeaderProps = {
    headerHeight: number;
    showChatHistory: boolean;
    theme: ThemeColors;
    onhandleSwitchChatIconPress: () => void;
};

const formatDate = (input: any) => {
    const date = new Date(input);
    const options: any = { weekday: "short", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
};

export const Header = ({
    headerHeight,
    showChatHistory,
    theme,
    onhandleSwitchChatIconPress,
}: HeaderProps) => {
    registerTranslation("en", enGB);

    const searchInputRef = useRef<TextInput>(null);
    const styles = getStyles(theme, headerHeight);

    const [date, setDate] = useState<CalendarDate>(new Date());
    const [open, setOpen] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState<boolean>(false);

    const searchWidth = useSharedValue(0);
    const searchOpacity = useSharedValue(0);

    const animatedSearchStyle = useAnimatedStyle(() => ({
        width: withTiming(searchWidth.value, { duration: isSearchActive ? 300 : 150 }),
        opacity: withTiming(searchOpacity.value, { duration: isSearchActive ? 300 : 150 }),
        transform: [{ translateX: withTiming(isSearchActive ? 0 : 40, { duration: isSearchActive ? 40 : 0 }) }],
    }));


    const openSearch = () => {
        setIsSearchActive(true);
        searchWidth.value = 350;
        searchOpacity.value = 1;

        // Give time for TextInput to mount, then focus
        setTimeout(() => {
            searchInputRef.current?.focus();
        }, 10);
    };

    const closeSearch = () => {
        setIsSearchActive(false);
        searchWidth.value = 0;
        searchOpacity.value = 0;
    };

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
            <TouchableOpacity
                style={styles.switchChatIcon}
                onPress={onhandleSwitchChatIconPress}
            >
                {showChatHistory ? (
                    <Feather name="eye" size={24} color={theme.background} />
                ) : (
                    <Feather name="message-circle" size={24} color={theme.background} />
                )}
            </TouchableOpacity>

            {/* Show search only if chat history is active */}
            {showChatHistory ? (
                isSearchActive ? (
                    <Animated.View style={[styles.searchBarContainer, animatedSearchStyle]}>
                        <TextInput
                            ref={searchInputRef}
                            autoFocus
                            placeholder="Search..."
                            placeholderTextColor={theme.text}
                            style={[styles.searchInput, { color: theme.text }]}
                        />

                        <TouchableOpacity onPress={closeSearch} style={styles.closeIcon}>
                            <Feather name="x" size={18} color={theme.text} />
                        </TouchableOpacity>
                    </Animated.View>
                ) : (
                    <TouchableOpacity style={styles.extraFuncIcon} onPress={openSearch}>
                        <Feather name="search" size={24} color={theme.background} />
                    </TouchableOpacity>
                )
            ) : (
                <TouchableOpacity style={styles.extraFuncIcon} onPress={() => console.log("clicked")}>
                    <Feather name="filter" style={{ top: 1 }} size={24} color={theme.background} />
                </TouchableOpacity>
            )}

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
    );
};

const getStyles = (theme: ThemeColors, headerHeight: number) =>
    StyleSheet.create({
        header: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: headerHeight,
            zIndex: 100,
            elevation: 4,
            shadowColor: "#000",
            backgroundColor: theme.header,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            justifyContent: "center",
        },
        switchChatIcon: {
            position: "absolute",
            top: 45,
            left: 20,
            padding: 8,
            backgroundColor: theme.button,
            borderRadius: 20,
            zIndex: 101,
        },
        extraFuncIcon: {
            position: "absolute",
            top: 45,
            right: 20,
            padding: 8,
            backgroundColor: theme.button,
            borderRadius: 20,
            zIndex: 101,
        },
        searchBarContainer: {
            position: "absolute",
            top: 45,
            right: 20,
            height: 41,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            backgroundColor: theme.button,
            borderRadius: 20,
            zIndex: 101,
            overflow: "hidden",
        },
        searchInput: {
            flex: 1,
            paddingVertical: 0,
            paddingHorizontal: 8,
            fontSize: 14,
        },
        closeIcon: {
            marginLeft: 4,
            padding: 4,
        },
        todayDate: {
            left: "29.5%",
            width: 160,
            justifyContent: "center",
            alignItems: "center",
            top: 53,
            borderRadius: 20, // optional for styling
          }
    });
