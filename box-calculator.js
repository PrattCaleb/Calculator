document.getElementById('boxCalculatorForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from reloading the page
    
    // Get user inputs
    const sheetWidth = parseFloat(document.getElementById('sheetWidth').value) || 1;
    const sheetLength = parseFloat(document.getElementById('sheetLength').value) || 1;
    const numberOfBoxes = parseFloat(document.getElementById('numberOfBoxes').value) || 1;

    // Function to convert simplified decimal to traditional decimal
    function convertToTraditionalDecimal(value) {
        const strValue = value.toString();
        const match = strValue.match(/(\d+)(?:\.(\d+))?/);
        if (match) {
            const integerPart = parseInt(match[1]);
            let decimalPart = match[2] || '0';  // Changed from 'const' to 'let'

            // Ensure decimalPart is exactly two digits
            if (decimalPart.length === 1) {
                decimalPart = decimalPart + '0';  // Reassigning decimalPart
            }

            if (decimalPart.length === 2) {
                // Convert simplified decimal
                const fractionMap = {
                    '00': 0,
                    '01': 1 / 16,
                    '02': 2 / 16,
                    '03': 3 / 16,
                    '04': 4 / 16,
                    '05': 5 / 16,
                    '06': 6 / 16,
                    '07': 7 / 16,
                    '08': 8 / 16,
                    '09': 9 / 16,
                    '10': 10 / 16,
                    '11': 11 / 16,
                    '12': 12 / 16,
                    '13': 13 / 16,
                    '14': 14 / 16,
                    '15': 15 / 16
                };
                return integerPart + (fractionMap[decimalPart] || 0);
            } else {
                // Convert traditional decimal
                return parseFloat(strValue);
            }
        }
        return value;
    }

    const sheetWidthInDecimal = convertToTraditionalDecimal(sheetWidth);
    const sheetLengthInDecimal = convertToTraditionalDecimal(sheetLength);

    // Calculate MSF and Lineal Footage for both Width and Length
    const msf = (sheetWidthInDecimal * sheetLengthInDecimal / 144) * numberOfBoxes;
    const linealFootageWidth = (sheetWidthInDecimal / 12) * numberOfBoxes;
    const linealFootageLength = (sheetLengthInDecimal / 12) * numberOfBoxes;

    // Display results
    document.getElementById('msfResult').textContent = `MSF: ${msf.toFixed(2)}`;
    document.getElementById('linealFootageResult').textContent = 
        `Lineal Footage (Width): ${linealFootageWidth.toFixed(2)} | Lineal Footage (Length): ${linealFootageLength.toFixed(2)}`;
});
