package com.example.quizapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

/**
 * Result Activity - Displays the quiz results.
 * Shows total questions, correct answers, incorrect answers, and percentage score.
 */
public class ResultActivity extends AppCompatActivity {

    private TextView tvQuizCompleted;
    private TextView tvTotalQuestions;
    private TextView tvCorrectAnswers;
    private TextView tvIncorrectAnswers;
    private TextView tvScorePercentage;
    private Button btnRestart;
    private Button btnExit;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_result);

        // Initialize views
        tvQuizCompleted = findViewById(R.id.tvQuizCompleted);
        tvTotalQuestions = findViewById(R.id.tvTotalQuestions);
        tvCorrectAnswers = findViewById(R.id.tvCorrectAnswers);
        tvIncorrectAnswers = findViewById(R.id.tvIncorrectAnswers);
        tvScorePercentage = findViewById(R.id.tvScorePercentage);
        btnRestart = findViewById(R.id.btnRestart);
        btnExit = findViewById(R.id.btnExit);

        // Get intent data
        Intent intent = getIntent();
        int totalQuestions = intent.getIntExtra("TOTAL_QUESTIONS", 0);
        int correctAnswers = intent.getIntExtra("CORRECT_ANSWERS", 0);
        int incorrectAnswers = intent.getIntExtra("INCORRECT_ANSWERS", 0);
        int score = intent.getIntExtra("SCORE", 0);

        // Calculate percentage
        int percentage = 0;
        if (totalQuestions > 0) {
            percentage = (correctAnswers * 100) / totalQuestions;
        }

        // Display results
        tvTotalQuestions.setText(String.format("Total Questions: %d", totalQuestions));
        tvCorrectAnswers.setText(String.format("Correct Answers: %d", correctAnswers));
        tvIncorrectAnswers.setText(String.format("Incorrect Answers: %d", incorrectAnswers));
        tvScorePercentage.setText(String.format("Score: %d%%", percentage));

        // Restart button - start a new quiz
        btnRestart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ResultActivity.this, QuizActivity.class);
                startActivity(intent);
                finish();
            }
        });

        // Exit button - close the app
        btnExit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finishAffinity();
                System.exit(0);
            }
        });
    }

    @Override
    public void onBackPressed() {
        // Prevent going back to quiz
        super.onBackPressed();
        finishAffinity();
    }
}
