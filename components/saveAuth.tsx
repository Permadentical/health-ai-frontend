import * as SecureStore from "expo-secure-store";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from "react-native";


export const saveAuth = async (access_token: string, refresh_token: string, user: any) => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem("access_token", access_token);
      await AsyncStorage.setItem("refresh_token", refresh_token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } else {    
      await SecureStore.setItemAsync("access_token", access_token);
      await SecureStore.setItemAsync("refresh_token", refresh_token);
      await SecureStore.setItemAsync("user", JSON.stringify(user));
    }
  } catch (error) {
    console.error("Error saving auth:", error);
    throw error;
  }
};

export const getAuth = async () => {
  if (Platform.OS === 'web') {
    const token = await AsyncStorage.getItem("access_token");
    const refreshToken = await AsyncStorage.getItem("refresh_token");
    const user = await AsyncStorage.getItem("user");
    return { token, refreshToken, user: user ? JSON.parse(user) : null };
  } else {
    const token = await SecureStore.getItemAsync("access_token");
    const user = await SecureStore.getItemAsync("user");
    return {
      token,  
      refreshToken: await SecureStore.getItemAsync("refresh_token"),
      user: user ? JSON.parse(user) : null
  }
  }
};

export const logout = async () => {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("refresh_token");
    await AsyncStorage.removeItem("user");
  } else {
    await SecureStore.deleteItemAsync("refresh_token");
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("user");
  }

};
