import { AUTH_CONFIG, validateOIDCConfig, createPopupWindow } from '../config/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import browser from "webextension-polyfill";
import { gatherAndSendData } from '../entries/background/main';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: string | null;
  userImage?: string;
  email?: string;
  name?: string;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithSSO: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      email: undefined,
      name: undefined,

      login: async (username: string, password: string) => {
        console.log('Login attempt for:', username);
        set({ isLoading: true });
        try {
          // TODO: Implement actual authentication logic here
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
          set({ 
            isAuthenticated: true,
            user: username,
          });
          console.log('Login successful');
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({ 
          isAuthenticated: false,
          user: null,
        });
      },

      loginWithSSO: async () => {
        try {
          const oidcConfig = await validateOIDCConfig();
          const state = crypto.randomUUID();
          const params = new URLSearchParams({
            client_id: AUTH_CONFIG.client_id,
            redirect_uri: AUTH_CONFIG.redirect_uri,
            response_type: AUTH_CONFIG.response_type,
            scope: AUTH_CONFIG.scope,
            state,
          });

          const authUrl = `${oidcConfig.authorization_endpoint}?${params.toString()}`;
          const popupWindow = createPopupWindow(authUrl);
          
          if (!popupWindow) {
            throw new Error('Failed to open popup window');
          }

          // Listen for messages from the background script
          const handleCallback = async (message: any) => {
            if (message.type !== 'oauth-callback') return;
            if (message.state !== state) return;

            browser.runtime.onMessage.removeListener(handleCallback);
            popupWindow.close();

            if (message.error) {
              throw new Error(message.error);
            }

            try {
              // Exchange code for tokens
              const tokenResponse = await fetch(oidcConfig.token_endpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Accept': 'application/json'
                },
                body: new URLSearchParams({
                  grant_type: 'authorization_code',
                  code: message.code,
                  redirect_uri: AUTH_CONFIG.redirect_uri,
                  client_id: AUTH_CONFIG.client_id,
                  client_secret: AUTH_CONFIG.client_secret, // Make sure this is set in auth config
                }),
              });

              if (!tokenResponse.ok) {
                const errorText = await tokenResponse.text();
                throw new Error(`Token endpoint failed: ${tokenResponse.status} ${errorText}`);
              }

              const tokens = await tokenResponse.json();
              
              if (!tokens.access_token) {
                throw new Error('No access token received');
              }

              // Fetch user profile with retry
              const maxRetries = 3;
              let attempt = 0;
              let userInfo;

              while (attempt < maxRetries) {
                const userInfoResponse = await fetch(oidcConfig.userinfo_endpoint, {
                  headers: {
                    'Authorization': `Bearer ${tokens.access_token}`,
                    'Accept': 'application/json'
                  },
                });

                if (userInfoResponse.ok) {
                  userInfo = await userInfoResponse.json();
                  break;
                }

                attempt++;
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
              }

              if (!userInfo) {
                throw new Error('Failed to fetch user info after multiple attempts');
              }

              set({ 
                isAuthenticated: true,
                user: userInfo.preferred_username || userInfo.email,
                email: userInfo.email,
                name: userInfo.name,
                userImage: userInfo.picture,
              });
              
              await gatherAndSendData('sso-login');
            } catch (error) {
              console.error('Failed to fetch user profile:', error);
              throw error;
            }
          };

          browser.runtime.onMessage.addListener(handleCallback);
        } catch (error) {
          console.error('SSO login failed:', error);
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage'
    }
  )
);