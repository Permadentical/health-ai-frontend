import { Tabs } from "expo-router";
import React, { useRef } from "react";
import { Animated, Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Measurements } from "@/constants/Measurements";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];
    const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity

    // Function to animate the transition
    const animateTabSwitch = () => {
        fadeAnim.setValue(0); // Start from transparent
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 100, // Duration of the animation
            useNativeDriver: true,
        }).start();
    };

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: "absolute",
                        height: Measurements.tabBar.TAB_HEIGHT,
                    },
                    android: {},
                    default: {},
                }),
            }}
            screenListeners={{
                state: animateTabSwitch,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home", // HOME
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={28}
                            name="ipad.and.iphone"
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="glance"
                options={{
                    title: "At A Glance",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="eyes" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={28}
                            name="brain.head.profile"
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
