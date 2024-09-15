'use client'

import React, { useState } from 'react';

interface Part {
  imageUrl: string;
  label: string;
  price: string;
  url: string;
}

const IdeasAgent: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate drone parts');
      }
      const { parts } = await response.json();
      setResult(parts);
    } catch (error) {
      console.error('Error generating drone parts:', error);
      setResult([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">FPV Drone Parts Ideas</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your FPV drone query"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Generate Ideas'}
        </button>
      </form>
      {result.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.map((part, index) => (
            <div key={index} className="border p-4 rounded">
              <img src={part.imageUrl} alt={part.label} className="w-full h-40 object-cover mb-2" />
              <h2 className="font-bold">{part.label}</h2>
              <p className="text-gray-600">{part.price}</p>
              <a href={part.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                View Details
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IdeasAgent;
