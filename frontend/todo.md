# Shop for hardware

Todo
+ Create a form for what requirments the user has (price, time, quantity, location)
    - Make claude generate the form. 
+ Create charts of what parts are needed in a project (react flow)
    - Make claude generate the chart
    - Make the chart have a message of what suggested components are needed (like the brand)

- Create a RAG system that finds the best parts for a project online (LLama 3.1, crewai, perplexity, claude) 
    - RAG to find information on parts. So when you get the form you get some information on benefits and drawbacks of parts.

- Click on Nodes to get benefits or drawbacks of the part

- Put Everything in a shopping list

----

RAG
- Query Agent takes the query of what should be built and generates a list of parts based on reddit (claude or upstage). The limits/query of the components come from the Form. 

- that list of parts is sent to the Feasibility/Practicality Analyst, Designer/Engineer, Critic/Reviewer, Supply Chain/Logistics Specialist

- That list is then sent to the Meta-Critic (fine tuned on munger, deutsch, elon musk and reddit)

- The meta-critic can send the list back to the Feasibility/Practicality Analyst, Designer/Engineer, Critic/Reviewer, Supply Chain/Logistics Specialist

- The output is sent to the search agent that finds the cheapest parts online. it also gets the urls, images, and the price and the benefits and drawbacks of the parts

---

prompt: this is an example of all the components needed for an FPV drone. i want to build an app that can build anything in hardware and it creates a schematic of all the components. I want to create a RAG system that finds the best parts for a project online (LLama 3.1, crewai, perplexity, claude, together ai, groq). RAG to find information on parts. I want a team of agents that reson about what the best component schematic would look like. there should be multiple agents: Idea Generator/Innovator, Feasibility/Practicality Analyst, Designer/Engineer, Critic/Reviewer, Meta-Critic, Financial Analyst, Project Manager, Tester/Validator, Supply Chain/Logistics Specialist, Marketer/Business Strategist. The meta agent should be fine tuned on elon musk manufacturing skills, charlie mungers mental models and david deutsch ideas and engineering books. 

---

// CrewAI to create agents for the following roles: Idea Generator/Innovator, Part Generator, Feasibility/Practicality Analyst, Designer/Engineer, Critic/Reviewer, Meta-Critic, Supply Chain/Logistics Specialist

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

---

// CrewAI
// to create agents for the following roles
// Idea Generator/Innovator
// Part Generator
// Feasibility/Practicality Analyst
// Designer/Engineer
// Critic/Reviewer
// Meta-Critic
// Supply Chain/Logistics Specialist




































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

# Fine tune agents
- https://docs.together.ai/docs/fine-tuning-cli

Idea Generator/Innovator
Part Generator
Feasibility/Practicality Analyst
Designer/Engineer
Critic/Reviewer
Meta-Critic
Supply Chain/Logistics Specialist
Financial Analyst
Project Manager
Tester/Validator
Marketer/Business Strategist

meta reviewer
Read analog schematics for raspberry pi's and esp32's

- Create a shopping list 
- Create an agent to order the parts online
- Create a Gantt chart of the parts
- Create a chart that shows the connection of the parts

https://anvaka.github.io/sayit/?query=fpv
scrape this to get subreddits

Drag-and-drop interface for system architecture

Three.js 
Physics simulations: Matter.js or Cannon.js
D3.js or Chart.js
Socket.io for real-time collaboration features

Drone Performance Predictor:
Develop an algorithm that estimates flight time, max speed, and agility based on the selected components and frame type.

Extensive database of hardware components across categories (electronics, mechanics, materials, etc.)
Each component with detailed specs, compatibility info, and common use cases

Integrated circuit simulation
Mechanical stress analysis
Thermal modeling
Power consumption estimation

Supply Chain Integration:
Real-time pricing and availability from multiple suppliers
Lead time estimation
Automated ordering and inventory management

Regulatory Compliance Checker:
Built-in checks for various industry standards (e.g., FCC, CE, UL)
Guidance on certification processes

Prototyping Assistance:
3D printing support with optimized designs for additive manufacturing
CNC machining guidance
PCB design and fabrication integration

Documentation Generator:
Automatic creation of technical documentation
Export options for various file formats

- Create a bill of materials
- Create a Gantt chart of the build process
- Create a FMEA (Failure Mode and Effects Analysis)
- Create a EMI/EMC analysis
- Create a component lifecycle tracking chart
- Create a component tracking chart
- Create a power analysis
- Create an aerodynamics analysis
- Create a signal analysis
- Create a data logging
- Create a version control
- Create a thermal analysis

Fine tuned search for hardware

Crew.ai structure for agents searching the web
Show the build process of building a certain hardware system
Scrape: reddit, ebay, alibaba, amazon, 

Bulk buying collaboration
See what parts are missing and how long it will take to get them

Fine tuned on building an FPV drone

Focus search on forums like for fusion or fpv blogs. rank the blogs by neurodivergency. The more neurodivergent the better.

Make it automatically bid on prices for you
Make it buy components for you

- Cost estimation
- Parts recommendations
- Shopping list generator
- Node information
- Datasheet integration
- Step-by-step guide
- Community features
- What tools do i need at home to build this?
- Alternative part suggestion
- Performance estimator
- Compatibility checker
- Project variations
- Time estimator
- Failure Mode and Effects Analysis (FMEA)
- EMI/EMC Considerations
- Component Lifecycle Tracking (show chart of what will fail first)
- Components
- Power analysis
- Aerodynamics
- Performance
- Signal Analysis
- Data logging
- Version control
- Thermal analysis

