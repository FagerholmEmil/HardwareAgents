# Todo Backend

- Send Query and form to Backend via post request from frontend to localhost:3001/api/crew/<QueryId>

the input json looks like this:
{
    query: "fpv drone",
    preferences: [
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

- Backend Creates a CrewAI response
    - Crewai agents use together ai, Llama 3.1, upstage and agentops
    - The crewai agents reason about the best parts and the structure of the response
    - Serper to find the urls and image urls
    - Sends json output to frontend that looks like this:
{
"name": "FPV Drone Build",
"nodes": [
    {
    "id": "1",
    "type": "frame",
    "data": {
        "label": "FlyFishRC Volador II",
        "price": "$70",
        "url": "https://www.flyfish-rc.com/collections/volador-frames/products/volador-ii-vx5-o3-fpv-freestyle-t700-frame-kit?variant=42215327170740",
        "imageUrl": "https://www.flyfish-rc.com/cdn/shop/products/Volador-_-VX5-O3-FPV-Freestyle-T700-Frame-Kit-1.jpg?v=1679307928"
    },
    "position": { "x": 250, "y": 25 }
    },
    # and so on...
    {
    "id": "15",
    "type": "camera",
    "data": {
        "label": "DJI O3 Air Unit",
        "price": "$230",
        "url": "https://pyrodrone.com/products/dji-o3-air-unit",
        "imageUrl": "https://pyrodrone.com/cdn/shop/products/dji-o3-air-unit-_8_1200x1200.jpg?v=1669131904"
    },
    "position": { "x": 250, "y": 1350 }
    }
],
"edges": [
      {
        "id": "e1-2",
        "source": "1",
        "target": "2",
        "type": "straight",
        "label": "mounts to"
      },
      {
        "id": "e1-3",
        "source": "1",
        "target": "3",
        "type": "straight",
        "label": "connects to"
      },
      # and so on...
    ]
}

- Frontend displays response

Documentation for AgentOps: [AgentOps](https://www.loom.com/share/cfcaaef8d4a14cc7a974843bda1076bf)

Documentation for Together AI: [Together AI](https://docs.together.xyz/docs/getting-started)

Documentation for Serper: [Serper](https://serper.dev/)
    
Documentation for Upstage: [Upstage](https://upstage.ai/docs)

Documentation for CrewAI: [CrewAI](https://github.com/joaomdmoura/crewAI)
