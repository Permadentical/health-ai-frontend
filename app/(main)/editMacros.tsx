import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { AuthContext } from "@/providers/AuthProvider";
import Constants from "expo-constants";

export default function EditMacros() {
  const { user, macros, setMacros } = useContext(AuthContext);
  const { apiBaseUrl } = Constants.expoConfig?.extra ?? {};

  const [form, setForm] = useState({
    daily_calorie_goal: "",
    carbs_goal: "",
    protein_goal: "",
    fat_goal: "",
  });

  useEffect(() => {
    if (macros) {
      setForm({
        daily_calorie_goal: macros.daily_calorie_goal.toString(),
        carbs_goal: macros.carbs_goal.toString(),
        protein_goal: macros.protein_goal.toString(),
        fat_goal: macros.fat_goal.toString(),
      });
    }
  }, [macros]);

  const handleChange = (key: keyof typeof form, value: string) => {
    if (/^\d*$/.test(value)) {
      setForm({ ...form, [key]: value });
    }
  };

  const submit = async () => {
    if (
      !form.daily_calorie_goal ||
      !form.carbs_goal ||
      !form.protein_goal ||
      !form.fat_goal
    ) {
      Alert.alert("Error", "Please fill in all macro goals.");
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/macros/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          daily_calorie_goal: parseInt(form.daily_calorie_goal, 10),
          carbs_goal: parseInt(form.carbs_goal, 10),
          protein_goal: parseInt(form.protein_goal, 10),
          fat_goal: parseInt(form.fat_goal, 10),
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      Alert.alert("Success", "Macros updated successfully.");
      setMacros(data);
    } catch (error: any) {
      Alert.alert("Failed", `Update failed: ${error.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Edit Your Macro Goals</Text>

          {[
            { label: "Daily Calorie Goal (kcal)", key: "daily_calorie_goal" },
            { label: "Carbohydrates Goal (g)", key: "carbs_goal" },
            { label: "Protein Goal (g)", key: "protein_goal" },
            { label: "Fat Goal (g)", key: "fat_goal" },
          ].map(({ label, key }) => (
            <View key={key} style={styles.inputGroup}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                keyboardType="numeric"
                value={form[key]}
                onChangeText={(text) => handleChange(key as any, text)}
                style={styles.input}
                placeholder="Enter a number"
                placeholderTextColor="#999"
              />
            </View>
          ))}

          <TouchableOpacity style={styles.button} onPress={submit} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  flex: {
    flex: 1,
  },
  container: {
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 32,
    color: "#222",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 22,
  },
  label: {
    fontSize: 16,
    color: "#444",
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 18,
    backgroundColor: "#fff",
    color: "#111",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#4f46e5",
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
  },
});
