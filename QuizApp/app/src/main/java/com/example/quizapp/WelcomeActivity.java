package com.example.quizapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;

/**
 * Welcome Activity - The entry point of the Quiz Application.
 * Displays app title, description, and a start button.
 */
public class WelcomeActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_welcome);

        // Find the start button
        Button btnStartQuiz = findViewById(R.id.btnStartQuiz);

        // Set click listener to start the quiz
        btnStartQuiz.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Navigate to QuizActivity
                Intent intent = new Intent(WelcomeActivity.this, QuizActivity.class);
                startActivity(intent);
            }
        });
    }
}
