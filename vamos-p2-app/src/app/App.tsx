import { HashRouter } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ConfigProvider, theme as antTheme } from 'antd';
import { AuthContext, type AuthContextValue } from '../features/auth/useAuth';
import { ToastProvider } from '../shared/components/Toast/Toast';
import { UserActivitiesProvider } from '../shared/store/userActivitiesStore';
import { apiLogin, apiRegister, apiLogout, apiGetCurrentUser } from '../features/auth/authApi';
import { AppRouter } from './Router';
import type { User } from '../shared/types/user';
import '../styles/global.css';

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [nonce, setNonce] = useState(window.vamosp2Config?.nonce ?? '');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const config = window.vamosp2Config;
    if (!config?.isLoggedIn) {
      setIsLoading(false);
      return;
    }
    apiGetCurrentUser(config.nonce)
      .then(u => { setUser(u); setIsLoggedIn(true); })
      .catch(() => { /* not logged in */ })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const result = await apiLogin(username, password);
    setNonce(result.nonce);
    // Update the global config nonce for subsequent requests
    if (window.vamosp2Config) window.vamosp2Config.nonce = result.nonce;
    const currentUser = await apiGetCurrentUser(result.nonce);
    setUser(currentUser);
    setIsLoggedIn(true);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const result = await apiRegister(username, email, password);
    setNonce(result.nonce);
    if (window.vamosp2Config) window.vamosp2Config.nonce = result.nonce;
    const currentUser = await apiGetCurrentUser(result.nonce);
    setUser(currentUser);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(async () => {
    await apiLogout(nonce);
    setUser(null);
    setNonce('');
    setIsLoggedIn(false);
  }, [nonce]);

  const refreshNonce = useCallback((newNonce: string) => {
    setNonce(newNonce);
    if (window.vamosp2Config) window.vamosp2Config.nonce = newNonce;
  }, []);

  const value: AuthContextValue = { user, nonce, isLoggedIn, isLoading, login, register, logout, refreshNonce };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function App() {
  return (
    <HashRouter>
      <ConfigProvider
        theme={{
          algorithm: antTheme.defaultAlgorithm,
          token: {
            colorPrimary: '#E31E24',
            fontFamily: "'Sansation', Arial, sans-serif",
            borderRadius: 10,
            colorBgBase: '#FFFFFF',
            colorTextBase: '#111827',
          },
        }}
      >
        <AuthProvider>
          <UserActivitiesProvider>
            <ToastProvider>
              <AppRouter />
            </ToastProvider>
          </UserActivitiesProvider>
        </AuthProvider>
      </ConfigProvider>
    </HashRouter>
  );
}
