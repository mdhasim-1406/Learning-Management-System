import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourseQuiz, submitQuizAttempt } from '../api';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/ui-next/Button';
import Card, { CardContent, CardHeader } from '../components/ui-next/Card';
import Badge from '../components/ui-next/Badge';
import Skeleton from '../components/ui-next/Skeleton';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, fadeInUp, staggerContainer } from '../lib/animations';

// Icons
function CheckCircleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function XCircleIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

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

  const answeredCount = answers.filter(a => a !== -1).length;
  const progress = quiz ? Math.round((answeredCount / quiz.questions.length) * 100) : 0;

  if (loading) {
    return (
      <AppLayout>
        <PageHeader title="Loading Quiz..." />
        <div className="space-y-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="text-center py-16"
        >
          <Card variant="glass" className="max-w-md mx-auto">
            <CardContent className="py-12">
              <XCircleIcon className="w-16 h-16 text-stone-400 mx-auto mb-4" />
              <p className="text-stone-600 mb-6">{error}</p>
              <Link to={`/courses/${id}`}>
                <Button variant="outline">
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Back to Course
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </AppLayout>
    );
  }

  if (result) {
    return (
      <AppLayout>
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="max-w-2xl mx-auto py-8"
        >
          <Card variant="luxury" className="text-center overflow-hidden">
            {/* Result Header */}
            <div className={cn(
              "py-12 px-8",
              result.passed
                ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                : "bg-gradient-to-br from-amber-500 to-orange-600"
            )}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="text-7xl mb-4"
              >
                {result.passed ? '🎉' : '📚'}
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {result.passed ? 'Congratulations!' : 'Keep Learning!'}
              </h1>
              <p className="text-white/90">
                {result.passed
                  ? 'You have successfully passed this quiz!'
                  : 'Review the material and try again.'}
              </p>
            </div>

            {/* Score Card */}
            <CardContent className="py-8">
              <div className="flex items-center justify-center gap-8 mb-8">
                <div className="text-center">
                  <p className="text-4xl font-bold text-stone-900">{result.score}%</p>
                  <p className="text-sm text-stone-500">Your Score</p>
                </div>
                <div className="w-px h-12 bg-stone-200" />
                <div className="text-center">
                  <p className="text-4xl font-bold text-stone-900">{result.passingScore}%</p>
                  <p className="text-sm text-stone-500">Passing Score</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mb-8">
                <Badge variant={result.passed ? 'success' : 'warning'} className="text-sm px-4 py-1">
                  {result.earnedPoints}/{result.totalPoints} points
                </Badge>
              </div>

              <div className="flex justify-center gap-4">
                <Link to={`/courses/${id}`}>
                  <Button variant="ghost">Back to Course</Button>
                </Link>
                {!result.passed && (
                  <Button
                    onClick={() => {
                      setResult(null);
                      setAnswers(new Array(quiz.questions.length).fill(-1));
                    }}
                    variant="luxury"
                  >
                    Try Again
                  </Button>
                )}
                {result.passed && (
                  <Link to="/certificates">
                    <Button variant="luxury">View Certificate</Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="max-w-3xl mx-auto space-y-6"
      >
        {/* Quiz Header */}
        <Card variant="luxury">
          <CardContent className="py-6">
            <Link
              to={`/courses/${id}`}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 mb-4"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Course
            </Link>
            <h1 className="text-2xl font-bold text-stone-900 mb-2">{quiz.title}</h1>
            <div className="flex items-center gap-4 text-sm text-stone-500">
              <span>{quiz.questions.length} questions</span>
              <span>•</span>
              <span>Passing score: {quiz.passingScore}%</span>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-stone-600 font-medium">{answeredCount} of {quiz.questions.length} answered</span>
                <span className="text-emerald-600 font-bold">{progress}%</span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          {quiz.questions.map((question, qIndex) => (
            <motion.div key={question._id || qIndex} variants={fadeInUp}>
              <Card
                className={cn(
                  "border transition-all duration-200",
                  answers[qIndex] !== -1 ? "border-emerald-200 bg-emerald-50/30" : "border-stone-200"
                )}
              >
                <CardContent className="py-6">
                  <div className="flex items-start gap-4 mb-4">
                    <span className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0",
                      answers[qIndex] !== -1
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-stone-100 text-stone-600"
                    )}>
                      {qIndex + 1}
                    </span>
                    <p className="font-semibold text-stone-900 pt-1">{question.question}</p>
                  </div>

                  <div className="ml-12 space-y-2">
                    {question.options.map((option, oIndex) => (
                      <label
                        key={oIndex}
                        className={cn(
                          "flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 border",
                          answers[qIndex] === oIndex
                            ? "border-emerald-500 bg-emerald-50 shadow-sm"
                            : "border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300"
                        )}
                      >
                        <input
                          type="radio"
                          name={`question-${qIndex}`}
                          checked={answers[qIndex] === oIndex}
                          onChange={() => handleAnswerChange(qIndex, oIndex)}
                          className="sr-only"
                        />
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all",
                          answers[qIndex] === oIndex
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-stone-300"
                        )}>
                          {answers[qIndex] === oIndex && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className={cn(
                          "text-sm",
                          answers[qIndex] === oIndex ? "text-emerald-900 font-medium" : "text-stone-700"
                        )}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Submit Button */}
        <div className="sticky bottom-4 pt-4">
          <Card variant="glass" className="shadow-xl">
            <CardContent className="py-4 flex items-center justify-between">
              <p className="text-sm text-stone-600">
                {answeredCount === quiz.questions.length
                  ? "All questions answered! Ready to submit."
                  : `${quiz.questions.length - answeredCount} questions remaining`}
              </p>
              <Button
                onClick={handleSubmit}
                disabled={submitting || answers.includes(-1)}
                variant="luxury"
                className="min-w-[140px]"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default QuizPage;
