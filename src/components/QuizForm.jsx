import React, { useState, useEffect } from 'react';
import { createQuizApi } from '../services/api';
import { toast } from 'react-toastify';

function QuizForm({ courseId, lessonId, onQuizCreated, onCancel }) {
  const [formQuiz, setFormQuiz] = useState({
    title: '',
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }],
    showResultsImmediately: true,
  });

  useEffect(() => {
    if (!courseId || !lessonId) {
      toast.error('Invalid course or lesson ID');
      return;
    }
    setFormQuiz({
      title: '',
      questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }],
      showResultsImmediately: true,
    });
  }, [courseId, lessonId]);

  const handleAddQuestion = () => {
    setFormQuiz({
      ...formQuiz,
      questions: [...formQuiz.questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }],
    });
  };

  const handleRemoveQuestion = (index) => {
    if (formQuiz.questions.length === 1) {
      toast.error('At least one question is required');
      return;
    }
    setFormQuiz({
      ...formQuiz,
      questions: formQuiz.questions.filter((_, i) => i !== index),
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formQuiz.questions];
    if (field === 'question' || field === 'correctAnswer') {
      updatedQuestions[index][field] = value;
    } else {
      const optionIndex = parseInt(field.split('-')[1]);
      updatedQuestions[index].options[optionIndex] = value;
    }
    setFormQuiz({ ...formQuiz, questions: updatedQuestions });
  };

  const handleSubmit = async () => {
    if (!courseId || !lessonId) {
      toast.error('Invalid course or lesson ID');
      return;
    }
    if (!formQuiz.title) {
      toast.error('Quiz title is required');
      return;
    }
    for (const [index, q] of formQuiz.questions.entries()) {
      if (!q.question) {
        toast.error(`Question ${index + 1} is required`);
        return;
      }
      if (q.options.some(opt => !opt)) {
        toast.error(`All options for question ${index + 1} are required`);
        return;
      }
      if (!q.correctAnswer || !q.options.includes(q.correctAnswer)) {
        toast.error(`Correct answer for question ${index + 1} must be one of the options`);
        return;
      }
    }
    const formData = new FormData();
    formData.append('title', formQuiz.title);
    formData.append('questions', JSON.stringify(formQuiz.questions));
    formData.append('showResultsImmediately', formQuiz.showResultsImmediately);
    try {
      await createQuizApi(courseId, lessonId, formData);
      toast.success('Quiz created successfully');
      setFormQuiz({
        title: '',
        questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }],
        showResultsImmediately: true,
      });
      onQuizCreated();
      onCancel();
    } catch (error) {
      toast.error(error.message || 'Failed to create quiz');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-2xl font-semibold mb-4">Add Quiz</h2>
      <input
        type="text"
        placeholder="Quiz Title"
        value={formQuiz.title}
        onChange={(e) => setFormQuiz({ ...formQuiz, title: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
      />
      {formQuiz.questions.map((q, index) => (
        <div key={index} className="mb-4 border-t pt-4">
          <input
            type="text"
            placeholder={`Question ${index + 1}`}
            value={q.question}
            onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          {q.options.map((opt, optIndex) => (
            <input
              key={optIndex}
              type="text"
              placeholder={`Option ${optIndex + 1}`}
              value={opt}
              onChange={(e) => handleQuestionChange(index, `option-${optIndex}`, e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            />
          ))}
          <input
            type="text"
            placeholder="Correct Answer"
            value={q.correctAnswer}
            onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <button
            onClick={() => handleRemoveQuestion(index)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Remove Question
          </button>
        </div>
      ))}
      <button
        onClick={handleAddQuestion}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
      >
        Add Question
      </button>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formQuiz.showResultsImmediately}
            onChange={(e) => setFormQuiz({ ...formQuiz, showResultsImmediately: e.target.checked })}
            className="mr-2"
          />
          Show results immediately
        </label>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizForm;