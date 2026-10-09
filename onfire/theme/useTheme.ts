import { useColorScheme } from 'react-native';
import { darkTheme } from './dark';
import { lightTheme } from './light';
import { useSettingsStore } from '../store/settingsStore';

export const useTheme = () => {
  const settingsTheme = useSettingsStore((state) => state.theme);
  const systemTheme = useColorScheme();
  
  const currentTheme = settingsTheme === 'system' ? systemTheme : settingsTheme;
  
  return currentTheme === 'light' ? lightTheme : darkTheme;
};
