export interface WpConfig {
  restUrl: string;
  nonce: string;
  userId: number;
  isLoggedIn: boolean;
}

declare global {
  interface Window {
    vamosp2Config?: WpConfig;
  }
}
