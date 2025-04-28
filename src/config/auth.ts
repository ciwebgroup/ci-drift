export const AUTH_CONFIG = {
  authority: 'https://sso.ciwgserver.com',
  issuer: 'https://sso.ciwgserver.com/application/o/ci-drift/',
  metadata_url: 'https://sso.ciwgserver.com/application/o/ci-drift/.well-known/openid-configuration',
  authorization_endpoint: 'https://sso.ciwgserver.com/application/o/authorize',
  token_endpoint: 'https://sso.ciwgserver.com/application/o/token',
  userinfo_endpoint: 'https://sso.ciwgserver.com/application/o/userinfo',
  end_session_endpoint: 'https://sso.ciwgserver.com/application/o/ci-drift/end-session/',
  client_id: 'ympq8NbcEXPXZZHeySwZf9pOiz1ON2LEJNazIMXp', // Replace with your actual client ID
  client_secret: 'QATWUeScBvxrgHcExG0HW6hZvPlwI4FPsItN9nNTo9tFRSpgGNmdm8ph3CSE1EjgOmlPux87YKxJYRzhUnrqOgRk4oePtQfgKuCt110g3H1UQ8pAVpEuEF1478Bfg0q6',
  redirect_uri: 'https://ci-drift.ciwgserver.com/auth/callback',
  response_type: 'code',
  scope: 'openid profile email',
  popup_width: 600,
  popup_height: 700,
};

export function createPopupWindow(url: string): Window | null {
  const width = AUTH_CONFIG.popup_width;
  const height = AUTH_CONFIG.popup_height;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  return window.open(
    url,
    'oauth-popup',
    `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
  );
}

export async function validateOIDCConfig() {
  try {
    const response = await fetch(AUTH_CONFIG.metadata_url);
    const config = await response.json();
    
    if (!config.authorization_endpoint || !config.token_endpoint) {
      throw new Error('Invalid OIDC configuration');
    }
    
    return config;
  } catch (error) {
    console.error('Failed to validate OIDC configuration:', error);
    throw error;
  }
}
