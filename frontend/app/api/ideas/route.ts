import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const perplexityClient = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: "https://api.perplexity.ai",
});

const togetherClient = new OpenAI({
  apiKey: process.env.TOGETHER_API_KEY,
  baseURL: "https://api.together.xyz/v1",
});

const llama70B = "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo";

export interface Part {
  label: string;
  price: string;
  url: string;
  imageUrl: string;
}

async function queryAgent(query: string): Promise<string[]> {
  const response = await togetherClient.chat.completions.create({
    model: llama70B,
    messages: [
      { role: "system", content: "You are an AI assistant that generates a list of parts for an FPV drone based on the given query. Return only the part names, one per line." },
      { role: "user", content: query }
    ],
    max_tokens: 500,
  });

  return response.choices[0].message.content?.split('\n').filter(part => part.trim() !== '') ?? [];
}

async function searchForParts(parts: string[]): Promise<Part[]> {
  const searchResults: Part[] = [];

  for (const part of parts) {
    const response = await perplexityClient.chat.completions.create({
      model: "llama-3.1-sonar-small-128k-online",
      messages: [
        { role: "system", content: "You are a web search assistant. Find the cheapest option for the given FPV drone part and return the result in JSON format with label, price, url, and imageUrl fields." },
        { role: "user", content: `Find the cheapest ${part} for an FPV drone` }
      ],
    });

    const result = JSON.parse(response.choices[0].message.content ?? '{}');
    searchResults.push(result);
  }

  return searchResults;
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    const partsList = await queryAgent(query);
    const parts = await searchForParts(partsList);
    return NextResponse.json({ parts });
  } catch (error) {
    console.error('Error generating drone parts:', error);
    return NextResponse.json({ error: 'Failed to generate drone parts' }, { status: 500 });
  }
}