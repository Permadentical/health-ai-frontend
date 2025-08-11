import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Dimensions,
    useColorScheme
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { saveAuth } from '@/components/AuthManager';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { fetchSettings } from '@/hooks/useSettings';
import { getSettings, saveSettings } from '@/components/SettingManager';

const { width, height } = Dimensions.get('window');

export default function LoginView() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [secureTest, setSecureTest] = useState(true);
    const { setUser, setSettings } = useContext(AuthContext);

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const borderColor = useThemeColor({ light: '#d1d5db', dark: '#4b5563' }, 'border');
    const placeholderColor = useThemeColor({ light: '#6b7280', dark: '#9ca3af' }, 'tabIconDefault');
    const colorScheme = useColorScheme();


    useFocusEffect(
        useCallback(() => { 
            setUsername('');
            setPassword('');
            setSecureTest(true);
        }, [])
    );

    const handleLogin = () => {
        // Handle login logic here
        console.log('Login clicked', { username, password });
        router.replace("/(main)/profile");
        
    };

    const handleGoogleLoginSuccess = async (access_token: string, refresh_token: string, user: any) => {
        try{
        console.log("User info：", user);
    
        await saveAuth(access_token, refresh_token, user)
        setUser(user);
        const settings = await fetchSettings(user.id, access_token);
        
        await saveSettings(settings);
        setSettings(settings);
        console.log("save auth successfully");
        } catch(error) {
                console.error("save auth failed:", error);
            };

        router.push("/(main)/profile");
    };

    const { handleGoogleSignIn, isLoading, error, isReady } = useGoogleAuth(handleGoogleLoginSuccess);

    const clearUsername = () => {
        setUsername('');
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        innerContainer: {
            flex: 1,
            paddingHorizontal: 32,
            justifyContent: 'center',
            alignItems: 'center',
        },
        logoContainer: {
            marginBottom: 64,
            alignItems: 'center',
        },
        inputContainer: {
            width: '100%',
            marginBottom: 2,
        },
        inputWrapper: {
            marginBottom: 16,
            position: 'relative',
        },
        input: {
            width: '100%',
            height: 48,
            paddingHorizontal: 16,
            paddingRight: 48,
            borderWidth: 1,
            borderRadius: 8,
            fontSize: 16,
            borderColor: borderColor,
            color: textColor,
        },
        clearButton: {
            position: 'absolute',
            right: 12,
            top: 12,
            width: 24,
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
        },
        clearButtonText: {
            color: placeholderColor,
            fontSize: 18,
            fontWeight: 'bold',
        },
        linksContainer: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 16,
            marginBottom: 32,
        },
        linkText: {
            color: placeholderColor,
            fontSize: 14,
        },
        loginButton: {
            width: '100%',
            height: 48,
            backgroundColor: '#2563eb', 
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
            marginTop: 64,
        },
        loginButtonText: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '600',
        },
        dividerContainer: {
            width: '100%',
            alignItems: 'center',
            marginBottom: 12,
        },
        dividerText: {
            color: placeholderColor,
            fontSize: 14,
        },
        googleButton: {
            width: '100%',
            height: 48,
            borderWidth: 1,
            borderColor: borderColor,
            borderRadius: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
        },
        googleButtonText: {
            color: textColor,
            fontSize: 16,
            fontWeight: '500',
            marginLeft: 12,
        },
        googleIcon: {
            width: 24,
            height: 24,
        },
    });

    return (
        <SafeAreaProvider>
            <ThemedView style={styles.container}>
                <StatusBar 
                    barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
                    backgroundColor={backgroundColor} 
                />
                <SafeAreaView style={styles.innerContainer}>
                    {/* Logo */}
                    <ThemedView style={styles.logoContainer}>
                        <Image
                            source={require('@/assets/images/logo/logo.png')}
                            style={{ width: 120, height: 120 }}
                            resizeMode="contain"
                        />
                    </ThemedView>

                    {/* Input Fields */}
                    <ThemedView style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Username"
                                placeholderTextColor={placeholderColor}
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                            />
                            {username !== '' && (
                                <TouchableOpacity style={styles.clearButton} onPress={clearUsername}>
                                    <Text style={styles.clearButtonText}>×</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor={placeholderColor}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={secureTest}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity style={styles.clearButton} onPress={() => setSecureTest(!secureTest)}>
                                <Text style={styles.clearButtonText}>
                                    {secureTest ? '👁️' : '🙈'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ThemedView>

                    {/* Links */}
                    <ThemedView style={styles.linksContainer}>
                        <Link href="/(login)/(auth)/register" asChild>
                            <TouchableOpacity>
                                <Text style={styles.linkText}>Don't have an account?</Text>
                            </TouchableOpacity>
                        </Link>
                        <Link href="/(login)/forgot-password" asChild>
                            <TouchableOpacity>
                                <Text style={styles.linkText}>forgot password?</Text>
                            </TouchableOpacity>
                        </Link>
                    </ThemedView>

                    {/* Login Button */}
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <ThemedView style={styles.dividerContainer}>
                        <Text style={styles.dividerText}>or</Text>
                    </ThemedView>

                    {/* Google Sign In */}
                    <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
                        <Image
                            source={require("@/assets/images/google/icons8-google-96.png")}
                            style={styles.googleIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.googleButtonText}>Sign in with Google</Text>
                    </TouchableOpacity>

                </SafeAreaView>
            </ThemedView>
        </SafeAreaProvider>
    );
}