from flask import Flask, request, jsonify
from crewai import Agent, Task, Crew
from langchain_openai import OpenAI
from langchain.tools import Tool
from langchain_community.utilities import GoogleSerperAPIWrapper
from dotenv import load_dotenv
import json
import os
from flask_cors import CORS
# import agentops

# Load environment variables from .env.local
load_dotenv('.env.local')

app = Flask(__name__)
CORS(app)

# Get API keys from environment variables
TOGETHER_API_KEY = os.getenv('TOGETHER_API_KEY')
SERPER_API_KEY = os.getenv('SERPER_API_KEY')
AGENTOPS_API_KEY = os.getenv('AGENTOPS_API_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
CLAUDE_API_KEY = os.getenv('CLAUDE_API_KEY')


# Initialize LLMs
openai_llm = OpenAI(api_key=OPENAI_API_KEY)
# agentops.init("53f6b4ee-2685-4a35-8d1f-9117becfd061")

# Remove or comment out the following lines:
# together_llm = OpenAI(api_key=TOGETHER_API_KEY, base_url="https://api.together.xyz")
# upstage_llm = OpenAI(api_key=UPSTAGE_API_KEY, base_url="https://api.upstage.ai")

# Initialize Serper
search = GoogleSerperAPIWrapper(serper_api_key=SERPER_API_KEY)

# Initialize AgentOps
# Note: AgentOps integration is not fully implemented in this example

@app.route('/api/crew/<query_id>', methods=['POST'])
def run_crew(query_id):
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 415

    try:
        data = request.get_json()
        query = data['query']
        preferences = data['preferences']
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400

    # Create agents
    researcher = Agent(
        role='Researcher',
        goal='Find accurate and up-to-date information about FPV drones, including prices, links, and image URLs',
        backstory='You are an expert in FPV drones with vast knowledge about various models and components.',
        llm=openai_llm,
        tools=[
            Tool(
                name="Search",
                func=search_wrapper,
                description="Useful for searching information about FPV drones and components, including prices, product links, and image URLs"
            )
        ]
    )

    analyst = Agent(
        role='Analyst',
        goal='Analyze the information and user preferences to recommend the best FPV drone build',
        backstory='You are an experienced FPV drone builder with a keen eye for matching components and user needs.',
        llm=openai_llm
    )

    writer = Agent(
        role='Technical Writer',
        goal='Create a clear and structured JSON output for the FPV drone build recommendation',
        backstory='You are skilled at organizing technical information into user-friendly formats.',
        llm=openai_llm
    )

    # Create tasks
    task1 = Task(
        description=f"Research FPV drone components based on the query: {query} and user preferences: {json.dumps(preferences)}",
        agent=researcher,
        expected_output="A detailed list of FPV drone components suitable for the user's preferences"
    )

    task2 = Task(
        description="Analyze the research results and create a recommendation for an FPV drone build",
        agent=analyst,
        expected_output="A comprehensive recommendation for an FPV drone build based on the research"
    )

    task3 = Task(
        description="""Create a JSON output with the recommended FPV drone build, including nodes and edges for visualization.
        The JSON should follow this structure:
        {
            "name": "FPV Drone Build",
            "nodes": [
                {
                    "id": "1",
                    "type": "frame",
                    "data": {
                        "label": "Component Name",
                        "price": "$XX",
                        "url": "product URL",
                        "imageUrl": "image URL"
                    },
                    "position": { "x": X, "y": Y }
                },
                // ... more nodes ...
            ],
            "edges": [
                {
                    "id": "e1-2",
                    "source": "1",
                    "target": "2",
                    "type": "straight",
                    "label": "connection type"
                },
                // ... more edges ...
            ]
        }
        Ensure all components have accurate prices, product URLs, and image URLs from the research results.""",
        agent=writer,
        expected_output="A JSON structure containing the recommended FPV drone build with nodes and edges for visualization, including prices, links, and image URLs"
    )

    # Create and run the crew
    crew = Crew(
        agents=[researcher, analyst, writer],
        tasks=[task1, task2, task3],
        verbose=True
    )

    result = crew.kickoff()

    # Parse the result and create the final JSON output
    try:
        output = json.loads(result)
    except json.JSONDecodeError:
        # If parsing fails, wrap the result in a JSON object
        output = {"recommendation": result}

    return jsonify(output), 200

def search_wrapper(*args):
    def flatten(item):
        if isinstance(item, str):
            return item
        elif isinstance(item, list):
            return ' '.join(str(i) for i in item if i is not None)
        else:
            return str(item)
    
    query = ' '.join(flatten(arg) for arg in args if arg is not None)
    return search.run(query)

if __name__ == '__main__':
    app.run(debug=True, port=3001)
