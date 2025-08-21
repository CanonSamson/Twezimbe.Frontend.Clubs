export const formatAmount = (num: string, allowNegative: boolean = false) => {
    // Handle empty or invalid input
    if (!num || num === '') return ''

    // Check if the number is negative
    const isNegative = num.startsWith('-')
    
    // Remove any existing commas and non-numeric characters (except decimal point and minus sign if allowed)
    let cleanNum = allowNegative 
        ? num.replace(/[^\d.-]/g, '') 
        : num.replace(/[^\d.]/g, '')

    // If negative is not allowed, remove minus sign
    if (!allowNegative && cleanNum.startsWith('-')) {
        cleanNum = cleanNum.substring(1)
    }

    // Remove the minus sign temporarily for processing
    const numWithoutMinus = cleanNum.replace('-', '')

    // Handle multiple decimal points
    const parts = numWithoutMinus.split('.')
    if (parts.length > 2) {
        const formatted = parts[0] + '.' + parts.slice(1).join('')
        return (isNegative && allowNegative ? '-' : '') + formatted
    }

    // Format with commas - only format the integer part
    if (parts[0]) {
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    
    const result = parts.join('.')
    
    // Add negative sign back if needed
    return (isNegative && allowNegative ? '-' : '') + result
}