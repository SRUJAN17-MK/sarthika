// Calculator state
let currentInput = '';
let expression = '';
let lastResultUsed = false;
let hasDecimal = false;

// DOM Elements
const displayElement = document.getElementById('display');
const expressionElement = document.getElementById('expression');

// Append a number to current input
function appendNumber(number) {
    if (lastResultUsed) {
        currentInput = '';
        expression = '';
        lastResultUsed = false;
        hasDecimal = false;
    }
    currentInput += number;
    updateDisplay();
}

// Append a decimal point
function appendDecimal() {
    if (lastResultUsed) {
        currentInput = '';
        expression = '';
        lastResultUsed = false;
        hasDecimal = false;
    }
    if (!hasDecimal) {
        if (currentInput === '') {
            currentInput = '0';
        }
        currentInput += '.';
        hasDecimal = true;
        updateDisplay();
    }
}

// Append an operator
function appendOperator(operator) {
    if (lastResultUsed) {
        expression = currentInput;
        currentInput = '';
        lastResultUsed = false;
        hasDecimal = false;
    }

    if (currentInput !== '') {
        expression += currentInput + ' ' + operator + ' ';
        currentInput = '';
        hasDecimal = false;
        updateDisplay();
    } else if (expression !== '') {
        // Replace last operator if no number was entered
        const exprTrimmed = expression.trim();
        if (exprTrimmed.length > 0) {
            const lastChar = exprTrimmed[exprTrimmed.length - 1];
            if (['+', '-', '×', '÷', '%'].includes(lastChar)) {
                expression = expression.slice(0, -3) + operator + ' ';
                updateDisplay();
            }
        }
    }
}

// Clear all
function clearAll() {
    currentInput = '';
    expression = '';
    hasDecimal = false;
    lastResultUsed = false;
    displayElement.textContent = '0';
    expressionElement.textContent = '';
}

// Backspace
function backspace() {
    if (lastResultUsed) {
        clearAll();
        return;
    }

    if (currentInput.length > 0) {
        const lastChar = currentInput[currentInput.length - 1];
        if (lastChar === '.') {
            hasDecimal = false;
        }
        currentInput = currentInput.slice(0, -1);
        updateDisplay();
    } else if (expression.length > 0) {
        // Remove last operator and get the number back
        const parts = expression.trim().split(' ');
        if (parts.length >= 3) {
            const lastNumber = parts[parts.length - 2];
            const lastOp = parts[parts.length - 3];
            expression = parts.slice(0, -2).join(' ') + ' ';
            currentInput = lastNumber;
            hasDecimal = lastNumber.includes('.');
            updateDisplay();
        }
    }
}

// Calculate result
function calculateResult() {
    if (currentInput === '' && expression === '') {
        return;
    }

    const fullExpression = (expression + currentInput).trim();
    if (fullExpression === '') {
        return;
    }

    try {
        const result = evaluateExpression(fullExpression);

        let resultStr;
        if (Number.isInteger(result) && Math.abs(result) < 1e15) {
            resultStr = result.toString();
        } else if (!isFinite(result)) {
            resultStr = 'Error';
        } else if (isNaN(result)) {
            resultStr = 'Error';
        } else {
            resultStr = result.toFixed(10).replace(/\.?0+$/, '');
        }

        expressionElement.textContent = fullExpression + ' =';
        displayElement.textContent = resultStr;

        currentInput = resultStr;
        expression = '';
        lastResultUsed = true;
        hasDecimal = resultStr.includes('.');

    } catch (e) {
        displayElement.textContent = 'Error';
        currentInput = '';
        expression = '';
        hasDecimal = false;
        lastResultUsed = true;
    }
}

// Evaluate expression with proper operator precedence
function evaluateExpression(expr) {
    // Tokenize
    const tokens = expr.split(' ').filter(t => t !== '');

    // First pass: handle ×, ÷, %
    const numbers = [];
    const operators = [];

    numbers.push(parseFloat(tokens[0]));

    for (let i = 1; i < tokens.length; i += 2) {
        const op = tokens[i];
        const nextNum = parseFloat(tokens[i + 1]);

        if (op === '×' || op === '÷' || op === '%') {
            const lastNum = numbers.pop();
            if (op === '×') {
                numbers.push(lastNum * nextNum);
            } else if (op === '÷') {
                if (nextNum === 0) {
                    throw new Error('Division by zero');
                }
                numbers.push(lastNum / nextNum);
            } else {
                numbers.push(lastNum % nextNum);
            }
        } else {
            numbers.push(nextNum);
            operators.push(op);
        }
    }

    // Second pass: handle +, -
    let result = numbers[0];
    for (let i = 0; i < operators.length; i++) {
        if (operators[i] === '+') {
            result += numbers[i + 1];
        } else {
            result -= numbers[i + 1];
        }
    }

    return result;
}

// Update display
function updateDisplay() {
    displayElement.textContent = currentInput || '0';
    expressionElement.textContent = expression;
}
