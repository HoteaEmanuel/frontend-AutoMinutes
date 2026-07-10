import { createContext, ReactNode, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({
  theme: 'light',
  setTheme: () => {},
});

const getTheme = (t: Theme) => {
  if (t === 'system')
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  return t;
};

const applyTheme = (t: Theme) => {
  document.documentElement.classList.toggle('dark', getTheme(t) === 'dark');
};

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) ?? 'system',
  );

  const setTheme = (t: Theme) => {
    localStorage.setItem('theme', t);
    setThemeState(t);
  };

  // Reflecta schimbarile de tema ale OS ului
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};
