'use client'

import React, { useState } from 'react';

interface Part {
  label: string;
  price: string;
  url: string;
  imageUrl: string;
}

const PartsAgent: React.FC = () => {
  const [result, setResult] = useState<Part[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/parts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate drone parts');
      }
      const parts = await response.json();
      setResult(parts);
    } catch (error) {
      console.error('Error generating drone parts:', error);
      setResult([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter drone specifications"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Drone Parts'}
        </button>
      </form>
      {result.length > 0 && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-bold mb-2">Generated Drone Parts:</h2>
          <ul className="space-y-4">
            {result.map((part, index) => (
              <li key={index} className="border-b pb-2">
                <h3 className="font-semibold">{part.label}</h3>
                <p>Price: {part.price}</p>
                <a href={part.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  View Part
                </a>
                <img src={part.imageUrl} alt={part.label} className="mt-2 max-w-full h-auto" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PartsAgent;