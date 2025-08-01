import * as SecureStore from "expo-secure-store";

export const saveAuth = async (token: string, user: any) => {
  await SecureStore.setItemAsync("token", token);
  await SecureStore.setItemAsync("user", JSON.stringify(user));
};

export const getAuth = async () => {
  const token = await SecureStore.getItemAsync("token");
  const user = await SecureStore.getItemAsync("user");
  return { token, user: user ? JSON.parse(user) : null };
};

export const logout = async () => {
  await SecureStore.deleteItemAsync("token");
  await SecureStore.deleteItemAsync("user");
};
