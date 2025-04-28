import { Component } from 'preact';
import { Alert, Box } from '@mui/material';

interface Props {
  children: any;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { 
    hasError: false,
    error: undefined
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">
            Something went wrong. Please refresh the extension.
            {this.state.error && (
              <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error.message}</pre>
            )}
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
