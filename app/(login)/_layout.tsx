import { Stack, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/providers/AuthProvider";

export default function LoginLayout() {
    const { user, isLoading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user) {
            router.replace("/(main)/profile");
        }
    }, [isLoading, user]);

    if (isLoading) return null;

    return (
        <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        </Stack>
    );
}