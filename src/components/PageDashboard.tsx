import { Box, Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DnsIcon from '@mui/icons-material/Dns';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import GradingIcon from '@mui/icons-material/Grading';
import SpeedIcon from '@mui/icons-material/Speed';
import RuleIcon from '@mui/icons-material/Rule';

const PageDashboard = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Welcome to CI Drift
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        CI Drift is a comprehensive web analysis tool that helps you inspect and analyze various aspects of web pages. Use the tabs above to access different analysis tools:
                    </Typography>

                    <List>
                        <ListItem>
                            <ListItemIcon><DnsIcon color="primary" /></ListItemIcon>
                            <ListItemText 
                                primary="DNS Analysis" 
                                secondary="Examine DNS records, WHOIS data, and hosting information"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><ManageSearchIcon color="primary" /></ListItemIcon>
                            <ListItemText 
                                primary="SEO Analysis" 
                                secondary="Review meta tags, headings, links, and content structure"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><GradingIcon color="primary" /></ListItemIcon>
                            <ListItemText 
                                primary="Content Analysis" 
                                secondary="Analyze page content, readability, and structure"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><SpeedIcon color="primary" /></ListItemIcon>
                            <ListItemText 
                                primary="Speed Analysis" 
                                secondary="Check page load times and performance metrics"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><RuleIcon color="primary" /></ListItemIcon>
                            <ListItemText 
                                primary="Quality Assurance" 
                                secondary="Verify content quality and technical requirements"
                            />
                        </ListItem>
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
};

export default PageDashboard;
