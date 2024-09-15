from flask import Flask, request, jsonify
from crewai import Agent, Task, Crew, Process
from langchain.tools import Tool
from langchain_community.utilities import GoogleSerperAPIWrapper
from dotenv import load_dotenv
import json
import os
from flask_cors import CORS
from langchain_community.llms import Together
import agentops
import time
import random

# Load environment variables from .env.local
load_dotenv('.env.local')

app = Flask(__name__)
CORS(app)

# Get API keys from environment variables
TOGETHER_API_KEY = os.getenv('TOGETHER_API_KEY')
SERPER_API_KEY = os.getenv('SERPER_API_KEY')
AGENTOPS_API_KEY = os.getenv('AGENTOPS_API_KEY')

# Update the exponential_backoff function
def exponential_backoff(attempt, max_attempts=5, base_delay=1):
    if attempt >= max_attempts:
        raise Exception("Max retry attempts reached")
    delay = base_delay * (2 ** attempt) + random.uniform(0, 0.1 * (2 ** attempt))
    print(f"Rate limit hit. Retrying in {delay:.2f} seconds...")
    time.sleep(delay)

# Modify the Together initialization to include retries
def get_together_llm(max_attempts=5):
    for attempt in range(max_attempts):
        try:
            return Together(
                model="meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
                together_api_key=TOGETHER_API_KEY,
                temperature=0.7,
                max_tokens=512,
                top_p=0.7,
                top_k=50,
                repetition_penalty=1,
            )
        except ValueError as e:
            if "rate limited" in str(e).lower():
                exponential_backoff(attempt)
            else:
                raise

def agent_output_parser(agent, message):
    print(f"\n{agent.role}: {message}")
    return message

# Use the new function to initialize the LLM
together_llm = get_together_llm()

agentops.init(AGENTOPS_API_KEY)

