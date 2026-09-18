package com.example.quizapp;

/**
 * Model class representing a quiz question.
 * Contains the question text, answer options, and the correct answer index.
 */
public class Question {
    private String question;
    private String[] options;
    private int correctAnswer;

    /**
     * Constructor for Question object.
     *
     * @param question      The question text
     * @param options       Array of 4 answer options
     * @param correctAnswer Index of the correct answer (0-3)
     */
    public Question(String question, String[] options, int correctAnswer) {
        this.question = question;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    /**
     * Get the question text.
     */
    public String getQuestion() {
        return question;
    }

    /**
     * Get the answer options array.
     */
    public String[] getOptions() {
        return options;
    }

    /**
     * Get the index of the correct answer.
     */
    public int getCorrectAnswer() {
        return correctAnswer;
    }
}
