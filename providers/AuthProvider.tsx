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

type Settings = {
  // 你的设置字段，示例：
  theme?: string;
  notificationsEnabled?: boolean;

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

import { getAuth, logout } from "@/components/saveAuth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { apiBaseUrl } = Constants.expoConfig?.extra ?? {};
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<Settings | null>(null);
  

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
            console.log("userData111", userData);
            setUser(userData);
            // You can handle settings data here if needed
            const setting = await fetch(`${apiBaseUrl}/users/${userData.id}/settings`, {
              headers: { Authorization: `Bearer ${token}` },  
            });
            if (setting.ok) {
              const settingsData = await setting.json();
              console.log("settingsData", settingsData);
              setSettings(settingsData);
              
            } else {
              console.error("Failed to fetch settings");
            }

          } else {
            setUser(null);
            await logout();
          }
        } catch (e) {
          setUser(null);
          await logout();
        }
      } else {
        console.log("you did not login yet");
        setUser(null);
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