# Initialize Serper
search = GoogleSerperAPIWrapper(serper_api_key=SERPER_API_KEY)

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
    leader = Agent(
        role='FPV Drone Project Manager',
        goal='Coordinate and oversee the FPV drone research and recommendation process, ensuring all aspects of the user\'s query and preferences are addressed',
        backstory='You are a seasoned project manager with extensive experience in the FPV drone industry. Your expertise lies in coordinating complex projects and ensuring that all team members work efficiently towards a common goal.',
        verbose=True,
        llm=together_llm,
        output_parser=agent_output_parser
    )

    researcher = Agent(
        role='FPV Drone Technical Researcher',
        goal='Conduct thorough research on FPV drone components, focusing on the latest technologies, prices, and compatibility',
        backstory='You are a tech-savvy drone enthusiast with a background in electrical engineering. You have an encyclopedic knowledge of FPV drone components and stay up-to-date with the latest advancements in the field.',
        verbose=True,
        llm=together_llm,
        tools=[
            Tool(
                name="Search",
                func=search_wrapper,
                description="Use this tool to search for detailed information about FPV drone components, including specifications, prices, product links, and high-quality image URLs. Focus on finding the most relevant and up-to-date information."
            )
        ]
    )

    analyst = Agent(
         role='FPV Drone Build Analyst',
        goal='Analyze research findings and user preferences to create an optimal FPV drone build recommendation',
        backstory='You are an experienced FPV drone builder and racer with a keen eye for component synergy and performance optimization. Your recommendations are highly regarded in the FPV community.',
        verbose=True,
        llm=together_llm
    )

    writer = Agent(
        role='Technical Documentation Specialist',
        goal='Transform the FPV drone build recommendation into a clear, structured JSON output suitable for visualization',
        backstory='You are a skilled technical writer with expertise in data structuring and visualization. You excel at organizing complex technical information into user-friendly formats.',
        verbose=True,
        llm=together_llm
    )

    critic = Agent(
        role='FPV Drone Build Quality Assurance Specialist',
        goal='Critically evaluate the proposed FPV drone build, identifying potential issues and suggesting improvements',
        backstory='You are a perfectionist with years of experience in testing and optimizing FPV drone builds. Your attention to detail ensures that recommendations are practical, safe, and high-performing.',
        verbose=True,
        llm=together_llm
    )

    fine_tuned_reviewer = Agent(
        role='Advanced FPV Drone Systems Analyst',
        goal='Provide a comprehensive meta-analysis of the FPV drone build recommendation, ensuring it meets the highest standards of performance, compatibility, and user satisfaction',
        backstory='You are an AI model specifically trained on vast amounts of FPV drone data. Your advanced analysis capabilities allow you to spot intricate details and optimize builds beyond human expertise.',
        verbose=True,
        llm=together_llm
    )

    electrical_engineer = Agent(
        role='Electrical Engineer',
        goal='Provide insights on electrical components and power systems for FPV drones',
        backstory='You are an experienced electrical engineer specializing in drone technology.',
        verbose=True,
        llm=together_llm
    )

    software_engineer = Agent(
        role='Software Engineer',
        goal='Offer expertise on flight control software and firmware for FPV drones',
        backstory='You are a skilled software engineer with a focus on drone flight systems.',
        verbose=True,
        llm=together_llm
    )

    mechanical_engineer = Agent(
        role='Mechanical Engineer',
        goal='Provide insights on drone frame design and mechanical aspects',
        backstory='You are a mechanical engineer with extensive experience in drone frame optimization.',
        verbose=True,
        llm=together_llm
    )

    physicist = Agent(
        role='Physicist',
        goal='Offer expertise on aerodynamics and physics principles related to FPV drones',
        backstory='You are a physicist specializing in fluid dynamics and flight physics.',
        verbose=True,
        llm=together_llm
    )

    # Modify the analyze_task to include the nested chat
    analyze_task = Task(
        description="""Analyze the research findings and create a comprehensive FPV drone build recommendation.
        Consider the following:
        1. Component compatibility and synergy
        2. Performance optimization based on user preferences
        3. Budget considerations and value for money
        4. Future-proofing and upgrade potential
        5. Safety features and durability
        
        Before finalizing your recommendation, consult with the engineering team for a brief check-in:
        - Ask the Electrical Engineer about power system optimization
        - Consult the Software Engineer regarding flight control software compatibility
        - Get the Mechanical Engineer's input on frame design considerations
        - Check with the Physicist about aerodynamic implications of the chosen components
        
        Keep the consultation brief, focusing on critical aspects that could impact the build.
        
        Provide a detailed rationale for each component choice, explaining how it fits into the overall build and meets the user's needs.""",
        agent=analyst,
        expected_output="A comprehensive analysis and recommendation for an FPV drone build, including insights from the engineering team",
    )

    # Add a new task for the nested chat
    engineering_consultation_task = Task(
        description="""Facilitate a brief consultation with the engineering team to validate and refine the FPV drone build recommendation.
        1. Present the current build recommendation to the team.
        2. Ask each engineer for their specific insights:
        - Electrical Engineer: Power system optimization
        - Software Engineer: Flight control software compatibility
        - Mechanical Engineer: Frame design considerations
        - Physicist: Aerodynamic implications of chosen components
        3. Collect their feedback and suggestions for improvement.
        4. Summarize the key points from the consultation.
        Keep the discussion focused and brief, aiming for critical insights rather than lengthy debates.""",
        agent=leader,
        expected_output="A summary of key insights and suggestions from the engineering team to refine the FPV drone build"
    )

    # Create tasks
    research_task = Task(
         description=f"""Conduct in-depth research on FPV drone components based on the user query: '{query}' and preferences: {json.dumps(preferences)}.
        Focus on the following:
        1. Frame options suitable for the user's skill level and intended use
        2. Compatible flight controllers, ESCs, and motors
        3. Appropriate video transmission systems
        4. Camera options that match the user's requirements
        5. Battery recommendations based on desired flight time and performance
        6. Additional components like antennas, propellers, and accessories
        For each component, provide:
        - Detailed specifications
        - Price range
        - Product links from reputable sellers
        - High-quality image URLs
        - Pros and cons
        - Compatibility notes with other recommended components""",
        agent=researcher,
        expected_output="A detailed report on FPV drone components matching the query and preferences"

    )

    analyze_task = Task(
        description="""Analyze the research findings and create a comprehensive FPV drone build recommendation.
        Consider the following:
        1. Component compatibility and synergy
        2. Performance optimization based on user preferences
        3. Budget considerations and value for money
        4. Future-proofing and upgrade potential
        5. Safety features and durability
        Provide a detailed rationale for each component choice, explaining how it fits into the overall build and meets the user's needs.""",
        agent=analyst,
        expected_output="A comprehensive analysis and recommendation for an FPV drone build",
    )

    write_task = Task(
        description="""Create a JSON output with the recommended FPV drone build, including nodes and edges for visualization.
        The output should follow this structure:
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
        Ensure all components are included as nodes, and proper connections are represented as edges.""",
        agent=writer,
        expected_output="A well-structured JSON output containing the recommended FPV drone build with visualization data"
    )

    critique_task = Task(
       description="""Thoroughly review the FPV drone build recommendation and provide critical feedback.
        Consider:
        1. Component selection and compatibility
        2. Performance expectations vs. user requirements
        3. Value for money and budget adherence
        4. Potential issues or limitations of the build
        5. Safety considerations and regulatory compliance
        6. Suggestions for alternative components or upgrades
        Provide detailed explanations for any concerns and offer constructive suggestions for improvement.""",
        agent=critic,
        expected_output="A detailed critique of the FPV drone build recommendation with suggestions for improvement"
    )

    final_review_task = Task(
        description="""Perform a comprehensive meta-review of the FPV drone build recommendation.
        Your analysis should cover:
        1. Overall system coherence and performance optimization
        2. Advanced compatibility checks and potential bottlenecks
        3. Comparison with current market trends and top-performing builds
        4. Long-term reliability and maintenance considerations
        5. Customization potential for various flying styles
        6. Compliance with international drone regulations
        Provide a final assessment of the build's quality and suggest any last-minute optimizations to create the best possible FPV drone for the user's needs.""",
        agent=fine_tuned_reviewer,
        expected_output="A comprehensive meta-review and final optimization of the FPV drone build recommendation",
    )

    # Modify the crew creation to include the new agents and task
    def create_crew_with_retry(max_attempts=5):
        for attempt in range(max_attempts):
            try:
                return Crew(
                    agents=[leader, researcher, analyst, writer, critic, fine_tuned_reviewer, 
                            electrical_engineer, software_engineer, mechanical_engineer, physicist],
                    tasks=[research_task, analyze_task, engineering_consultation_task, write_task, critique_task, final_review_task],
                    process=Process.sequential,
                    manager_llm=together_llm,
                    verbose=True 
                )

            except ValueError as e:
                if "rate limited" in str(e).lower():
                    exponential_backoff(attempt)
                else:
                    raise

    crew = create_crew_with_retry()
    
    # Wrap the kickoff in a retry mechanism as well
    def kickoff_with_retry(max_attempts=5):
        for attempt in range(max_attempts):
            try:
                return crew.kickoff()
            except ValueError as e:
                if "rate limited" in str(e).lower():
                    exponential_backoff(attempt)
                else:
                    raise

    result = kickoff_with_retry()

    # Parse the result and create the final JSON output
    try:
        output = json.loads(result)
        if not isinstance(output, dict) or "name" not in output or "nodes" not in output or "edges" not in output:
            raise ValueError("Invalid JSON structure")
    except (json.JSONDecodeError, ValueError):
        # If parsing fails or the structure is incorrect, create a default structure
        output = {
            "name": "FPV Drone Build",
            "nodes": [],
            "edges": [],
            "error": "Failed to generate proper JSON structure. Original output: " + result[:1000]  # Truncate if too long
        }

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