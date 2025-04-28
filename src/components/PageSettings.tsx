import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  FormGroup, 
  FormControlLabel, 
  Checkbox,
  Divider
} from '@mui/material';
import { useSettingsStore } from '~/store/settingsStore';
import { tabs } from '~/entries/popup/App';

const PageSettings = () => {
  const { hiddenTabs, setHiddenTabs } = useSettingsStore();

  const handleTabToggle = (tabLabel: string) => {
    const newHiddenTabs = hiddenTabs.includes(tabLabel)
      ? hiddenTabs.filter(t => t !== tabLabel)
      : [...hiddenTabs, tabLabel];
    setHiddenTabs(newHiddenTabs);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" color="primary" gutterBottom>
            Display & Layout
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Hidden Tabs
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select which tabs you want to hide from the main navigation
            </Typography>
            
            <FormGroup>
              {tabs.map((tab) => (
                <FormControlLabel
                  key={tab.label}
                  control={
                    <Checkbox
                      checked={hiddenTabs.includes(tab.label)}
                      onChange={() => handleTabToggle(tab.label)}
                    />
                  }
                  label={tab.label}
                />
              ))}
            </FormGroup>
          </Box>
        </CardContent>
      </Card>

      {/* Future settings sections will go here */}
    </Box>
  );
};

export default PageSettings;
