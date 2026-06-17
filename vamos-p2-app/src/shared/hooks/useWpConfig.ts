import type { WpConfig } from '../types/wp';

const DEFAULT_CONFIG: WpConfig = {
  restUrl: '/wp-json/',
  nonce: '',
  userId: 0,
  isLoggedIn: false,
};

export function useWpConfig(): WpConfig {
  return window.vamosp2Config ?? DEFAULT_CONFIG;
}
