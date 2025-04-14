export type ThemeColors = {
  background: string;
  text: string;
  header: string;
  primary: string;
  accent: string;
  card: string;
  button: string;
  tint: string,
  chatBox: string,
  chatBoxAlernate: string,
  cardAccentOrange: string,
  cardAccentGreen: string,
  cardAccentRed: string,
  cardAccentPurple: string,
  cardAccentYellow: string,
  cardAccentTeal: string,
};

const LightColors: ThemeColors = {
  background: '#F7F7F7',    // off-white background
  text: '#333333',          // dark grey text
  header: '#FFFFFF',        // minimalist header background
  primary: '#1976D2',       // blue accent for primary elements & buttons
  accent: '#2196F3',        // bright blue for additional accents
  card: '#FFFFFF',          // white cards for clarity
  button: '#1976D2',        // buttons using the primary blue
  tint: '#2196F3',          // tint for iconography, etc.
  chatBox: '#25D366',       // preserved chat box color (green)
  chatBoxAlernate: '#FFFFFF', // preserved alternate chat box color
  cardAccentOrange: '#FF9800',
  cardAccentGreen: '#4CAF50',
  cardAccentRed: '#F44336',
  cardAccentPurple: '#9C27B0',
  cardAccentYellow: '#FFEB3B',
  cardAccentTeal: '#00BCD4'
};

const DarkColors: ThemeColors = {
  background: '#121212',    // nearly black background
  text: '#E0E0E0',          // light grey text for contrast
  header: '#1F1F1F',        // dark grey header
  primary: '#1E88E5',       // blue accent suitable for dark theme
  accent: '#42A5F5',        // a lighter blue accent for highlights
  card: '#1F1F1F',          // cards using a slightly lighter dark grey
  button: '#1E88E5',        // matching primary for interactive elements
  tint: '#42A5F5',          // tint for icons and other elements
  chatBox: '#075E54',       // preserved chat box color for dark mode
  chatBoxAlernate: '#2C363F',  // preserved alternate chat box color
  cardAccentOrange: '#F57C00',
  cardAccentGreen: '#43A047',
  cardAccentRed: '#E53935',
  cardAccentPurple: '#8E24AA',
  cardAccentYellow: '#FDD835',
  cardAccentTeal: '#00ACC1'
};

export const Colors: Record<"light" | "dark", ThemeColors> = {
  light: LightColors,
  dark: DarkColors,
};