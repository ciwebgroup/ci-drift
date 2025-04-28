import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';
import { useState } from 'preact/hooks';

/**
 * QA Accordion Item
 */
const QaItem = ({ 
    children,
    expanded,
    handleChange,
    key,
    title,
    subTitle,
    status 
}: {
    children: React.ReactNode;
    expanded: string;
    handleChange: Function;
    key: string;
    title: string;
    subTitle: string;
    status?: string
}) => {
    const statusClass = `qa-item-${status}`;

    return (
        <Accordion expanded={expanded === key} onChange={handleChange(key)} className={statusClass}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                sx={{ alignItems: "center" }}
            >
                <Indicator status="success" message="Success" />
                <Typography component="span" sx={{ width: '33%', flexShrink: 0 }}>
                    {title}
                </Typography>
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                    {subTitle}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    );
}


/**
 * QA Component to indicate the status of a task or feature.
 * It should a property similar to alert boxes: success, error, warning, info
 * and have an optional tooltip/title message.
 */
const Indicator = ({ status, message }: { status: string; message?: string }) => {
    const statusClass = `indicator-${status}`;

    const backgroundColor = 
        status === "success" ? "#4caf50" :
        status === "error" ? "#f44336" :
        status === "warning" ? "#ff9800" :
        status === "info" ? "#2196f3" : "#9e9e9e";

    return (
        <Box component="div" title={status} sx={{
            height: "15px",
            width: "15px",
            backgroundColor,
            borderRadius: "50%",
            marginRight: "10px",
            display: "inline-block",
            verticalAlign: "middle"
        }}></Box>
    );
}

// @NOTE: All service area pages should have service page links associated with them
// @IDEA: Lots of tickets where client says "We want to remove the word: 'plumbing' from the entire website."

const PageQa = () => {
    const [expanded, setExpanded] = useState<string>("");

    const handleChange = (panel: string) => (event: Event, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : "");
    };

    return (
        <div className="page-qa">
            <Typography component="h2" sx={{ fontWeight: "bold", mt: "1rem" }}>
                Issue Summary
            </Typography>

            <Box sx={{ textAlign: "left", m: "1rem 0", p: "1rem", border: "1px solid #ccc", borderRadius: "5px" }}>

                <Typography component="h3" sx={{ fontWeight: "bold", mt: "1rem" }}>
                    Link Issues
                </Typography>
                <QaItem 
                    key='link-issues' 
                    expanded={expanded} 
                    handleChange={handleChange} 
                    title='404 Links' 
                    subTitle='0' 
                    status='success'
                >
                    <Typography>
                        List of links; and linked text
                    </Typography>
                </QaItem>
                
                <Accordion expanded={expanded === 'link-context-issues'} onChange={handleChange('link-context-issues')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        sx={{ alignItems: "center" }}
                    >
                        <Indicator status="" message="Success" />
                        <Typography component="span" sx={{ width: '33%', flexShrink: 0 }}>
                            Link Context Issues
                        </Typography>
                        <Typography component="span" sx={{ color: 'text.secondary' }}>
                            0
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {/* @TODO: if there are no link context issues, hide this section */}
                        <Typography>
                            List of links; and linked text
                        </Typography>
                    </AccordionDetails>
                </Accordion>



                <Typography component="h3" sx={{ fontWeight: "bold", mt: "1rem" }}>
                    Content Issues
                </Typography>
                <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                    >
                    <Typography component="span" sx={{ width: '33%', flexShrink: 0 }}>
                        Users
                    </Typography>
                    <Typography component="span" sx={{ color: 'text.secondary' }}>
                        You are currently not an owner
                    </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography>
                        Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus,
                        varius pulvinar diam eros in elit. Pellentesque convallis laoreet
                        laoreet.
                    </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3bh-content"
                    id="panel3bh-header"
                    >
                    <Typography component="span" sx={{ width: '33%', flexShrink: 0 }}>
                        Advanced settings
                    </Typography>
                    <Typography component="span" sx={{ color: 'text.secondary' }}>
                        Filtering has been entirely disabled for whole web server
                    </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography>
                        Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                        amet egestas eros, vitae egestas augue. Duis vel est augue.
                    </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4bh-content"
                    id="panel4bh-header"
                    >
                    <Typography component="span" sx={{ width: '33%', flexShrink: 0 }}>
                        Personal data
                    </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography>
                        Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                        amet egestas eros, vitae egestas augue. Duis vel est augue.
                    </Typography>
                    </AccordionDetails>
                </Accordion>
                <div>404s</div>
                <div>
                    Out of Context
                    Help Context: 
                </div>

                <h3>Heading Issues</h3>
                <div>
                    Linked Headings
                    {/* Count / Expandable */}
                </div>
                <div>
                    Single H1 Tag
                    {/* Pass or Fail */}
                </div>

                <h3>Content</h3>
                <div>- Lorim Ipsum Text Detection</div>
                <div>- Spelling</div>

            </Box>
        </div>
    );
}

export default PageQa;