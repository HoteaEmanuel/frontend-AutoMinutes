import { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

export const useTheme = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  if (!theme) throw new Error('Theme does not exist');

  return { theme, setTheme };
};
