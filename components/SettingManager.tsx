import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const saveSettings = async (settings: any) => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem("settings", JSON.stringify(settings));
    } else {
      await SecureStore.setItemAsync("settings", JSON.stringify(settings));
    }
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error;
  }
}

export const getSettings = async () => {
  try {
    if (Platform.OS === 'web') {
      const settings = await AsyncStorage.getItem("settings");
      return settings ? JSON.parse(settings) : null;
    } else {
      const settings = await SecureStore.getItemAsync("settings");
      return settings ? JSON.parse(settings) : null;
    }
  } catch (error) {
    console.error("Error retrieving settings:", error);
    throw error;
  }
};

export const delSettings = async () => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem("settings");
    } else {
      await SecureStore.deleteItemAsync("settings");
    }
  } catch (error) {
    console.error("Error deleting settings:", error);
    throw error;
  }
}