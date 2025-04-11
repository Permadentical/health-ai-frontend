type ThemeColors = {
  background: string;
  text: string;
  header: string;
  primary: string;
  accent: string;
  card: string;
  button: string;
  tint: string,
};

const LightColors: ThemeColors = {
  background: '#FFFFFF',
  text: '#00171F',
  header: '#003459',
  primary: '#007EA7',
  accent: '#00A8E8',
  card: '#FFFFFF',
  button: '#003459',
  tint: '#007EA7',
};

const DarkColors: ThemeColors = {
  background: '#00171F',
  text: '#FFFFFF',
  header: '#003459',
  primary: '#00A8E8',
  accent: '#007EA7',
  card: '#003459',
  button: '#00A8E8',
  tint: '#00A8E8',
};

export const Colors: Record<"light" | "dark", ThemeColors> = {
  light: LightColors,
  dark: DarkColors,
};