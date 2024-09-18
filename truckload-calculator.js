const truckDimensions = {
    length: 53 * 12, // converting feet to inches
    width: 100,
    height: 110
};

document.getElementById('calculatorForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const unitWidth = parseFloat(parseInput(document.getElementById('width').value));
    const unitLength = parseFloat(parseInput(document.getElementById('length').value));
    const unitHeight = parseFloat(parseInput(document.getElementById('height').value)) || 48;
    const boxesPerUnit = parseInt(document.getElementById('quantity').value) || 1;
    const tolerance = parseFloat(parseInput(document.getElementById('tolerance').value)) || 0;
    const doubleStack = document.getElementById('doubleStack').checked;
    const pinwheel = document.getElementById('pinwheel').checked;
    const downstacking = document.getElementById('downstacking').checked;

    // Adjust truck dimensions with tolerance
    const usableTruckLength = truckDimensions.length - (2 * tolerance);
    const usableTruckWidth = truckDimensions.width - (2 * tolerance);

    // Calculate units for both L+L and W+W orientations
    const orientation1 = calculateUnits(usableTruckLength, usableTruckWidth, unitLength, unitWidth, doubleStack); // L+L
    const orientation2 = calculateUnits(usableTruckLength, usableTruckWidth, unitWidth, unitLength, doubleStack); // W+W

    let totalBoxesOrientation1 = orientation1.units * boxesPerUnit;
    let totalBoxesOrientation2 = orientation2.units * boxesPerUnit;

    let totalUnitsOrientation1 = orientation1.units;
    let totalUnitsOrientation2 = orientation2.units;

    let pinwheelUnits = { units: 0 }; // Pinwheel will only be shown if checkbox is checked
    let totalBoxesPinwheel = 0;

    if (pinwheel) {
        // Check if pinwheeling is possible
        if (unitWidth + unitLength > usableTruckWidth) {
            document.getElementById('pinwheelResult').textContent = "Units are too big to be pinwheeled.";
        } else {
            pinwheelUnits = calculatePinwheelUnits(usableTruckLength, usableTruckWidth, unitWidth, unitLength, doubleStack);
            totalBoxesPinwheel = pinwheelUnits.units * boxesPerUnit;
            // Apply downstacking to pinwheel result
            if (downstacking) {
                const boxesToRemove = 2 * boxesPerUnit;
                totalBoxesPinwheel -= boxesToRemove;
                pinwheelUnits.units -= 2; // Reduce total units by 2
            }
            document.getElementById('pinwheelResult').textContent = `Pinwheel (L+W alternating): ${pinwheelUnits.units} units, Total boxes on truck: ${totalBoxesPinwheel}`;
        }
    } else {
        document.getElementById('pinwheelResult').textContent = ''; // Hide result if pinwheel is not selected
    }

    // Apply downstacking if selected
    if (downstacking) {
        const boxesToRemove = 2 * boxesPerUnit;
        totalBoxesOrientation1 -= boxesToRemove;
        totalBoxesOrientation2 -= boxesToRemove;
        totalUnitsOrientation1 -= 2;
        totalUnitsOrientation2 -= 2;
    }

    // Display results for all orientations
    document.getElementById('orientation1Result').textContent = `Orientation 1 (W+W): ${totalUnitsOrientation1} units, Total boxes on truck: ${totalBoxesOrientation1}`;
    document.getElementById('orientation2Result').textContent = `Orientation 2 (L+L): ${totalUnitsOrientation2} units, Total boxes on truck: ${totalBoxesOrientation2}`;

    // Generate shareable link logic
    document.getElementById('shareBtn').addEventListener('click', () => {
        const shareLink = generateShareLink({
            unitWidth, unitLength, unitHeight, boxesPerUnit, tolerance, doubleStack, pinwheel, downstacking
        });
        document.getElementById('shareLink').textContent = `Shareable link: ${shareLink}`;
    });
});

function parseInput(value) {
    return convertToTraditionalDecimal(value);
}

// Function to convert simplified decimal to traditional decimal
function convertToTraditionalDecimal(value) {
    const strValue = value.toString();
    const match = strValue.match(/(\d+)(?:\.(\d+))?/);
    if (match) {
        const integerPart = parseInt(match[1]);
        const decimalPart = match[2] || '0';

        if (decimalPart.length <= 2) {
            // Convert simplified decimal
            const fractionMap = {
                '01': 1/16,
                '02': 2/16,
                '03': 3/16,
                '04': 4/16,
                '05': 5/16,
                '06': 6/16,
                '07': 7/16,
                '08': 8/16,
                '09': 9/16,
                '10': 10/16,
                '11': 11/16,
                '12': 12/16,
                '13': 13/16,
                '14': 14/16,
                '15': 15/16
            };
            return integerPart + (fractionMap[decimalPart] || 0);
        } else {
            return parseFloat(strValue);
        }
    }
    return 0;
}

function calculateUnits(truckLength, truckWidth, unitLength, unitWidth, doubleStack) {
    const unitsLengthwise = Math.floor(truckLength / unitLength);
    const unitsWidthwise = Math.floor(truckWidth / unitWidth);

    let unitsPerLayer = unitsLengthwise * unitsWidthwise;

    const totalUnits = doubleStack ? unitsPerLayer * 2 : unitsPerLayer;
    return { units: totalUnits };
}

function calculatePinwheelUnits(truckLength, truckWidth, unitWidth, unitLength, doubleStack) {
    // Create a 2x2 grid of pinwheeled units
    const pinwheelWidth = Math.max(unitWidth + unitLength, unitLength + unitWidth);
    const pinwheelLength = Math.max(unitLength + unitWidth, unitWidth + unitLength);

    // Calculate how many 2x2 pinwheel grids fit in the truck
    const unitsPerPinwheelGrid = 4;
    const pinwheelUnitsWidthwise = Math.floor(truckWidth / pinwheelWidth);
    const pinwheelUnitsLengthwise = Math.floor(truckLength / pinwheelLength);

    const unitsPerLayer = pinwheelUnitsWidthwise * pinwheelUnitsLengthwise * unitsPerPinwheelGrid;

    const totalUnits = doubleStack ? unitsPerLayer * 2 : unitsPerLayer;
    return { units: totalUnits };
}
