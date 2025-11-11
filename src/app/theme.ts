import { createTheme, Theme } from '@mui/material/styles';
import { useMemo, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark';

export function useThemeMode(): [ThemeMode, (mode: ThemeMode) => void] {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('themeMode');
    return (saved as ThemeMode) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  return [mode, setModeState];
}

export function useAppTheme(mode: ThemeMode): Theme {
  return useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#dc004e',
          },
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                zIndex: 1201,
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                width: 240,
              },
            },
          },
        },
      }),
    [mode]
  );
}
