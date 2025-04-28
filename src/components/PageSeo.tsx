import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableRow,
    List,
    ListItem,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import TitleIcon from '@mui/icons-material/Title';
import CallToActionIcon from '@mui/icons-material/CallToAction';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import LinkIcon from '@mui/icons-material/Link';
import DescriptionIcon from '@mui/icons-material/Description';
import CodeIcon from '@mui/icons-material/Code';

import { useSeoHeadingStore } from '../store/seoHeadingStore';
import { useSeoMetaStore } from '../store/seoMetaStore';
import { useSeoCtaStore } from '../store/seoCtaStore';
import { useSeoReadabilityStore } from '../store/seoReadabilityStore';
import { useSeoLinkStore } from '../store/seoLinkStore';
import LoadingOverlay from './LoadingOverlay';
import { formatCamelCase } from '../utils/text';
import { CopyableValue } from './CopyableValue';

const PageSeo = () => {
    const headingStore = useSeoHeadingStore();
    const metaStore = useSeoMetaStore();
    const ctaStore = useSeoCtaStore();
    const readabilityStore = useSeoReadabilityStore();
    const linkStore = useSeoLinkStore();
    
    const [linkSearch, setLinkSearch] = useState('');
    const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);

    useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            if (tabs[0]?.url) {
                await Promise.all([
                    headingStore.fetchData(tabs[0].url),
                    metaStore.fetchData(tabs[0].url),
                    ctaStore.fetchData(tabs[0].url),
                    readabilityStore.fetchData(tabs[0].url)
                    // Note: linkStore only loads on demand
                ]);
            }
        });
    }, []);

    const handleRefresh = async (store: any) => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.url) {
            await store.fetchData(tab.url, true);
        }
    };

    const handleLoadLinks = async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.url) {
            await linkStore.fetchData(tab.url, true);
        }
    };

    const filteredLinks = linkStore.data?.links.filter(link => 
        Object.values(link).some(value => 
            String(value).toLowerCase().includes(linkSearch.toLowerCase())
        )
    ) || [];

    const filterNonEmptyValue = (value: any) => 
        value !== null && 
        value !== undefined && 
        value !== '' && 
        !(typeof value === 'object' && Object.keys(value).length === 0);

    const formatJsonLd = (jsonString: string) => {
        try {
            const json = JSON.parse(jsonString);
            return (
                <Box sx={{ 
                    backgroundColor: 'background.paper',
                    p: 2,
                    borderRadius: 1,
                    '& pre': {
                        margin: 0,
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        color: 'success.main'
                    }
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CodeIcon color="primary" />
                        <Typography variant="subtitle2">JSON-LD Schema</Typography>
                    </Box>
                    <pre>{JSON.stringify(json, null, 2)}</pre>
                </Box>
            );
        } catch (e) {
            return <Typography color="error">Invalid JSON-LD format</Typography>;
        }
    };

    return (
        <Box sx={{ p: 3, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Meta Data Card */}
            <Card>
                <CardHeader
                    avatar={<DescriptionIcon color="primary" />}
                    title="Meta Data"
                    action={
                        <IconButton onClick={() => handleRefresh(metaStore)} disabled={metaStore.isLoading}>
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
                    {metaStore.isLoading ? <LoadingOverlay /> : (
                        metaStore.data && (
                            <Box>
                                {Object.entries(metaStore.data)
                                    .filter(([key, value]) => {
                                        const extraFields = ['indexable', 'missingAltAttributes', 'pageSize'];
                                        return filterNonEmptyValue(value) && !extraFields.includes(key);
                                    })
                                    .map(([key, value]) => (
                                    <Accordion 
                                        key={key}
                                        expanded={expandedAccordion === `meta-${key}`}
                                        onChange={(_, isExpanded) => setExpandedAccordion(isExpanded ? `meta-${key}` : false)}
                                    >
                                        <AccordionSummary 
                                            expandIcon={<ExpandMoreIcon />}
                                            sx={{ backgroundColor: 'action.hover' }}
                                        >
                                            <Typography>{formatCamelCase(key)}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {key === 'jsonLd' ? (
                                                formatJsonLd(value as string)
                                            ) : ['title', 'metaTitle', 'metaDescription'].includes(key) ? (
                                                <CopyableValue value={value as string} />
                                            ) : (
                                                <Typography>
                                                    {typeof value === 'boolean' ? value.toString() : value}
                                                </Typography>
                                            )}
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                                
                                {/* Extras Accordion */}
                                <Accordion
                                    expanded={expandedAccordion === 'meta-extras'}
                                    onChange={(_, isExpanded) => setExpandedAccordion(isExpanded ? 'meta-extras' : false)}
                                >
                                    <AccordionSummary 
                                        expandIcon={<ExpandMoreIcon />}
                                        sx={{ backgroundColor: 'action.hover' }}
                                    >
                                        <Typography>Extras</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Table>
                                            <TableBody>
                                                {metaStore.data.indexable !== undefined && (
                                                    <TableRow>
                                                        <TableCell>Indexable</TableCell>
                                                        <TableCell>{metaStore.data.indexable.toString()}</TableCell>
                                                    </TableRow>
                                                )}
                                                {metaStore.data.missingAltAttributes !== undefined && (
                                                    <TableRow>
                                                        <TableCell>Missing Alt Attributes</TableCell>
                                                        <TableCell>{metaStore.data.missingAltAttributes}</TableCell>
                                                    </TableRow>
                                                )}
                                                {metaStore.data.pageSize !== undefined && (
                                                    <TableRow>
                                                        <TableCell>Page Size</TableCell>
                                                        <TableCell>{metaStore.data.pageSize}</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                        )
                    )}
                </CardContent>
            </Card>

            {/* Headings Card */}
            <Card>
                <CardHeader
                    avatar={<TitleIcon color="primary" />}
                    title="Headings"
                    action={
                        <IconButton onClick={() => handleRefresh(headingStore)} disabled={headingStore.isLoading}>
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
                    {headingStore.isLoading ? <LoadingOverlay /> : (
                        headingStore.data && Object.entries(headingStore.data)
                            .filter(([_, data]) => data.count > 0)
                            .map(([heading, data]) => (
                            <Accordion 
                                key={heading}
                                expanded={expandedAccordion === `heading-${heading}`}
                                onChange={(_, isExpanded) => setExpandedAccordion(isExpanded ? `heading-${heading}` : false)}
                            >
                                <AccordionSummary 
                                    expandIcon={<ExpandMoreIcon />}
                                    sx={{ backgroundColor: 'action.hover' }}
                                >
                                    <Typography sx={{ fontWeight: 'medium' }}>
                                        {`${heading.toUpperCase()} (${data.count})`}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <List disablePadding>
                                        {data.text.map((text, i) => (
                                            <ListItem 
                                                key={i}
                                                sx={{
                                                    pl: 2,
                                                    borderLeft: 2,
                                                    borderColor: 'primary.main',
                                                    mb: 1,
                                                    '&:last-child': { mb: 0 },
                                                    backgroundColor: 'background.paper',
                                                    borderRadius: 1
                                                }}
                                            >
                                                <Typography 
                                                    variant="body2"
                                                    sx={{ 
                                                        fontWeight: 'medium',
                                                        color: 'text.primary'
                                                    }}
                                                >
                                                    {text}
                                                </Typography>
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* CTAs Card */}
            <Card>
                <CardHeader
                    avatar={<CallToActionIcon color="primary" />}
                    title="CTAs"
                    action={
                        <IconButton onClick={() => handleRefresh(ctaStore)} disabled={ctaStore.isLoading}>
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
                    {ctaStore.isLoading ? <LoadingOverlay /> : (
                        ctaStore.data && (
                            <Table>
                                <TableBody>
                                    {Object.entries(ctaStore.data).map(([key, value]) => (
                                        <TableRow key={key}>
                                            <TableCell>{formatCamelCase(key)}</TableCell>
                                            <TableCell align="right">{value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )
                    )}
                </CardContent>
            </Card>

            {/* Readability Card */}
            <Card>
                <CardHeader
                    avatar={<SpellcheckIcon color="primary" />}
                    title="Readability"
                    action={
                        <IconButton onClick={() => handleRefresh(readabilityStore)} disabled={readabilityStore.isLoading}>
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
                    {readabilityStore.isLoading ? <LoadingOverlay /> : (
                        readabilityStore.data && (
                            <Table>
                                <TableBody>
                                    {Object.entries(readabilityStore.data).map(([key, value]) => (
                                        <TableRow key={key}>
                                            <TableCell>{formatCamelCase(key)}</TableCell>
                                            <TableCell align="right">
                                                {typeof value === 'number' ? value.toFixed(2) : value}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )
                    )}
                </CardContent>
            </Card>

            {/* Links Card */}
            <Card>
                <CardHeader
                    avatar={<LinkIcon color="primary" />}
                    title="Link Summary"
                    action={
                        <IconButton 
                            onClick={handleLoadLinks} 
                            disabled={linkStore.isLoading}
                        >
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
                    {linkStore.isLoading ? <LoadingOverlay /> : (
                        <React.Fragment>
                            {linkStore.data?.totals && (
                                <Table>
                                    <TableBody>
                                        {Object.entries(linkStore.data.totals).map(([key, value]) => (
                                            <TableRow key={key}>
                                                <TableCell>{key}</TableCell>
                                                <TableCell align="right">{value}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                            
                            <TextField
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                placeholder="Search links..."
                                value={linkSearch}
                                onChange={(e) => setLinkSearch(e.currentTarget.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                                }}
                            />

                            {filteredLinks.map((link, index) => (
                                <Accordion 
                                    key={index}
                                    expanded={expandedAccordion === `link-${index}`}
                                    onChange={(_, isExpanded) => setExpandedAccordion(isExpanded ? `link-${index}` : false)}
                                >
                                    <AccordionSummary 
                                        expandIcon={<ExpandMoreIcon />}
                                        sx={{ backgroundColor: 'action.hover' }}
                                    >
                                        <Typography>
                                            <a 
                                                href={link.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                            >
                                                {link.content || link.url}
                                            </a>
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Table>
                                            <TableBody>
                                                {Object.entries(link)
                                                    .filter(([_, value]) => filterNonEmptyValue(value))
                                                    .map(([key, value]) => (
                                                    <TableRow key={key}>
                                                        <TableCell>{formatCamelCase(key)}</TableCell>
                                                        <TableCell>
                                                            {typeof value === 'boolean' 
                                                                ? value.toString() 
                                                                : value}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </React.Fragment>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default PageSeo;