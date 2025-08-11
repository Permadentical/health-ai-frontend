import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";


export const saveMacros = async (macros: any) => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem("macros", JSON.stringify(macros));
    } else {
      await SecureStore.setItemAsync("macros", JSON.stringify(macros));
    }
  } catch (error) {
    console.error("Error saving macros:", error);
    throw error;
  }
}


export const getMacros = async () => {
  try {
    if (Platform.OS === 'web') {
      const macros = await AsyncStorage.getItem("macros");
      return macros ? JSON.parse(macros) : null;
    } else {
      const macros = await SecureStore.getItemAsync("macros");
      return macros ? JSON.parse(macros) : null;
    }
  } catch (error) {
    console.error("Error retrieving macros:", error);
    throw error;
  }
};


export const delMacros = async () => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem("macros");
    } else {
      await SecureStore.deleteItemAsync("macros");
    }
  } catch (error) {
    console.error("Error deleting macros:", error);
    throw error;
  }
}