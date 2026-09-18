package com.example.calculator;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import java.util.ArrayList;
import java.util.List;

/**
 * Main Activity for Calculator application.
 * Handles basic arithmetic operations with proper operator precedence.
 */
public class MainActivity extends AppCompatActivity {

    private TextView tvDisplay;
    private TextView tvExpression;
    private StringBuilder currentInput;
    private StringBuilder expression;
    private boolean lastResultUsed;
    private boolean hasDecimal;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize views
        tvDisplay = findViewById(R.id.tvDisplay);
        tvExpression = findViewById(R.id.tvExpression);
        currentInput = new StringBuilder();
        expression = new StringBuilder();
        lastResultUsed = false;
        hasDecimal = false;

        // Setup button click listeners
        setupNumberButtons();
        setupOperatorButtons();
        setupSpecialButtons();
    }

    /**
     * Setup click listeners for number buttons (0-9) and decimal point.
     */
    private void setupNumberButtons() {
        int[] numberButtonIds = {
            R.id.btn0, R.id.btn1, R.id.btn2, R.id.btn3, R.id.btn4,
            R.id.btn5, R.id.btn6, R.id.btn7, R.id.btn8, R.id.btn9
        };

        for (int id : numberButtonIds) {
            Button button = findViewById(id);
            button.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    appendNumber(button.getText().toString());
                }
            });
        }

        // Decimal button
        Button btnDecimal = findViewById(R.id.btnDecimal);
        btnDecimal.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                appendDecimal();
            }
        });
    }

    /**
     * Setup click listeners for operator buttons (+, -, ×, ÷).
     */
    private void setupOperatorButtons() {
        Button btnAdd = findViewById(R.id.btnAdd);
        Button btnSubtract = findViewById(R.id.btnSubtract);
        Button btnMultiply = findViewById(R.id.btnMultiply);
        Button btnDivide = findViewById(R.id.btnDivide);

        btnAdd.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                appendOperator("+");
            }
        });

        btnSubtract.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                appendOperator("-");
            }
        });

        btnMultiply.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                appendOperator("×");
            }
        });

        btnDivide.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                appendOperator("÷");
            }
        });
    }

    /**
     * Setup click listeners for special buttons (C, ⌫, =).
     */
    private void setupSpecialButtons() {
        Button btnClear = findViewById(R.id.btnClear);
        Button btnBackspace = findViewById(R.id.btnBackspace);
        Button btnEquals = findViewById(R.id.btnEquals);

        btnClear.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                clearAll();
            }
        });

        btnBackspace.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                backspace();
            }
        });

        btnEquals.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                calculateResult();
            }
        });
    }

    /**
     * Append a number to the current input.
     */
    private void appendNumber(String number) {
        if (lastResultUsed) {
            // Start fresh after getting a result
            currentInput.setLength(0);
            expression.setLength(0);
            lastResultUsed = false;
            hasDecimal = false;
        }
        currentInput.append(number);
        updateDisplay();
    }

    /**
     * Append a decimal point to the current input.
     */
    private void appendDecimal() {
        if (lastResultUsed) {
            currentInput.setLength(0);
            expression.setLength(0);
            lastResultUsed = false;
            hasDecimal = false;
        }
        if (!hasDecimal) {
            if (currentInput.length() == 0) {
                currentInput.append("0");
            }
            currentInput.append(".");
            hasDecimal = true;
            updateDisplay();
        }
    }

    /**
     * Append an operator to the expression.
     */
    private void appendOperator(String operator) {
        if (lastResultUsed) {
            // Use the result as the start of a new expression
            expression.setLength(0);
            expression.append(currentInput);
            currentInput.setLength(0);
            lastResultUsed = false;
            hasDecimal = false;
        }

        if (currentInput.length() > 0) {
            expression.append(currentInput);
            expression.append(" ");
            expression.append(operator);
            expression.append(" ");
            currentInput.setLength(0);
            hasDecimal = false;
            updateDisplay();
        } else if (expression.length() > 0) {
            // Replace the last operator if no number was entered
            String exprStr = expression.toString().trim();
            if (exprStr.length() > 0) {
                char lastChar = exprStr.charAt(exprStr.length() - 1);
                if (lastChar == '+' || lastChar == '-' || lastChar == '×' || lastChar == '÷') {
                    expression.setLength(expression.length() - 3); // Remove " op"
                    expression.append(operator);
                    expression.append(" ");
                    updateDisplay();
                }
            }
        }
    }

    /**
     * Clear all input and expression.
     */
    private void clearAll() {
        currentInput.setLength(0);
        expression.setLength(0);
        hasDecimal = false;
        lastResultUsed = false;
        tvDisplay.setText("0");
        tvExpression.setText("");
    }

    /**
     * Remove the last character from current input or expression.
     */
    private void backspace() {
        if (lastResultUsed) {
            clearAll();
            return;
        }

        if (currentInput.length() > 0) {
            char lastChar = currentInput.charAt(currentInput.length() - 1);
            if (lastChar == '.') {
                hasDecimal = false;
            }
            currentInput.deleteCharAt(currentInput.length() - 1);
            updateDisplay();
        } else if (expression.length() > 0) {
            String exprStr = expression.toString();
            // Remove the last operator and spaces
            if (exprStr.endsWith(" ")) {
                int lastSpaceIndex = exprStr.lastIndexOf(" ", exprStr.length() - 2);
                if (lastSpaceIndex >= 0) {
                    expression.setLength(lastSpaceIndex + 1);
                    // Get the last token to check for decimal
                    String lastToken = exprStr.substring(lastSpaceIndex + 1).trim();
                    if (lastToken.contains(".")) {
                        hasDecimal = false;
                    }
                    currentInput.append(lastToken);
                    updateDisplay();
                }
            }
        }
    }

    /**
     * Calculate the result of the expression.
     */
    private void calculateResult() {
        if (currentInput.length() == 0 && expression.length() == 0) {
            return;
        }

        // Build the complete expression
        String fullExpression = expression.toString() + currentInput.toString();
        fullExpression = fullExpression.trim();

        if (fullExpression.isEmpty()) {
            return;
        }

        try {
            double result = evaluateExpression(fullExpression);
            String resultStr;

            // Format the result
            if (result == (long) result && !Double.isInfinite(result)) {
                resultStr = String.valueOf((long) result);
            } else if (Double.isInfinite(result)) {
                resultStr = "Error";
            } else if (Double.isNaN(result)) {
                resultStr = "Error";
            } else {
                resultStr = String.valueOf(result);
                // Remove unnecessary trailing zeros
                if (resultStr.contains(".")) {
                    resultStr = resultStr.replaceAll("0+$", "").replaceAll("\\.$", "");
                }
            }

            // Display the expression and result
            tvExpression.setText(fullExpression + " =");
            tvDisplay.setText(resultStr);

            // Prepare for next calculation
            currentInput.setLength(0);
            currentInput.append(resultStr);
            expression.setLength(0);
            lastResultUsed = true;
            hasDecimal = resultStr.contains(".");

        } catch (ArithmeticException e) {
            tvDisplay.setText("Error");
            currentInput.setLength(0);
            expression.setLength(0);
            hasDecimal = false;
            lastResultUsed = true;
        }
    }

    /**
     * Evaluate a mathematical expression with proper operator precedence.
     * Supports +, -, ×, ÷ operators.
     */
    private double evaluateExpression(String expression) {
        // Tokenize the expression
        List<String> tokens = tokenize(expression);
        if (tokens.isEmpty()) {
            return 0;
        }

        // First pass: handle multiplication and division
        List<Double> numbers = new ArrayList<>();
        List<String> operators = new ArrayList<>();

        numbers.add(Double.parseDouble(tokens.get(0)));

        for (int i = 1; i < tokens.size(); i += 2) {
            String op = tokens.get(i);
            double nextNum = Double.parseDouble(tokens.get(i + 1));

            if (op.equals("×") || op.equals("÷")) {
                double lastNum = numbers.remove(numbers.size() - 1);
                if (op.equals("×")) {
                    numbers.add(lastNum * nextNum);
                } else {
                    if (nextNum == 0) {
                        throw new ArithmeticException("Division by zero");
                    }
                    numbers.add(lastNum / nextNum);
                }
            } else {
                numbers.add(nextNum);
                operators.add(op);
            }
        }

        // Second pass: handle addition and subtraction
        double result = numbers.get(0);
        for (int i = 0; i < operators.size(); i++) {
            if (operators.get(i).equals("+")) {
                result += numbers.get(i + 1);
            } else {
                result -= numbers.get(i + 1);
            }
        }

        return result;
    }

    /**
     * Tokenize a mathematical expression string.
     */
    private List<String> tokenize(String expression) {
        List<String> tokens = new ArrayList<>();
        StringBuilder currentToken = new StringBuilder();

        for (int i = 0; i < expression.length(); i++) {
            char c = expression.charAt(i);

            if (c == ' ') {
                if (currentToken.length() > 0) {
                    tokens.add(currentToken.toString());
                    currentToken.setLength(0);
                }
            } else if (c == '+' || c == '-' || c == '×' || c == '÷') {
                if (currentToken.length() > 0) {
                    tokens.add(currentToken.toString());
                    currentToken.setLength(0);
                }
                tokens.add(String.valueOf(c));
            } else {
                currentToken.append(c);
            }
        }

        if (currentToken.length() > 0) {
            tokens.add(currentToken.toString());
        }

        return tokens;
    }

    /**
     * Update the display with current input or expression.
     */
    private void updateDisplay() {
        if (currentInput.length() > 0) {
            tvDisplay.setText(currentInput.toString());
        } else if (expression.length() > 0) {
            // Show the last number being typed or 0
            tvDisplay.setText("0");
        } else {
            tvDisplay.setText("0");
        }
        tvExpression.setText(expression.toString());
    }
}
