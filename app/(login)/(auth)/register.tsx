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
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { saveAuth } from '@/components/saveAuth';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const { width, height } = Dimensions.get('window');



export default function RegisterView() {
    const [username, setUsername] = useState('');
    const [usernameExists, setUsernameExists] = useState(false);
    const [checking, setChecking] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureTest, setSecureTest] = useState(true);
    const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  });

    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const borderColor = useThemeColor({ light: '#d1d5db', dark: '#4b5563' }, 'border');
    const placeholderColor = useThemeColor({ light: '#6b7280', dark: '#9ca3af' }, 'tabIconDefault');
    const colorScheme = useColorScheme();


    useFocusEffect(
    useCallback(() => {
        setUsername('');
        setEmail('');
        setPassword('');
        setErrors({ username: '', email: '', password: '' });
        setSecureTest(true);
    }, [])
    );

    const handleRegister = async () => {
        // Here you would typically send the registration data to your backend
        const newErrors = {
            username: '',
            email: '',
            password: '',
        };

        if (username.length <= 6) {
            newErrors.username = 'Username must be longer than 6 characters';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (password.length <= 6) {
            newErrors.password = 'Password must be longer than 6 characters';
        }

        setErrors(newErrors);

        const isValid = !newErrors.username && !newErrors.email && !newErrors.password;
        if (!isValid) {
            return;
        }

        setChecking(true);
         try {
            const res = await fetch(`https://your-api.com/check-username?username=${username}`);
            const data = await res.json();
            if (data.exists) {
            setErrors((prev) => ({
                ...prev,
                username: 'Username already taken',
            }));
            return;
            }
        } catch (error) {
            console.error('Error checking username', error);
            // Optional: Show a general error message
        } finally {
            setChecking(false);
        }

        router.replace("/(main)/profile");
    };

    const handleGoogleLoginSuccess = (token: string, user: any) => {
        console.log("Google login successfully，Token:", token);
        console.log("User info：", user);
    
        router.replace("/(main)/profile");
        saveAuth(token, user)
            .then(() => {
                console.log("save auth successfully");
            })
            .catch((error) => {
                console.error("save auth failed:", error);
            });
    };

    const { handleGoogleSignIn, isLoading, error, isReady  } = useGoogleAuth(handleGoogleLoginSuccess);

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
            marginTop: 68,
            marginBottom: 12,
        },
        registerButtonText: {
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
        errorText: {
        color: 'red',
        fontSize: 13,
        marginTop: 4,
        height: 18, // 固定高度，防止 layout shift
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
                            {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
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
                            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
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
                             {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
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

                    <ThemedView style={ styles.dividerContainer}>
                        <Text style={styles.dividerText}>or</Text>
                    </ThemedView>

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
