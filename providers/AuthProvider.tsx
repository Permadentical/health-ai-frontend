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

import { getAuth, delAuth } from "@/components/saveAuth";

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
          } else {
            setUser(null);
            await delAuth();
          }
        } catch (e) {
          setUser(null);
          await delAuth();
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

