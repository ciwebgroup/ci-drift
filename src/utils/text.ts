export const formatCamelCase = (text: string): string => {
  return text
    // Insert space before capital letters
    .replace(/([A-Z])/g, ' $1')
    // Handle consecutive capitals (e.g., "JSON" in "JSONData")
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    // Capitalize first letter and trim spaces
    .replace(/^./, str => str.toUpperCase())
    .trim();
};
