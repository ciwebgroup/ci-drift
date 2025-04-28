import React, { useEffect, useState } from 'react';
import { useDnsStore } from '../store/dnsStore';
import LoadingOverlay from './LoadingOverlay';
import { formatDate } from '../utils/dates';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Box,
    Grid2 as Grid,
    List,
    ListItem,
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Tooltip,
    TableContainer,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
} from '@mui/material';
import DnsIcon from '@mui/icons-material/Dns';
import InfoIcon from '@mui/icons-material/Info';
import StorageIcon from '@mui/icons-material/Storage';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import { CopyableValue } from './CopyableValue';

const MxRecord = ({ exchange, priority }: { exchange: string, priority: number }) => (
    <TableContainer>
        <Table size="small">
            <TableRow sx={{ '& td, & th': { border: 0, py: 0.5 } }}>
                <TableCell sx={{ width: '60px' }}>
                    <Tooltip title="MX Priority - Lower numbers have higher priority">
                        <Typography component="span" sx={{ color: 'text.secondary' }}>
                            {priority}
                        </Typography>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    <CopyableValue value={exchange} />
                </TableCell>
            </TableRow>
        </Table>
    </TableContainer>
);

const PageDns = () => {
    const { dnsRecords, whoisData, hosting, extra, isLoading, fetchData } = useDnsStore();
    const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);

    useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            if (tabs[0]?.url) {
                await fetchData(tabs[0].url);
            }
        });
    }, []);

    const handleRefresh = async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.url) {
            await fetchData(tab.url, true); // Force refresh
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {isLoading && <LoadingOverlay />}

            {isLoading ? (
                <Typography>Loading network information...</Typography>
            ) : dnsRecords ? (
                <Box sx={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardHeader
                            avatar={<StorageIcon color="primary" />}
                            title="Hosting Provider"
                            action={
                                <IconButton onClick={handleRefresh} disabled={isLoading}>
                                    <RefreshIcon />
                                </IconButton>
                            }
                            sx={{
                                borderBottom: 2,
                                borderColor: 'grey.200',
                                '& .MuiCardHeader-title': {
                                    typography: 'h6'
                                }
                            }}
                        />
                        <CardContent>
                            <CopyableValue value={hosting || ''} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader
                            avatar={<DnsIcon color="primary" />}
                            title="DNS Records"
                            action={
                                <IconButton onClick={handleRefresh} disabled={isLoading}>
                                    <RefreshIcon />
                                </IconButton>
                            }
                            sx={{
                                borderBottom: 2,
                                borderColor: 'grey.200',
                                '& .MuiCardHeader-title': {
                                    typography: 'h6'
                                }
                            }}
                        />
                        <CardContent>
                            <List>
                                {Object.entries(dnsRecords)
                                    .filter(([_, values]) => values && values.length > 0)
                                    .map(([recordType, values]) => (
                                    <ListItem key={recordType}>
                                        <ListItemText
                                            primary={recordType.toUpperCase()}
                                            secondary={
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                    {values.filter(value => value != null && value !== '').map((value, i) => (
                                                        <Box key={i}>
                                                            {recordType.toLowerCase() === 'mx' ? (
                                                                <MxRecord 
                                                                    exchange={(value as unknown as { exchange: string, priority: number }).exchange} 
                                                                    priority={(value as unknown as { exchange: string, priority: number }).priority} 
                                                                />
                                                            ) : (
                                                                <CopyableValue value={value} />
                                                            )}
                                                        </Box>
                                                    ))}
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader
                            avatar={<InfoIcon color="primary" />}
                            title="WHOIS Data"
                            action={
                                <IconButton onClick={handleRefresh} disabled={isLoading}>
                                    <RefreshIcon />
                                </IconButton>
                            }
                            sx={{
                                borderBottom: 2,
                                borderColor: 'grey.200',
                                '& .MuiCardHeader-title': {
                                    typography: 'h6'
                                }
                            }}
                        />
                        <CardContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                {Object.entries(whoisData || {})
                                    .filter(([_, value]) => value != null && value !== '')
                                    .map(([key, value]) => {
                                        const cleanKey = key.replace(/[<>=]/g, '').trim();
                                        const displayKey = cleanKey.charAt(0).toUpperCase() + cleanKey.slice(1);
                                        return (
                                            <Accordion
                                                key={cleanKey}
                                                expanded={expandedAccordion === cleanKey}
                                                onChange={(_, isExpanded) => setExpandedAccordion(isExpanded ? cleanKey : false)}
                                                sx={{ width: '100%' }}
                                            >
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: 'action.hover' }}>
                                                    <Typography>{displayKey}</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails sx={{ textAlign: 'left' }}>
                                                    <CopyableValue 
                                                        value={typeof value === 'string' ? formatDate(value) : String(value)} 
                                                    />
                                                </AccordionDetails>
                                            </Accordion>
                                        );
                                    })}
                            </Box>
                        </CardContent>
                    </Card>

                    <Card sx={{ height: '100%' }}>
                        <CardHeader
                            avatar={<MoreHorizIcon color="primary" />}
                            title="Extra Info"
                            action={
                                <IconButton onClick={handleRefresh} disabled={isLoading}>
                                    <RefreshIcon />
                                </IconButton>
                            }
                            sx={{
                                borderBottom: 2,
                                borderColor: 'grey.200',
                                '& .MuiCardHeader-title': {
                                    typography: 'h6'
                                }
                            }}
                        />
                        <CardContent>
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    pl: 2,
                                    color: 'text.primary'
                                }}
                            >
                                {extra || ''}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            ) : (
                <Typography variant="body1">No data available</Typography>
            )}
        </Box>
    );
};

export default PageDns;