import { useEffect } from 'react';

export default function AuthCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    // Send message to parent window
    window.opener?.postMessage({
      type: 'oauth-callback',
      code,
      state,
      error,
    }, new URL(window.location.href).origin);
  }, []);

  return <div>Processing authentication...</div>;
}
