package com.example.unitconverter;

import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import java.util.Locale;

/**
 * Main Activity for Unit Converter application.
 * Handles conversion between Length, Weight, and Volume units.
 */
public class MainActivity extends AppCompatActivity {

    private Spinner spinnerCategory, spinnerFromUnit, spinnerToUnit;
    private EditText etInputValue;
    private TextView tvResult;
    private Button btnConvert;

    // Unit arrays for each category
    private final String[] lengthUnits = {"Centimetres", "Metres", "Kilometres", "Inches", "Feet", "Miles"};
    private final String[] weightUnits = {"Grams", "Kilograms", "Pounds", "Ounces"};
    private final String[] volumeUnits = {"Millilitres", "Litres", "Gallons"};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize views
        spinnerCategory = findViewById(R.id.spinnerCategory);
        spinnerFromUnit = findViewById(R.id.spinnerFromUnit);
        spinnerToUnit = findViewById(R.id.spinnerToUnit);
        etInputValue = findViewById(R.id.etInputValue);
        tvResult = findViewById(R.id.tvResult);
        btnConvert = findViewById(R.id.btnConvert);

        // Setup category spinner
        String[] categories = {"Length", "Weight", "Volume"};
        ArrayAdapter<String> categoryAdapter = new ArrayAdapter<>(this,
                android.R.layout.simple_spinner_item, categories);
        categoryAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerCategory.setAdapter(categoryAdapter);

        // Set initial units for Length category
        setupUnitSpinners(lengthUnits);

        // Category change listener - update unit spinners
        spinnerCategory.setOnItemSelectedListener(new android.widget.AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(android.widget.AdapterView<?> parent, View view, int position, long id) {
                switch (position) {
                    case 0:
                        setupUnitSpinners(lengthUnits);
                        break;
                    case 1:
                        setupUnitSpinners(weightUnits);
                        break;
                    case 2:
                        setupUnitSpinners(volumeUnits);
                        break;
                }
                // Clear result when category changes
                tvResult.setText("");
            }

            @Override
            public void onNothingSelected(android.widget.AdapterView<?> parent) {
            }
        });

        // Convert button click listener
        btnConvert.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                performConversion();
            }
        });
    }

    /**
     * Setup the from and to unit spinners with the given units array.
     */
    private void setupUnitSpinners(String[] units) {
        ArrayAdapter<String> unitAdapter = new ArrayAdapter<>(this,
                android.R.layout.simple_spinner_item, units);
        unitAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerFromUnit.setAdapter(unitAdapter);
        spinnerToUnit.setAdapter(unitAdapter);
    }

    /**
     * Perform the unit conversion based on user input.
     */
    private void performConversion() {
        String inputStr = etInputValue.getText().toString().trim();

        // Validate input is not empty
        if (inputStr.isEmpty()) {
            Toast.makeText(this, "Please enter a value", Toast.LENGTH_SHORT).show();
            return;
        }

        // Validate input is a valid number
        double inputValue;
        try {
            inputValue = Double.parseDouble(inputStr);
        } catch (NumberFormatException e) {
            Toast.makeText(this, "Please enter a valid number", Toast.LENGTH_SHORT).show();
            return;
        }

        // Get selected units and category
        String category = spinnerCategory.getSelectedItem().toString();
        String fromUnit = spinnerFromUnit.getSelectedItem().toString();
        String toUnit = spinnerToUnit.getSelectedItem().toString();

        // Perform conversion
        double result = convertUnits(category, fromUnit, toUnit, inputValue);

        // Format result for display
        String resultStr;
        if (result == (long) result) {
            resultStr = String.format(Locale.US, "%.0f", result);
        } else {
            resultStr = String.format(Locale.US, "%.6f", result);
            // Remove trailing zeros
            resultStr = resultStr.replaceAll("0+$", "").replaceAll("\\.$", "");
        }

        // Display result
        tvResult.setText(String.format(Locale.US, "%s %s = %s %s",
                formatInput(inputStr), fromUnit, resultStr, toUnit));
    }

    /**
     * Format input for display (handle decimals properly).
     */
    private String formatInput(String input) {
        try {
            double val = Double.parseDouble(input);
            if (val == (long) val) {
                return String.format(Locale.US, "%.0f", val);
            }
            return input;
        } catch (NumberFormatException e) {
            return input;
        }
    }

    /**
     * Convert between units based on category.
     * Uses base unit conversion (convert to base, then to target).
     */
    private double convertUnits(String category, String fromUnit, String toUnit, double value) {
        // If same unit, return the same value
        if (fromUnit.equals(toUnit)) {
            return value;
        }

        switch (category) {
            case "Length":
                return convertLength(fromUnit, toUnit, value);
            case "Weight":
                return convertWeight(fromUnit, toUnit, value);
            case "Volume":
                return convertVolume(fromUnit, toUnit, value);
            default:
                return value;
        }
    }

    /**
     * Convert length units using metres as base unit.
     */
    private double convertLength(String from, String to, double value) {
        // Convert to metres first
        double metres;
        switch (from) {
            case "Centimetres":
                metres = value / 100.0;
                break;
            case "Metres":
                metres = value;
                break;
            case "Kilometres":
                metres = value * 1000.0;
                break;
            case "Inches":
                metres = value * 0.0254;
                break;
            case "Feet":
                metres = value * 0.3048;
                break;
            case "Miles":
                metres = value * 1609.344;
                break;
            default:
                metres = value;
        }

        // Convert from metres to target unit
        switch (to) {
            case "Centimetres":
                return metres * 100.0;
            case "Metres":
                return metres;
            case "Kilometres":
                return metres / 1000.0;
            case "Inches":
                return metres / 0.0254;
            case "Feet":
                return metres / 0.3048;
            case "Miles":
                return metres / 1609.344;
            default:
                return metres;
        }
    }

    /**
     * Convert weight units using kilograms as base unit.
     */
    private double convertWeight(String from, String to, double value) {
        // Convert to kilograms first
        double kilograms;
        switch (from) {
            case "Grams":
                kilograms = value / 1000.0;
                break;
            case "Kilograms":
                kilograms = value;
                break;
            case "Pounds":
                kilograms = value / 2.20462262;
                break;
            case "Ounces":
                kilograms = value / 35.274;
                break;
            default:
                kilograms = value;
        }

        // Convert from kilograms to target unit
        switch (to) {
            case "Grams":
                return kilograms * 1000.0;
            case "Kilograms":
                return kilograms;
            case "Pounds":
                return kilograms * 2.20462262;
            case "Ounces":
                return kilograms * 35.274;
            default:
                return kilograms;
        }
    }

    /**
     * Convert volume units using litres as base unit.
     */
    private double convertVolume(String from, String to, double value) {
        // Convert to litres first
        double litres;
        switch (from) {
            case "Millilitres":
                litres = value / 1000.0;
                break;
            case "Litres":
                litres = value;
                break;
            case "Gallons":
                litres = value / 0.264172052;
                break;
            default:
                litres = value;
        }

        // Convert from litres to target unit
        switch (to) {
            case "Millilitres":
                return litres * 1000.0;
            case "Litres":
                return litres;
            case "Gallons":
                return litres * 0.264172052;
            default:
                return litres;
        }
    }
}
