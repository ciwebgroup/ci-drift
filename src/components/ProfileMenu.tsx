import { useState } from 'preact/hooks';
import { 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  Divider,
  Box,
  Typography 
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuthStore } from '~/store/authStore';
import { Fragment } from 'preact';
import { useTabNavigation } from '~/entries/popup/App';

export default function ProfileMenu({ userImage }: { userImage?: string }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const logout = useAuthStore(state => state.logout);
  const name = useAuthStore(state => state.name);
  const email = useAuthStore(state => state.email);
  const { navigateToTab } = useTabNavigation();

  const handleMenu = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettingsClick = () => {
    handleClose();
    navigateToTab('SETTINGS');
  };

  return (
    <Fragment>
      <IconButton
        onClick={handleMenu}
        size="large"
        color="inherit"
      >
        {userImage ? (
          <Avatar src={userImage} sx={{ width: 32, height: 32 }} />
        ) : (
          <AccountCircleIcon sx={{ width: 32, height: 32 }} />
        )}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 320,
            maxWidth: '100%',
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        disableScrollLock={true} // Add this line to prevent padding-right
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          {userImage ? (
            <Avatar src={userImage} sx={{ width: 48, height: 48 }} />
          ) : (
            <AccountCircleIcon sx={{ width: 48, height: 48 }} />
          )}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {name || 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {email || ''}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={handleSettingsClick}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); logout(); }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
