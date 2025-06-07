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
    useColorScheme,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

const { width, height } = Dimensions.get('window');

export default function RegisterView() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureTest, setSecureTest] = useState(true);

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const borderColor = useThemeColor({ light: '#d1d5db', dark: '#4b5563' }, 'border');
    const placeholderColor = useThemeColor({ light: '#6b7280', dark: '#9ca3af' }, 'tabIconDefault');
    const colorScheme = useColorScheme();

    const handleRegister = () => {
        console.log('Register clicked', { username, email, password });
        router.replace("/(main)/profile");
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
        linkText: {
            color: placeholderColor,
            fontSize: 14,
        },
        registerButton: {
            width: '100%',
            height: 48,
            backgroundColor: '#16a34a',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 108,
        },
        registerButtonText: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '600',
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
                        </View>

                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor={placeholderColor}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
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
                    <ThemedView style={{ width: '100%', alignItems: 'center', marginBottom: 16 }}>
                        <TouchableOpacity onPress={() => router.push('/(login)/(auth)')}>
                            <Text style={styles.linkText}>Already have an account? Log In</Text>
                        </TouchableOpacity>
                    </ThemedView>

                    {/* Register Button */}
                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                        <Text style={styles.registerButtonText}>Sign Up</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </ThemedView>
        </SafeAreaProvider>
    );
}
