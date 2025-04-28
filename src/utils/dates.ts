const CHARS_TO_STRIP = ['>', '<', '='];

const cleanString = (str: string): string => {
    return str.split('').filter(char => !CHARS_TO_STRIP.includes(char)).join('').trim();
};

export const formatDate = (dateStr: string) => {
    if (!dateStr) return dateStr;
    
    const cleanDateStr = cleanString(dateStr);
    if (!cleanDateStr.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)) {
        return cleanDateStr;
    }
    
    const date = new Date(cleanDateStr);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric'
    }) + ' - ' + date.toLocaleTimeString('en-US');
};