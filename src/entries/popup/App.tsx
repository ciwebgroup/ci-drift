import ErrorBoundary from '~/components/ErrorBoundary';
import { useAuthStore } from '~/store/authStore';
import LoginPage from '~/components/LoginPage';
import PageContent from "~/components/PageContent";
import "./App.css";
import { Box, Tabs, Tab, AppBar } from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import SpeedIcon from '@mui/icons-material/Speed';
import DnsIcon from '@mui/icons-material/Dns';
import SeoIcon from '@mui/icons-material/ManageSearch';
import QaIcon from '@mui/icons-material/Rule';
import ContentIcon from '@mui/icons-material/Grading';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useState } from "preact/hooks";
import { JSX } from "preact";
import PageDashboard from "~/components/PageDashboard";
import PageDns from "~/components/PageDns";
import PageQa from "~/components/PageQa";
import PageSpeed from "~/components/PageSpeed";
import PageSeo from "~/components/PageSeo";
import PageTicket from "~/components/PageTicket";
import ProfileMenu from '~/components/ProfileMenu';
import { useSettingsStore } from '~/store/settingsStore';
import PageSettings from "~/components/PageSettings";
import SettingsIcon from '@mui/icons-material/Settings';

export const tabs = [
  { 
    icon: <DashboardIcon />,
    label: "DASHBOARD",
    page: <PageDashboard />
  },
  { 
    icon: <DnsIcon />,
    label: "DNS",
    page: <PageDns />
  },{
    icon: <SeoIcon />,
    label: "SEO",
    page: <PageSeo />
  },{
    icon: <ContentIcon />,
    label: "CONTENT",
    page: <PageContent />
  },{
    icon: <SpeedIcon />,
    label: "SPEED",
    page: <PageSpeed />
  },{
    icon: <QaIcon />,
    label: "QA",
    page: <PageQa />
  },{
    icon: <ConfirmationNumberIcon />,
    label: "TICKETS",
    page: <PageTicket />
  },{
    icon: <SettingsIcon />,
    label: "SETTINGS",
    page: <PageSettings />,
    hidden: true // This tab won't show in navigation but can be accessed programmatically
  }
]

// Add this outside the App function to make it accessible to other components
export const useTabNavigation = () => {
  const tabState = useState(0);
  return {
    currentTab: tabState[0],
    setTab: tabState[1],
    navigateToTab: (label: string) => {
      const index = tabs.findIndex(t => t.label === label);
      if (index !== -1) {
        tabState[1](index);
      }
    }
  };
};

function App() {
  const { currentTab: tab, setTab } = useTabNavigation();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const { hiddenTabs } = useSettingsStore();

  const visibleTabs = tabs.filter(t => !hiddenTabs.includes(t.label) && !t.hidden);

  const handleChange = (event: JSX.TargetedEvent<HTMLElement>, newValue: number) => {
    setTab(newValue);
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Box sx={{ width: 768 }} component="main">
      <Box component="header">
        <AppBar position="static" sx={{ py: 0.5, px: 2 }}>
          <Box component="div" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box component="div" sx={{ display: "flex", alignItems: "center" }}>
              <h1>{visibleTabs[tab]?.label}</h1>
            </Box>
            <Box component="div" sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <h1>CI Drift v.0.1</h1>
              <ProfileMenu />
            </Box>
          </Box>
        </AppBar>
        <Tabs value={tab} onChange={handleChange} aria-label="navigation tabs">
          {visibleTabs.map((item, index) => (
            <Tab key={index} icon={item.icon} label={item.label} />
          ))}
        </Tabs>
      </Box>
      <Box component="section" sx={{ padding: 2, backgroundColor: "#f5f5f5", minHeight: "50vh" }}>
        {visibleTabs[tab]?.page}
      </Box>
    </Box>
  );
}

export default function AppWrapper() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
