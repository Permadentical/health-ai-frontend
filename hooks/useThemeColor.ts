/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {

  // const { settings } = useContext(AuthContext);
  // if (settings?.theme) {
  //   const theme = settings.theme === 'dark' ? 'dark' : 'light';
  //   const colorFromProps = props[theme];

  //   if (colorFromProps) {
  //     return colorFromProps;
  //   } else {
  //     return Colors[theme][colorName];
  //   }
  // }
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
