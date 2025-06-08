/**
 * Converts written numbers (e.g., "one", "two", "first", "second") to their numeric values
 * @param text The text containing written numbers
 * @returns The numeric value, or null if no valid number is found
 */
export function convertWrittenNumberToDigit(text: string): number | null {
    // Normalize text to lowercase and remove punctuation
    const normalizedText = text.toLowerCase().replace(/[.,]/g, ' ').trim();
    
    // Map of written numbers to their numeric values
    const numberMap: Record<string, number> = {
        // Cardinal numbers
        'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4,
        'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,
        'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13,
        'fourteen': 14, 'fifteen': 15, 'sixteen': 16, 'seventeen': 17,
        'eighteen': 18, 'nineteen': 19, 'twenty': 20,
        // Ordinal numbers (first, second, etc.)
        'first': 1, 'second': 2, 'third': 3, 'fourth': 4,
        'fifth': 5, 'sixth': 6, 'seventh': 7, 'eighth': 8,
        'ninth': 9, 'tenth': 10, 'eleventh': 11, 'twelfth': 12,
        'thirteenth': 13, 'fourteenth': 14, 'fifteenth': 15,
        'sixteenth': 16, 'seventeenth': 17, 'eighteenth': 18,
        'nineteenth': 19, 'twentieth': 20,
        // Common variations
        'single': 1, 'double': 2, 'triple': 3, 'quadruple': 4,
        'a': 1, 'an': 1
    };

    // Split text into words and look for matches
    const words = normalizedText.split(/\s+/);
    
    // Try to find exact matches first
    for (const word of words) {
        if (word in numberMap) {
            return numberMap[word];
        }
    }

    // Try to find compound numbers (e.g., "twenty one")
    for (let i = 0; i < words.length - 1; i++) {
        const compound = `${words[i]} ${words[i + 1]}`;
        if (compound in numberMap) {
            return numberMap[compound];
        }
    }

    return null;
}

/**
 * Extracts a number from text, handling both numeric and written forms
 * @param text The text to extract a number from
 * @param pattern Optional regex pattern to match before conversion
 * @returns The extracted number, or null if no valid number is found
 */
export function extractNumberFromText(text: string, pattern?: RegExp): number | null {
    if (!text) return null;

    // First try to find a numeric pattern if provided
    if (pattern) {
        const match = text.match(pattern);
        if (match) {
            const num = parseFloat(match[1]);
            if (!isNaN(num)) {
                return num;
            }
        }
    }

    // Try to find written numbers
    return convertWrittenNumberToDigit(text);
}

// Export the module
export default {
    convertWrittenNumberToDigit,
    extractNumberFromText
}; 