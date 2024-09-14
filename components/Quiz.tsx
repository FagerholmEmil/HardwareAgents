"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { MdOutlineSpaceBar } from "react-icons/md";
import LoadingSpinner from "./LoadingSpinner";
import UserAnswers from './UserAnswers';

interface QuizQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
}

interface QuizProps {
  topic: string;
}

const Quiz: React.FC<QuizProps> = ({ topic }) => {
  const { selectedSkill } = useParams();
  const realSkillName = decodeURIComponent(selectedSkill as string);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/quiz.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError(
          `Failed to load questions: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [topic]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      setUserAnswers(prevAnswers => ({
        ...prevAnswers,
        [currentQuestion.question]: answer
      }));
      if (answer === currentQuestion.correctAnswer) {
        setAlert("Correct answer!");
        setScore((prevScore) => prevScore + 1);
      } else {
        setAlert(
          `Wrong answer. The correct answer was ${currentQuestion.correctAnswer}.`,
        );
      }
    }
    setTimeout(loadNextQuestion, 2000);
  };

  const loadNextQuestion = () => {
    setSelectedAnswer(null);
    setAlert(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setAlert(null);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center min-h-[500px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-container bg-[#1C1C1C] text-white p-6 rounded-lg max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Error</h2>
        <p className="text-red-500">{error}</p>
        <button
          className="bg-[#6677FF] text-white p-4 rounded-lg cursor-pointer hover:bg-[#5566EE] mt-4"
          onClick={restartQuiz}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="quiz-container bg-[#1C1C1C] text-white p-6 rounded-lg max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Quiz Completed!</h2>
        <p className="text-xl mb-4">
          Your score: {score} out of {questions.length}
        </p>
        <p className="text-lg mb-6">
          Percentage: {((score / questions.length) * 100).toFixed(2)}%
        </p>
        <button
          className="bg-[#6677FF] text-white p-4 rounded-lg cursor-pointer hover:bg-[#5566EE]"
          onClick={restartQuiz}
        >
          Restart Quiz
        </button>
        <UserAnswers answers={userAnswers} />
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="text-white">No questions available.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container bg-[#1C1C1C] text-white p-6 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{currentQuestion.question}</h2>
      <p className="text-sm mb-4">
        Question {currentQuestionIndex + 1} of {questions.length}
      </p>
      <ul className="space-y-4">
        {Object.entries(currentQuestion.options).map(([key, value]) => (
          <li
            key={key}
            className={`option p-4 rounded-lg cursor-pointer transition-colors
              ${
                selectedAnswer === key
                  ? key === currentQuestion.correctAnswer
                    ? "bg-green-400 text-white"
                    : "bg-red-400"
                  : "bg-[#333333] hover:bg-[#444444]"
              }`}
            onClick={() => !selectedAnswer && handleAnswerSelect(key)}
          >
            <span className="mr-3 font-bold">{key}</span>
            {value}
          </li>
        ))}
        <li
          className="flex items-center justify-start option p-4 rounded-lg cursor-pointer transition-colors bg-[#333333] hover:bg-[#444444] gap-2"
          onClick={() => {
            setAlert("Question skipped");
            loadNextQuestion();
          }}
        >
          <MdOutlineSpaceBar className="mr-2" />
          Skip question
        </li>
      </ul>
      {alert && (
        <div className="alert bg-[#6677FF] text-white p-4 rounded-lg  mt-4">
          {alert}
        </div>
      )}
    </div>
  );
};

export default Quiz;
