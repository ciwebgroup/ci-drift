chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.url.startsWith('https://ci-drift.ciwgserver.com/auth/callback')) {
    const url = new URL(details.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    // Send message to the extension popup
    chrome.runtime.sendMessage({
      type: 'oauth-callback',
      code,
      state,
      error
    });

    // Prevent the actual navigation
    chrome.tabs.remove(details.tabId);
  }
});
