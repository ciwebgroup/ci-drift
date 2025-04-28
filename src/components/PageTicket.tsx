import { useState } from 'preact/hooks';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Typography,
  Stack,
  SelectChangeEvent,
  Alert,
  Snackbar
} from '@mui/material';



const TICKET_TYPES = {
  bug: {
    label: 'Bug Report',
    subtypes: [
      { value: 'visual', label: 'Visual Bug' },
      { value: 'functionality', label: 'Functionality Issue' },
      { value: 'performance', label: 'Performance Issue' },
      { value: 'security', label: 'Security Concern' }
    ]
  },
  design: {
    label: 'Design Request',
    subtypes: [
      { value: 'logo', label: 'Logo Design' },
      { value: 'graphic', label: 'Graphic Design' },
      { value: 'promotion', label: 'Promotional Material' },
      { value: 'ui', label: 'UI/UX Design' },
      { value: 'banner', label: 'Banner/Header Design' }
    ]
  }
};


const PageTicket = () => {
  const [ticketType, setTicketType] = useState('');
  const [subType, setSubType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [includeScreenshot, setIncludeScreenshot] = useState(false);
  const [priority, setPriority] = useState('medium');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleTypeChange = (event: SelectChangeEvent) => {
    setTicketType((event.target as HTMLSelectElement).value);
    setSubType(''); // Reset subtype when type changes
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    const ticketData = {
      type: ticketType,
      subType,
      title,
      description,
      priority,
      includeScreenshot: ticketType === 'bug' && subType === 'visual' ? includeScreenshot : undefined,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };

    // TODO: Implement actual submission logic
    console.log('Submitting ticket:', ticketData);
    
    // Show success message
    setSnackbarOpen(true);
    
    // Reset form
    setTicketType('');
    setSubType('');
    setTitle('');
    setDescription('');
    setIncludeScreenshot(false);
    setPriority('medium');
  };

  return (
    <Card sx={{ textAlign: 'left' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Create New Ticket
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel id="ticket-type-label">Ticket Type</InputLabel>
                <Select
                  labelId="ticket-type-label"
                  value={ticketType}
                  label="Ticket Type"
                  onChange={handleTypeChange}
                  required
                >
                  {Object.entries(TICKET_TYPES).map(([value, { label }]) => (
                    <MenuItem key={value} value={value}>{label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ flex: 1 }}>
                <InputLabel id="subtype-label">Sub Type</InputLabel>
                <Select
                  labelId="subtype-label"
                  value={subType}
                  label="Sub Type"
                  onChange={(e) => setSubType((e.target as HTMLSelectElement).value)}
                  required
                  disabled={!ticketType}
                >
                  {ticketType && TICKET_TYPES[ticketType as keyof typeof TICKET_TYPES].subtypes.map(
                    ({ value, label }) => (
                      <MenuItem key={value} value={value}>{label}</MenuItem>
                    )
                  )}
                </Select>
              </FormControl>

              <FormControl sx={{ flex: 1 }}>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  value={priority}
                  label="Priority"
                  onChange={(e) => setPriority((e.target as HTMLSelectElement).value)}
                  required
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              required
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              required
            />

            {ticketType === 'bug' && subType === 'visual' && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeScreenshot}
                    onChange={(e) => setIncludeScreenshot((e.target as HTMLInputElement).checked)}
                  />
                }
                label="Include screenshot of current page"
              />
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Submit Ticket
            </Button>
          </Stack>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert 
            onClose={() => setSnackbarOpen(false)} 
            severity="success"
            sx={{ width: '100%' }}
          >
            Ticket submitted successfully!
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default PageTicket;
