import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';
import { useState } from 'react';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();


export const useGoogleAuth = (onLoginSuccess: (access_token: string, refresh_token: string, user: any) => void) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { googleClientId, androidClientId, iosClientId, apiBaseUrl } = Constants.expoConfig?.extra ?? {};

    const redirectUri = AuthSession.makeRedirectUri({
        scheme: "myapp", 
        path: "redirect",
        preferLocalhost: true
    });
    
    const [request, response, promptAsync] = Google.useAuthRequest(
        {
            webClientId: googleClientId,
            androidClientId: androidClientId,
            iosClientId: iosClientId,
            redirectUri: redirectUri,
            scopes: ['profile', 'email', 'openid'],
            responseType: 'token',
    });

    useEffect(() => {
        console.log('🔗 Redirect URI:', redirectUri);
        console.log('📱 Platform:', Platform.OS);
        console.log('🚀 Is Dev:', __DEV__);
        console.log('📋 Response:', response);

        if (response?.type === 'success') {
            handleAuthSuccess(response);
        } else if (response?.type === 'error') {
            console.error('❌ Auth Error:', response.error);
            setError(response.error?.message || 'Authentication failed');
            setIsLoading(false);
        } else if (response?.type === 'cancel') {
            console.log('⚠️ Auth Cancelled');
            setIsLoading(false);
        }
    }, [response]);
  
    const handleAuthSuccess = async (authResponse: any) => {
        try {
            setIsLoading(true);
            setError(null);

            const { authentication } = authResponse;
            const accessToken = authentication?.accessToken;
            const idToken = authentication?.idToken;
            
            console.log('✅ Auth Success - Response:', authResponse);
            console.log('✅ Auth Success - Authentication:', authentication);
            console.log('✅ Auth Success - Access Token:', !!accessToken);
            console.log('✅ Auth Success - ID Token:', !!idToken);

            if (!accessToken && !idToken) {
                throw new Error('No authentication tokens received');
            }

            // if (!idToken) {
            //     console.error("❌ No ID Token. You might still be using Expo Go. Use a dev client.");
            //     return;
            // }

            // optional: fetch user info
            let userInfo = null;
            if (accessToken) {
                userInfo = await fetchGoogleUserInfo(accessToken);
            }

            // send access token and user info to backend
            const response = await fetch(`${apiBaseUrl}/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_token: accessToken,
                    user_info: userInfo,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('🎉 Backend Auth Success:', data);

            // call the success handler
            onLoginSuccess(data.access_token, data.refresh_token, data.user);
            
        } catch (error) {
            console.error('💥 Auth Processing Error:', error);
            setError(error instanceof Error ? error.message : 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

const fetchGoogleUserInfo = async (accessToken: string) => {
        try {
            const response = await fetch(
                `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch user info');
            }
            
            const userInfo = await response.json();
            console.log('👤 User Info:', userInfo);
            return userInfo;
        } catch (error) {
            console.error('Failed to fetch Google user info:', error);
            return null;
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            console.log('🔄 Starting Google Sign In...');
            console.log('📝 Request ready:', !!request);
            
            if (!request) {
                throw new Error('Authentication request not ready');
            }

            const result = await promptAsync();
            console.log('🎯 Prompt result:', result);
            
            
            
        } catch (error) {
            console.error('💥 Sign In Error:', error);
            setError(error instanceof Error ? error.message : 'Sign in failed');
            setIsLoading(false);
        }
    };

    const clearError = () => setError(null);

    return { 
        handleGoogleSignIn, 
        isLoading, 
        error, 
        clearError,
        isReady: !!request,
        redirectUri, // temporarily expose redirectUri for debugging
    };
};
