// Unit definitions with conversion factors to base unit
const units = {
    length: {
        name: 'Length',
        baseUnit: 'metres',
        units: {
            'Centimetres': { factor: 0.01 },
            'Metres': { factor: 1 },
            'Kilometres': { factor: 1000 },
            'Inches': { factor: 0.0254 },
            'Feet': { factor: 0.3048 },
            'Miles': { factor: 1609.344 }
        }
    },
    weight: {
        name: 'Weight',
        baseUnit: 'kilograms',
        units: {
            'Grams': { factor: 0.001 },
            'Kilograms': { factor: 1 },
            'Pounds': { factor: 0.453592 },
            'Ounces': { factor: 0.0283495 }
        }
    },
    volume: {
        name: 'Volume',
        baseUnit: 'litres',
        units: {
            'Millilitres': { factor: 0.001 },
            'Litres': { factor: 1 },
            'Gallons': { factor: 3.78541 }
        }
    }
};

// DOM Elements
const categorySelect = document.getElementById('category');
const fromUnitSelect = document.getElementById('fromUnit');
const toUnitSelect = document.getElementById('toUnit');
const inputValue = document.getElementById('inputValue');
const convertBtn = document.getElementById('convertBtn');
const resultDiv = document.getElementById('result');

// Initialize
function init() {
    updateUnitSpinners();
    categorySelect.addEventListener('change', updateUnitSpinners);
    convertBtn.addEventListener('click', performConversion);
    inputValue.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performConversion();
    });
}

// Update unit dropdowns based on selected category
function updateUnitSpinners() {
    const category = categorySelect.value;
    const unitList = Object.keys(units[category].units);

    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';

    unitList.forEach((unit, index) => {
        fromUnitSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
        toUnitSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
    });

    // Set different default for "To" unit
    if (unitList.length > 1) {
        toUnitSelect.selectedIndex = 1;
    }

    // Clear result when category changes
    resultDiv.textContent = '';
}

// Perform the conversion
function performConversion() {
    const input = inputValue.value.trim();

    // Validate input
    if (input === '') {
        alert('Please enter a value');
        return;
    }

    const value = parseFloat(input);
    if (isNaN(value)) {
        alert('Please enter a valid number');
        return;
    }

    const category = categorySelect.value;
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;

    // Convert using base unit approach
    const fromFactor = units[category].units[fromUnit].factor;
    const toFactor = units[category].units[toUnit].factor;

    // Convert to base unit, then to target unit
    const baseValue = value * fromFactor;
    const result = baseValue / toFactor;

    // Format result
    let resultStr;
    if (Number.isInteger(result)) {
        resultStr = result.toString();
    } else {
        resultStr = result.toFixed(6).replace(/\.?0+$/, '');
    }

    // Display result
    resultDiv.textContent = `${value} ${fromUnit} = ${resultStr} ${toUnit}`;
}

// Initialize the app
init();
