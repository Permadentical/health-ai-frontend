import { Tabs } from "expo-router";
import React from "react";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function AuthLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Login",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={28}
                            name="phone.arrow.right"
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="register"
                options={{
                    title: "Register",
                    tabBarIcon: ({ color, focused }) => (
                        <IconSymbol
                            size={28}
                            name="phone.and.waveform"
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
