'use client'

import React, { useState } from 'react';
import { generateMarketResearch } from '@/lib/marketResearchAgent';

const MarketResearchForm: React.FC = () => {
  const [result, setResult] = useState('');
  const [target, setTarget] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await generateMarketResearch(target);
      setResult(result);
    } catch (error) {
      console.error('Error generating market research:', error);
      setResult('An error occurred while generating market research.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Enter industry or company"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Market Research'}
        </button>
      </form>
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-bold mb-2">Generated Cold Email:</h2>
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
};

export default MarketResearchForm;