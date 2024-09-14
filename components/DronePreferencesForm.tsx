"use client";
import React, { useState, useEffect } from "react";
import { MdEdit, MdClose, MdArrowForward } from "react-icons/md";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus } from "lucide-react";

interface DronePreference {
  question: string;
  options: string[];
  answer: string | null;
}

const initialPreferences: DronePreference[] = [
  {
    question: "What is your primary use case for the drone?",
    options: ["Recreational/Hobby", "Photography/Videography", "Commercial/Professional"],
    answer: null
  },
  {
    question: "What is your budget for the drone?",
    options: ["Under $300", "$300-$500", "$500-$800", "Over $800"],
    answer: null
  },
  {
    question: "Do you have any prior experience flying drones?",
    options: ["Yes", "No"],
    answer: null
  },
  {
    question: "How important is portability and ease of travel with the drone?",
    options: ["Very important", "Somewhat important", "Not important"],
    answer: null
  },
  {
    question: "What camera quality and features are you looking for?",
    options: ["1080p", "4K", "6K", "8K"],
    answer: null
  },
];

const DronePreferencesForm: React.FC = () => {
  const [preferences, setPreferences] = useState<DronePreference[]>(initialPreferences);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [additionalCriteria, setAdditionalCriteria] = useState<string[]>([]);
  const [newCriterion, setNewCriterion] = useState("");

  // Add useEffect to log preferences whenever they change
  useEffect(() => {
    console.log('Drone Preferences updated:', preferences);
  }, [preferences]);

  const handleAnswer = (answer: string) => {
    const updatedPreferences = [...preferences];
    updatedPreferences[currentQuestionIndex].answer = answer;
    setPreferences(updatedPreferences);

    if (currentQuestionIndex < preferences.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleAddCriterion = () => {
    if (newCriterion.trim()) {
      setAdditionalCriteria([...additionalCriteria, newCriterion.trim()]);
      setNewCriterion("");
    }
  };

  const handleRemoveCriterion = (index: number) => {
    setAdditionalCriteria(additionalCriteria.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddCriterion();
    }
  };

  if (!showSummary) {
    const currentQuestion = preferences[currentQuestionIndex];
    return (
      <div className="bg-[#1E2023] text-white p-6 rounded-lg max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4">{currentQuestion.question}</h2>
        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className="w-full text-left bg-[#2C2F33] p-3 rounded-lg flex justify-between items-center hover:bg-[#3E4247]"
              onClick={() => handleAnswer(option)}
            >
              {option}
              <MdArrowForward />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1E2023] text-white p-6 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Search criteria</h2>
      <p className="text-sm text-gray-400 mb-4">(edit to refine)</p>
      
      {preferences.map((pref, index) => (
        <div key={index} className="py-3 border-b border-gray-700">
          {editingIndex === index ? (
            <div>
              <p className="text-gray-300 mb-2">{pref.question}</p>
              <div className="space-y-2">
                {pref.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    className="w-full text-left bg-[#2C2F33] p-3 rounded-lg flex justify-between items-center hover:bg-[#3E4247]"
                    onClick={() => {
                      const updatedPreferences = [...preferences];
                      updatedPreferences[index].answer = option;
                      setPreferences(updatedPreferences);
                      setEditingIndex(null);
                    }}
                  >
                    {option}
                    <MdArrowForward />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-300">{pref.question}</p>
                <p className="font-semibold">{pref.answer}</p>
              </div>
              <button onClick={() => handleEdit(index)} className="text-gray-400">
                <MdEdit size={20} />
              </button>
            </div>
          )}
        </div>
      ))}
      
      {additionalCriteria.map((criterion, index) => (
        <div key={index} className="flex justify-between items-center py-3 border-b border-gray-700">
          <p>{criterion}</p>
          <button onClick={() => handleRemoveCriterion(index)} className="text-gray-400">
            <MdClose size={20} />
          </button>
        </div>
      ))}
      
      <div className="mt-4 flex group">
        <Input
          type="text"
          value={newCriterion}
          onChange={(e) => setNewCriterion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add more (eg: 'must have X')"
          className="flex-grow bg-[#2C2F33] text-white rounded-r-none border-0 focus:ring-2 focus:ring-[#5865F2] transition-all duration-300 ease-in-out placeholder-gray-500"
        />
        <Button
          onClick={handleAddCriterion}
          className="bg-[#5865F2] text-white rounded-l-none hover:bg-[#4752C4] transition-colors duration-300 ease-in-out group-hover:bg-[#4752C4]"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DronePreferencesForm;