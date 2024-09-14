// CrewAI
// to create agents for the following roles
// Idea Generator/Innovator
// Part Generator
// Feasibility/Practicality Analyst
// Designer/Engineer
// Critic/Reviewer
// Meta-Critic
// Supply Chain/Logistics Specialist

// use perplexity 
// to search for images of the parts
// "label": "FlyFishRC Volador II",
// "price": "$70",
// "url": "https://www.flyfish-rc.com/collections/volador-frames/products/volador-ii-vx5-o3-fpv-freestyle-t700-frame-kit?variant=42215327170740",
// "imageUrl": "https://www.flyfish-rc.com/cdn/shop/products/Volador-_-VX5-O3-FPV-Freestyle-T700-Frame-Kit-1.jpg?v=1679307928"

// Use Llama 3.1 and together ai
// to find the best parts for the drone
// find the connection between the parts
// fine tune the meta critic crewai agents 

// use agent ops to track the agents


// queryagent takes the query of what should be built and generates a list of parts based on reddit 
// that list of parts is sent to the Feasibility/Practicality Analyst, Designer/Engineer, Critic/Reviewer, Supply Chain/Logistics Specialist
// That list is then sent to the Meta-Critic (fine tuned on munger, deutsch, elon musk and reddit)
// The meta-critic can send the list back to the Feasibility/Practicality Analyst, Designer/Engineer, Critic/Reviewer, Supply Chain/Logistics Specialist
// The output is sent to the search agent that finds the cheapest parts online. it also gets the urls, images, and the price and the benefits and drawbacks of the parts

import { OpenAI } from 'openai';

// Initialize clients
const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

const togetherClient = new OpenAI({
  apiKey: process.env.TOGETHER_API_KEY,
  baseURL: "https://api.together.xyz/v1",
});

const openaiClient = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: "https://api.perplexity.ai",
});

const llama70B = "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo";
const llama31SonarSmall = "llama-3.1-sonar-small-128k-online";

function getUserInput(): Promise<string> {
  return new Promise((resolve) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question("Please enter the industry or company you want to target: ", (answer: string) => {
      readline.close();
      resolve(answer);
    });
  });
}

async function queryAgent(target: string): Promise<string[]> {
  const response = await togetherClient.chat.completions.create({
    model: llama70B,
    messages: [
      {
        role: "system",
        content: `You are an AI assistant that writes concise search queries for market research.
        Create 4 short search queries based on the given target industry or company.
        Query 01: biggest pain points faced by this avatar
        Query 02: biggest companies in this industry
        Query 03: how companies in this industry get clients
        Query 04: where to find companies in this industry online
        IMPORTANT: Respond with only the queries, one per line.`
      },
      {
        role: "user",
        content: `Here's the industry / company to perform market research on: #### ${target} ####`
      }
    ],
    max_tokens: 150,
    temperature: 0.7,
    top_p: 1,
    stop: [""]
  });

  const queries = response.choices[0].message?.content?.split('\n') ?? [];
  return queries.filter((query: string) => query.trim() !== '');
}

async function webSearchAgent(query: string): Promise<string> {
  const response = await openaiClient.chat.completions.create({
    model: llama31SonarSmall,
    messages: [
      { role: "system", content: "You are a web search assistant. Provide a concise summary of the search results." },
      { role: "user", content: `Search the web for: ${query}` }
    ],
  });

  return response.choices[0].message.content ?? '';
}

async function coldEmailAgent(target: string, searchResults: string[]): Promise<string> {
  const combinedResults = searchResults.join('\n');

  const response = await togetherClient.chat.completions.create({
    model: llama70B,
    messages: [
      {
        role: "system",
        content: `You are an expert cold email writer.
        Your task is to write concise and personalized cold emails based on the Market Research given to you.
        Make sure to utilize all 4 areas of the research (pain points, companies, clients, and online sources)
        Focus on describing what the target avatar will get, add an appealing guarantee.
        Keep the email concise and use plain English.
        DO NOT OUTPUT ANY OTHER TEXT !!! ONLY THE COLD EMAIL ITSELF!.`
      },
      {
        role: "user",
        content: `Here is the target avatar: ${target} \n Here is the market research: #### ${combinedResults} #### ONLY OUTPUT THE EMAIL ITSELF. NO OTHER TEXT!!`
      }
    ],
    max_tokens: 500,
    temperature: 0.1,
    top_p: 1,
    // Remove top_k and repetition_penalty
    stop: [""]
  });

  return response.choices[0].message.content ?? '';
}

export async function generateMarketResearch(target: string): Promise<string> {
  const generatedQueries = await queryAgent(target);
  console.log("Generated queries:", generatedQueries);

  const searchResults: string[] = [];
  for (const query of generatedQueries) {
    console.log("Searching for...", query);
    const result = await webSearchAgent(query);
    searchResults.push(result);
  }

  const coldEmail = await coldEmailAgent(target, searchResults);
  console.log("Generated cold email:");
  console.log(coldEmail);

  return coldEmail;
}