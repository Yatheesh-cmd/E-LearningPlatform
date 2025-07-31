import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { submitQuizApi, updateProgressApi } from '../services/api';

function QuizAttempt({ quiz, courseId, lessonId, onQuizSubmitted }) {
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const storedSubmission = localStorage.getItem(`quiz_${quiz._id}`);
    if (storedSubmission) {
      const { answers: storedAnswers, results: storedResults } = JSON.parse(storedSubmission);
      setAnswers(storedAnswers);
      setResults(storedResults);
      setSubmitted(true);
    }
  }, [quiz._id]);

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  const handleSubmit = async () => {
    if (!quiz || !quiz.questions) {
      toast.error('Quiz data is invalid');
      console.error('QuizAttempt: Invalid quiz data:', quiz);
      return;
    }

    if (Object.keys(answers).length !== quiz.questions.length) {
      toast.error('Please answer all questions');
      console.log('QuizAttempt: Incomplete answers:', answers);
      return;
    }

    const answersArray = quiz.questions.map((_, index) => answers[index] || '');
    console.log('QuizAttempt: Submitting answers:', { courseId, lessonId, quizId: quiz._id, answers: answersArray });

    try {
      const response = await submitQuizApi(courseId, lessonId, quiz._id, { answers: answersArray });
      console.log('QuizAttempt: Submission response:', response.data);
      setResults(response.data.results);
      setSubmitted(true);
      localStorage.setItem(
        `quiz_${quiz._id}`,
        JSON.stringify({ answers, results: response.data.results })
      );
      await updateProgressApi(courseId, lessonId, { quizScore: response.data.score });
      onQuizSubmitted();
      toast.success('Quiz submitted!');
    } catch (error) {
      console.error('QuizAttempt: Submission error:', error.message, error);
      toast.error(error.message || 'Failed to submit quiz');
    }
  };

  if (!quiz || !quiz.questions) {
    console.error('QuizAttempt: Quiz data missing:', quiz);
    return (
      <div className="text-red-600 font-semibold text-center py-4">
        Error: Quiz data is missing
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-6 w-full"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6">{quiz.title}</h3>
      <AnimatePresence>
        {submitted && results ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-200 pb-4"
              >
                <p className="font-semibold text-gray-800 mb-2">
                  {index + 1}. {result.question}
                </p>
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm">
                    Your answer: {result.userAnswer}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Correct answer: {result.correctAnswer}
                  </p>
                  <p
                    className={`flex items-center text-sm font-medium ${
                      result.isCorrect ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {result.isCorrect ? (
                      <FiCheckCircle className="w-5 h-5 mr-2" />
                    ) : (
                      <FiXCircle className="w-5 h-5 mr-2" />
                    )}
                    {result.isCorrect ? 'Correct' : 'Incorrect'}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {quiz.questions.map((q, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-200 pb-4"
              >
                <p className="font-semibold text-gray-800 mb-3">
                  {index + 1}. {q.question}
                </p>
                {q.options && q.options.map((option, optIndex) => (
                  <label
                    key={optIndex}
                    className="flex items-center space-x-3 mb-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={() => handleAnswerChange(index, option)}
                      disabled={submitted}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </motion.div>
            ))}
            {!submitted && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                Submit Quiz
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default QuizAttempt;