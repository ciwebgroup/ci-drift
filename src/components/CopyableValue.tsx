import React, { useState } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface CopyableValueProps {
    value: string;
}

export const CopyableValue = ({ value }: CopyableValueProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Tooltip title={copied ? "Copied!" : "Click to copy"}>
            <Box
                onClick={handleCopy}
                sx={{
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                        bgcolor: 'action.hover',
                        borderRadius: 1,
                    },
                    padding: '2px 4px',
                }}
            >
                <Typography component="span">{value}</Typography>
                <ContentCopyIcon sx={{ fontSize: 16, opacity: 0.5 }} />
            </Box>
        </Tooltip>
    );
};
