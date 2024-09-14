import React from 'react';

interface UserAnswersProps {
  answers: { [key: string]: string };
}

const UserAnswers: React.FC<UserAnswersProps> = ({ answers }) => {
  return (
    <div className="user-answers bg-[#1C1C1C] text-white p-6 rounded-lg max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Answers</h2>
      {Object.entries(answers).map(([question, answer], index) => (
        <div key={index} className="mb-4">
          <p className="font-semibold">{question}</p>
          <p className="ml-4">Your answer: {answer}</p>
        </div>
      ))}
    </div>
  );
};

export default UserAnswers;
