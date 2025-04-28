import { useState } from 'preact/hooks';
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuthStore } from '../store/authStore';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = useAuthStore(state => state.login);
  const isLoading = useAuthStore(state => state.isLoading);
  const loginWithSSO = useAuthStore(state => state.loginWithSSO);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
        '& .MuiPaper-root': {
            p: 2,
            m: 2
        }
      }}
    >
      <Card sx={{ minWidth: 400, width: '100%', mx: 2, position: 'relative' }}>
        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <img src="/icons/logo-red-128.png" alt="Logo" style={{ width: 80 }} />
              <Typography variant="h5" component="h1" sx={{ mt: 2 }}>
                CI Drift Login
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              disabled={isLoading}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              disabled={isLoading}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              disabled={isLoading}
            >
              Sign In
            </Button>

            <Typography 
              variant="body2" 
              sx={{ my: 2, textAlign: 'center' }}
            >
              - OR -
            </Typography>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={loginWithSSO}
              disabled={isLoading}
            >
              Sign In with CI-Connect
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
