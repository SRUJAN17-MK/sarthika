package com.example.quizapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Quiz Activity - Handles the quiz gameplay.
 * Displays questions one at a time and tracks the score.
 */
public class QuizActivity extends AppCompatActivity {

    private TextView tvQuestionCounter;
    private TextView tvQuestion;
    private TextView tvScore;
    private RadioGroup radioGroupOptions;
    private RadioButton rbOption1, rbOption2, rbOption3, rbOption4;
    private Button btnNext;

    private List<Question> questionList;
    private int currentQuestionIndex = 0;
    private int score = 0;
    private int correctAnswers = 0;
    private int incorrectAnswers = 0;
    private boolean answerSelected = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_quiz);

        // Initialize views
        tvQuestionCounter = findViewById(R.id.tvQuestionCounter);
        tvQuestion = findViewById(R.id.tvQuestion);
        tvScore = findViewById(R.id.tvScore);
        radioGroupOptions = findViewById(R.id.radioGroupOptions);
        rbOption1 = findViewById(R.id.rbOption1);
        rbOption2 = findViewById(R.id.rbOption2);
        rbOption3 = findViewById(R.id.rbOption3);
        rbOption4 = findViewById(R.id.rbOption4);
        btnNext = findViewById(R.id.btnNext);

        // Initialize questions
        initializeQuestions();

        // Display first question
        displayQuestion();

        // Setup next button click listener
        btnNext.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                handleNextButton();
            }
        });

        // Setup radio button change listener for immediate feedback
        radioGroupOptions.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                if (!answerSelected && checkedId != -1) {
                    answerSelected = true;
                    checkAnswer(checkedId);
                }
            }
        });
    }

    /**
     * Initialize the quiz questions with General Knowledge topics.
     */
    private void initializeQuestions() {
        questionList = new ArrayList<>();

        // Question 1: Geography
        questionList.add(new Question(
                "What is the capital of France?",
                new String[]{"Berlin", "Madrid", "Paris", "Rome"},
                2
        ));

        // Question 2: Science
        questionList.add(new Question(
                "What is the chemical symbol for water?",
                new String[]{"O2", "H2O", "CO2", "NaCl"},
                1
        ));

        // Question 3: History
        questionList.add(new Question(
                "In which year did World War II end?",
                new String[]{"1943", "1944", "1945", "1946"},
                2
        ));

        // Question 4: Geography
        questionList.add(new Question(
                "Which is the largest ocean on Earth?",
                new String[]{"Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"},
                3
        ));

        // Question 5: Science
        questionList.add(new Question(
                "What planet is known as the Red Planet?",
                new String[]{"Venus", "Mars", "Jupiter", "Saturn"},
                1
        ));

        // Question 6: Technology
        questionList.add(new Question(
                "Who is known as the father of computers?",
                new String[]{"Alan Turing", "Charles Babbage", "Bill Gates", "Steve Jobs"},
                1
        ));

        // Question 7: India
        questionList.add(new Question(
                "What is the national animal of India?",
                new String[]{"Lion", "Tiger", "Elephant", "Leopard"},
                1
        ));

        // Question 8: General Knowledge
        questionList.add(new Question(
                "How many continents are there on Earth?",
                new String[]{"5", "6", "7", "8"},
                2
        ));

        // Question 9: Science
        questionList.add(new Question(
                "What is the speed of light approximately?",
                new String[]{"300,000 km/s", "150,000 km/s", "500,000 km/s", "100,000 km/s"},
                0
        ));

        // Question 10: Geography
        questionList.add(new Question(
                "Which country has the largest population?",
                new String[]{"United States", "India", "China", "Indonesia"},
                2
        ));

        // Shuffle the questions
        Collections.shuffle(questionList);
    }

    /**
     * Display the current question and its options.
     */
    private void displayQuestion() {
        if (currentQuestionIndex >= questionList.size()) {
            // Quiz completed, go to results
            showResults();
            return;
        }

        Question currentQuestion = questionList.get(currentQuestionIndex);

        // Update question counter
        tvQuestionCounter.setText(String.format("Question %d of %d",
                currentQuestionIndex + 1, questionList.size()));

        // Update question text
        tvQuestion.setText(currentQuestion.getQuestion());

        // Update score display
        tvScore.setText(String.format("Score: %d", score));

        // Reset radio group
        radioGroupOptions.clearCheck();
        answerSelected = false;

        // Reset button text
        btnNext.setText("NEXT");

        // Enable radio buttons
        setRadioButtonsEnabled(true);

        // Set answer options
        String[] options = currentQuestion.getOptions();
        rbOption1.setText(options[0]);
        rbOption2.setText(options[1]);
        rbOption3.setText(options[2]);
        rbOption4.setText(options[3]);

        // Reset button visibility
        btnNext.setVisibility(View.VISIBLE);
    }

    /**
     * Check the selected answer and provide feedback.
     */
    private void checkAnswer(int checkedId) {
        Question currentQuestion = questionList.get(currentQuestionIndex);
        int correctAnswerIndex = currentQuestion.getCorrectAnswer();

        // Get the selected radio button index
        int selectedIndex = -1;
        if (checkedId == R.id.rbOption1) selectedIndex = 0;
        else if (checkedId == R.id.rbOption2) selectedIndex = 1;
        else if (checkedId == R.id.rbOption3) selectedIndex = 2;
        else if (checkedId == R.id.rbOption4) selectedIndex = 3;

        // Disable further selection
        setRadioButtonsEnabled(false);

        // Check if answer is correct
        if (selectedIndex == correctAnswerIndex) {
            // Correct answer
            score += 10;
            correctAnswers++;
            highlightCorrectAnswer(checkedId, true);
            Toast.makeText(this, "Correct!", Toast.LENGTH_SHORT).show();
        } else {
            // Wrong answer
            incorrectAnswers++;
            highlightCorrectAnswer(checkedId, false);
            Toast.makeText(this, "Incorrect!", Toast.LENGTH_SHORT).show();
        }

        // Update score display
        tvScore.setText(String.format("Score: %d", score));

        // Update button text for next action
        if (currentQuestionIndex >= questionList.size() - 1) {
            btnNext.setText("FINISH");
        } else {
            btnNext.setText("NEXT");
        }
    }

    /**
     * Highlight the correct answer and wrong selection.
     */
    private void highlightCorrectAnswer(int selectedId, boolean isCorrect) {
        Question currentQuestion = questionList.get(currentQuestionIndex];
        int correctIndex = currentQuestion.getCorrectAnswer();

        // Highlight correct answer
        RadioButton correctRadioButton = getRadioButtonByIndex(correctIndex);
        if (correctRadioButton != null) {
            correctRadioButton.setBackgroundColor(getResources().getColor(R.color.correct_answer));
            correctRadioButton.setTextColor(getResources().getColor(R.color.white));
        }

        // Highlight wrong selection if applicable
        if (!isCorrect) {
            RadioButton selectedRadioButton = findViewById(selectedId);
            if (selectedRadioButton != null) {
                selectedRadioButton.setBackgroundColor(getResources().getColor(R.color.wrong_answer));
                selectedRadioButton.setTextColor(getResources().getColor(R.color.white));
            }
        }
    }

    /**
     * Get RadioButton by index.
     */
    private RadioButton getRadioButtonByIndex(int index) {
        switch (index) {
            case 0: return rbOption1;
            case 1: return rbOption2;
            case 2: return rbOption3;
            case 3: return rbOption4;
            default: return null;
        }
    }

    /**
     * Enable or disable all radio buttons.
     */
    private void setRadioButtonsEnabled(boolean enabled) {
        rbOption1.setEnabled(enabled);
        rbOption2.setEnabled(enabled);
        rbOption3.setEnabled(enabled);
        rbOption4.setEnabled(enabled);
    }

    /**
     * Handle next button click.
     */
    private void handleNextButton() {
        if (!answerSelected) {
            Toast.makeText(this, "Please select an answer", Toast.LENGTH_SHORT).show();
            return;
        }

        // Move to next question or show results
        currentQuestionIndex++;
        if (currentQuestionIndex >= questionList.size()) {
            showResults();
        } else {
            // Reset button colors for next question
            resetButtonColors();
            displayQuestion();
        }
    }

    /**
     * Reset button background colors.
     */
    private void resetButtonColors() {
        rbOption1.setBackgroundColor(getResources().getColor(R.color.option_background));
        rbOption1.setTextColor(getResources().getColor(R.color.text_primary));
        rbOption2.setBackgroundColor(getResources().getColor(R.color.option_background));
        rbOption2.setTextColor(getResources().getColor(R.color.text_primary));
        rbOption3.setBackgroundColor(getResources().getColor(R.color.option_background));
        rbOption3.setTextColor(getResources().getColor(R.color.text_primary));
        rbOption4.setBackgroundColor(getResources().getColor(R.color.option_background));
        rbOption4.setTextColor(getResources().getColor(R.color.text_primary));
    }

    /**
     * Show the results screen.
     */
    private void showResults() {
        Intent intent = new Intent(QuizActivity.this, ResultActivity.class);
        intent.putExtra("TOTAL_QUESTIONS", questionList.size());
        intent.putExtra("CORRECT_ANSWERS", correctAnswers);
        intent.putExtra("INCORRECT_ANSWERS", incorrectAnswers);
        intent.putExtra("SCORE", score);
        startActivity(intent);
        finish();
    }
}
