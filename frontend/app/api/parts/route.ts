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
      { role: "system", content: "You are an AI assistant that generates a list of parts for an FPV drone based on the given query." },
      { role: "user", content: query }
    ],
    max_tokens: 500,
  });

  return response.choices[0].message.content?.split('\n') ?? [];
}

async function analyzePartsList(parts: string[], role: string): Promise<string> {
  const response = await togetherClient.chat.completions.create({
    model: llama70B,
    messages: [
      { role: "system", content: `You are a ${role} analyzing a list of FPV drone parts.` },
      { role: "user", content: `Analyze these parts: ${parts.join(', ')}` }
    ],
    max_tokens: 500,
  });

  return response.choices[0].message.content ?? '';
}

async function metaCritic(analysis: string): Promise<string> {
  const response = await togetherClient.chat.completions.create({
    model: llama70B,
    messages: [
      { role: "system", content: "You are a meta-critic AI, fine-tuned on the ideas of Charlie Munger, David Deutsch, Elon Musk, and Reddit discussions about FPV drones." },
      { role: "user", content: `Review this analysis and provide insights: ${analysis}` }
    ],
    max_tokens: 500,
  });

  return response.choices[0].message.content ?? '';
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

async function generateDroneParts(query: string): Promise<Part[]> {
  const partsList = await queryAgent(query);
  
  const analysisResults = await Promise.all([
    analyzePartsList(partsList, "Feasibility/Practicality Analyst"),
    analyzePartsList(partsList, "Designer/Engineer"),
    analyzePartsList(partsList, "Critic/Reviewer"),
    analyzePartsList(partsList, "Supply Chain/Logistics Specialist"),
  ]);

  const combinedAnalysis = analysisResults.join('\n\n');
  const metaCriticReview = await metaCritic(combinedAnalysis);

  // You can add logic here to modify the partsList based on the metaCriticReview if needed

  const finalParts = await searchForParts(partsList);

  return finalParts;
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    const parts = await generateDroneParts(query);
    return NextResponse.json(parts);
  } catch (error) {
    console.error('Error generating drone parts:', error);
    return NextResponse.json({ error: 'Failed to generate drone parts' }, { status: 500 });
  }
}