"use client";
import React, { useState } from "react";
import { MdEdit, MdClose, MdArrowForward } from "react-icons/md";

interface DronePreference {
  question: string;
  options: string[];
  answer: string | null;
}

const initialPreferences: DronePreference[] = [
  {
    question: "What is your primary use case for the drone?",
    options: ["Recreational/Hobby", "Photography/Videography", "Commercial/Professional"],
    answer: "Recreational/Hobby"
  },
  {
    question: "What is your budget for the drone?",
    options: ["Under $300", "$300-$500", "$500-$800", "Over $800"],
    answer: null
  },
  {
    question: "Do you have any prior experience flying drones?",
    options: ["Yes", "No"],
    answer: "No"
  },
  {
    question: "How important is portability and ease of travel with the drone?",
    options: ["Very important", "Somewhat important", "Not important"],
    answer: "Somewhat important"
  },
  {
    question: "What camera quality and features are you looking for?",
    options: ["1080p", "4K", "6K", "8K"],
    answer: "4K camera with good stabilization"
  },
];

const DronePreferencesForm: React.FC = () => {
  const [preferences, setPreferences] = useState<DronePreference[]>(initialPreferences);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [additionalCriteria, setAdditionalCriteria] = useState<string[]>([]);
  const [newCriterion, setNewCriterion] = useState("");

  const handleAnswer = (index: number, answer: string) => {
    const updatedPreferences = [...preferences];
    updatedPreferences[index].answer = answer;
    setPreferences(updatedPreferences);
    setEditingIndex(null);
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
                    onClick={() => handleAnswer(index, option)}
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
      
      <div className="mt-4 flex">
        <input
          type="text"
          value={newCriterion}
          onChange={(e) => setNewCriterion(e.target.value)}
          placeholder="Add more (eg: 'must have X')"
          className="flex-grow bg-[#2C2F33] text-white p-2 rounded-l-lg"
        />
        <button
          onClick={handleAddCriterion}
          className="bg-[#5865F2] text-white p-2 rounded-r-lg"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default DronePreferencesForm;