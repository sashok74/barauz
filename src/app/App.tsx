import { useMemo, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FactoryIcon from '@mui/icons-material/Factory';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LanguageIcon from '@mui/icons-material/Language';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';
import { useThemeMode, useAppTheme } from './theme';
import { router } from './routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [themeMode, setThemeMode] = useThemeMode();
  const theme = useAppTheme(themeMode);
  const { t, i18n } = useTranslation();
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLangAnchorEl(null);
  };

  const changeLanguage = (lng: string) => {
    void i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    handleLanguageMenuClose();
  };

  const menuItems = useMemo(
    () => [
      {
        id: 'sales-orders',
        label: t('menu.salesOrders'),
        icon: <ShoppingCartIcon />,
        path: '/sales-orders',
      },
      { id: 'production', label: t('menu.production'), icon: <FactoryIcon />, path: '/production' },
    ],
    [t]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <Box sx={{ display: 'flex' }}>
          <AppBar position="fixed">
            <Toolbar>
              <IconButton
                color="inherit"
                onClick={() => setDrawerOpen(!drawerOpen)}
                edge="start"
                sx={{ mr: 2 }}
                data-testid="menu-toggle"
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                ERP System
              </Typography>
              <IconButton
                color="inherit"
                onClick={handleLanguageMenuOpen}
                data-testid="language-toggle"
              >
                <LanguageIcon />
              </IconButton>
              <Menu
                anchorEl={langAnchorEl}
                open={Boolean(langAnchorEl)}
                onClose={handleLanguageMenuClose}
              >
                <MenuItem onClick={() => changeLanguage('en')} data-testid="lang-en">
                  English
                </MenuItem>
                <MenuItem onClick={() => changeLanguage('ru')} data-testid="lang-ru">
                  Русский
                </MenuItem>
              </Menu>
              <IconButton color="inherit" onClick={toggleTheme} data-testid="theme-toggle">
                {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer variant="persistent" open={drawerOpen} data-testid="drawer">
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
              <List>
                {menuItems.map((item) => (
                  <ListItem key={item.id} disablePadding>
                    <ListItemButton component="a" href={item.path} data-testid={`menu-${item.id}`}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              ml: drawerOpen ? '240px' : 0,
              transition: 'margin 0.3s',
            }}
          >
            <Toolbar />
            <RouterProvider router={router} />
          </Box>
        </Box>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
