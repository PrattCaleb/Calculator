document.getElementById('freightCalculatorForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get input values
    const qtyBoxes = parseFloat(document.getElementById('qtyBoxes').value);
    const eaWeight = parseFloat(document.getElementById('eaWeight').value);
    const totalFreight = parseFloat(document.getElementById('totalFreight').value);

    // Debugging outputs
    console.log('qtyBoxes:', qtyBoxes);
    console.log('eaWeight:', eaWeight);
    console.log('totalFreight:', totalFreight);

    // Check if values are valid numbers
    if (isNaN(qtyBoxes) || isNaN(eaWeight) || isNaN(totalFreight) || qtyBoxes <= 0 || eaWeight <= 0 || totalFreight <= 0) {
        document.getElementById('deliveredCostResult').textContent = 'Please enter valid numbers greater than zero.';
        return;
    }

    // Calculate Delivered Cost
    const deliveredCost = (totalFreight / qtyBoxes / eaWeight) * 100000;

    // Display result
    document.getElementById('deliveredCostResult').textContent = `Delivered Cost: $${deliveredCost.toFixed(2)}`;
});
