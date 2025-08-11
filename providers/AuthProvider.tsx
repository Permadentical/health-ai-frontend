import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

type User = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  id: number;
  // Add other user properties as needed
};

export interface Settings  {
  theme?: string;
  notificationsEnabled?: boolean;
  weight_units?: string;
  length_units?: string;
  id?: number;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  settings: Settings | null;
  setSettings: (settings: Settings | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  setSettings: () => {},
  settings: null,
});

import { getAuth, delAuth } from "@/components/AuthManager";
import { getSettings, saveSettings, delSettings } from "@/components/SettingManager";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { apiBaseUrl } = Constants.expoConfig?.extra ?? {};
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<Settings | null>(null);

  
  useEffect(() => {
    async function loadSettings() {
      try {
        const savedSettings = await getSettings();
        console.log("Loaded settings:", savedSettings);
        setSettings(savedSettings);
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }

    loadSettings();
  }, []);

  useEffect(() => {
    async function loadUser() {
      const { token, user: storedUser } = await getAuth();

      if (token) {
        if (storedUser) {
          setUser(storedUser);
        }

        try {
          const res = await fetch(`${apiBaseUrl}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const userData = await res.json();
            // load user data from backend
            setUser(userData);
          } else {
            setUser(null);
            setSettings(null);
            await delAuth();
            await delSettings();
          }
        } catch (e) {
          setUser(null);
          setSettings(null);
          await delAuth();
          await delSettings();
        }
      } else {
        console.log("you did not login yet");
        setUser(null);
        setSettings(null);
      }

      setIsLoading(false);
    }

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, settings, setSettings}}>
      {children}
    </AuthContext.Provider>
  );
}

