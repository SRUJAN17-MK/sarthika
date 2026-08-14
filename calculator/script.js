// Calculator state variables
let currentValue = '0';      // Current number being entered
let previousValue = '';      // Previous number (stored when operator is pressed)
let operator = null;         // Current operator (+, −, ×, ÷)
let shouldResetDisplay = false; // Flag to reset display after operator press

// DOM elements
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

// Update the display with current value
function updateDisplay() {
    display.textContent = currentValue;
    // Remove error class when display updates
    display.classList.remove('error');
}

// Handle number button clicks
function inputNumber(num) {
    if (shouldResetDisplay) {
        currentValue = num;
        shouldResetDisplay = false;
    } else {
        // Replace initial 0 with pressed number, or append
        if (currentValue === '0') {
            currentValue = num;
        } else {
            currentValue += num;
        }
    }
    updateDisplay();
}

// Handle decimal point clicks
function inputDecimal() {
    if (shouldResetDisplay) {
        currentValue = '0.';
        shouldResetDisplay = false;
        updateDisplay();
        return;
    }
    
    // Prevent multiple decimal points in the same number
    if (currentValue.includes('.')) {
        return;
    }
    
    currentValue += '.';
    updateDisplay();
}

// Handle operator button clicks
function inputOperator(nextOperator) {
    const inputValue = parseFloat(currentValue);
    
    // If there's a pending operation, perform it first (operator chaining)
    if (operator && !shouldResetDisplay) {
        const result = calculate(parseFloat(previousValue), inputValue, operator);
        
        if (result === 'error') {
            currentValue = 'Error';
            display.classList.add('error');
            updateDisplay();
            return;
        }
        
        currentValue = String(result);
        updateDisplay();
    }
    
    // Store current value and operator for next calculation
    previousValue = currentValue;
    operator = nextOperator;
    shouldResetDisplay = true;
}

// Perform calculation based on operator
function calculate(firstNum, secondNum, op) {
    switch (op) {
        case '+':
            return firstNum + secondNum;
        case '−':
            return firstNum - secondNum;
        case '×':
            return firstNum * secondNum;
        case '÷':
            // Prevent division by zero
            if (secondNum === 0) {
                return 'error';
            }
            return firstNum / secondNum;
        case '%':
            return firstNum % secondNum;
        default:
            return secondNum;
    }
}

// Handle equals button press
function performCalculation() {
    if (!operator || shouldResetDisplay) {
        return;
    }
    
    const inputValue = parseFloat(currentValue);
    const result = calculate(parseFloat(previousValue), inputValue, operator);
    
    if (result === 'error') {
        currentValue = 'Cannot divide by zero';
        display.classList.add('error');
        updateDisplay();
        // Reset after error
        setTimeout(() => {
            currentValue = '0';
            previousValue = '';
            operator = null;
            shouldResetDisplay = false;
            updateDisplay();
        }, 2000);
        return;
    }
    
    currentValue = String(result);
    previousValue = '';
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
}

// Clear all calculator state
function clearAll() {
    currentValue = '0';
    previousValue = '';
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

// Delete last character (backspace)
function backspace() {
    if (shouldResetDisplay) {
        return;
    }
    
    if (currentValue.length === 1 || (currentValue.length === 2 && currentValue[0] === '-')) {
        currentValue = '0';
    } else {
        currentValue = currentValue.slice(0, -1);
    }
    updateDisplay();
}

// Handle keyboard input
function handleKeyboardInput(e) {
    const key = e.key;
    
    // Number keys
    if (/^[0-9]$/.test(key)) {
        inputNumber(key);
        return;
    }
    
    // Decimal point
    if (key === '.') {
        inputDecimal();
        return;
    }
    
    // Operators
    if (key === '+') {
        inputOperator('+');
        return;
    }
    if (key === '-') {
        inputOperator('−');
        return;
    }
    if (key === '*') {
        inputOperator('×');
        return;
    }
    if (key === '/') {
        e.preventDefault(); // Prevent browser search
        inputOperator('÷');
        return;
    }
    if (key === '%') {
        inputOperator('%');
        return;
    }
    
    // Equals
    if (key === '=' || key === 'Enter') {
        performCalculation();
        return;
    }
    
    // Clear
    if (key === 'Escape' || key === 'c' || key === 'C') {
        clearAll();
        return;
    }
    
    // Backspace
    if (key === 'Backspace') {
        backspace();
        return;
    }
}

// Add event listeners to all buttons
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        const value = button.dataset.value;
        
        switch (action) {
            case 'number':
                inputNumber(value);
                break;
            case 'decimal':
                inputDecimal();
                break;
            case 'operator':
                inputOperator(value);
                break;
            case 'equals':
                performCalculation();
                break;
            case 'clear':
                clearAll();
                break;
            case 'backspace':
                backspace();
                break;
        }
    });
});

// Add keyboard event listener
document.addEventListener('keydown', handleKeyboardInput);

// Initialize display
updateDisplay();
