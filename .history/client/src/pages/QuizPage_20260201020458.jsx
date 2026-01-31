import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourseQuiz, submitQuizAttempt } from '../api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await getCourseQuiz(id);
        setQuiz(data);
        setAnswers(new Array(data.questions.length).fill(-1));
      } catch (error) {
        if (error.response?.status === 404) {
          setError('No quiz available for this course');
        } else {
          setError('Failed to load quiz');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleAnswerChange = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    if (answers.includes(-1)) {
      alert('Please answer all questions before submitting');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await submitQuizAttempt(quiz._id, answers);
      setResult(data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to={`/courses/${id}`} className="text-blue-600 hover:text-blue-800">
            ← Back to Course
          </Link>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className={`text-6xl mb-4 ${result.passed ? 'text-green-500' : 'text-red-500'}`}>
              {result.passed ? '🎉' : '😔'}
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {result.passed ? 'Congratulations!' : 'Better luck next time'}
            </h1>
            <p className="text-gray-600 mb-4">
              You scored {result.score}% ({result.earnedPoints}/{result.totalPoints} points)
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Passing score: {result.passingScore}%
            </p>
            <div className="space-x-4">
              <Link
                to={`/courses/${id}`}
                className="inline-block bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
              >
                Back to Course
              </Link>
              {!result.passed && (
                <button
                  onClick={() => {
                    setResult(null);
                    setAnswers(new Array(quiz.questions.length).fill(-1));
                  }}
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <Link
            to={`/courses/${id}`}
            className="text-sm text-blue-600 hover:text-blue-800 mb-4 block"
          >
            ← Back to Course
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {quiz.questions.length} questions • Passing score: {quiz.passingScore}%
          </p>
        </div>

        <div className="space-y-6">
          {quiz.questions.map((question, qIndex) => (
            <div key={question._id || qIndex} className="bg-white rounded-lg shadow p-6">
              <p className="font-medium text-gray-800 mb-4">
                {qIndex + 1}. {question.question}
              </p>
              <div className="space-y-2">
                {question.options.map((option, oIndex) => (
                  <label
                    key={oIndex}
                    className={`flex items-center p-3 rounded border cursor-pointer transition-colors ${
                      answers[qIndex] === oIndex
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      checked={answers[qIndex] === oIndex}
                      onChange={() => handleAnswerChange(qIndex, oIndex)}
                      className="mr-3"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
