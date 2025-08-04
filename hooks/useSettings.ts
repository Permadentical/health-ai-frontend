import Constants from "expo-constants";

// hooks/useSettings.ts
export async function fetchSettings(userId: number, token: string) {

    const { apiBaseUrl } = Constants.expoConfig?.extra ?? {};
  try {
    const res = await fetch(`${apiBaseUrl}/users/${userId}/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const settingsData = await res.json();
      return settingsData;
    } else {
      console.error("Failed to fetch settings");
      return null;
    }
  } catch (e) {
    console.error("Error fetching settings", e);
    return null;
  }
}
