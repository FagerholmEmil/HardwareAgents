'use client'

import React, { useEffect, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import FPVCustomNode from './FPVCustomNode';

interface FPVNode {
  id: string;
  data: {
    label: string;
    price: number;
    url: string;
    imageUrl: string;
  };
}

interface FPVEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

const nodeTypes = {
  fpvNode: FPVCustomNode,
};

const FPVSchematic: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  // const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/fpvschematic.json');
      const data = await response.json();

      const gridCols = Math.ceil(Math.sqrt(data.nodes.length));
      const xSpacing = 1000;
      const ySpacing = 600;

      const flowNodes: Node[] = data.nodes.map((node: FPVNode, index: number) => ({
        id: node.id,
        type: 'fpvNode',
        data: {
          label: node.data.label,
          price: node.data.price,
          url: node.data.url,
          imageUrl: node.data.imageUrl,
        },
        position: {
          x: (index % gridCols) * xSpacing + (index % 2) * 200,
          y: Math.floor(index / gridCols) * ySpacing + (Math.floor(index / gridCols) % 2) * 200,
        },
      }));

      const flowEdges: Edge[] = data.edges.map((edge: FPVEdge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: false, // Set to false by default
        label: edge.label,
        type: 'smoothstep',
        className: 'text-xs',
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    };

    fetchData();
  }, []);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // setSelectedNode(node.id);
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        animated: edge.source === node.id || edge.target === node.id,
      }))
    );
  }, [setEdges]);

  const onPaneClick = useCallback(() => {
    // setSelectedNode(null);
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        animated: false,
      }))
    );
  }, [setEdges]);

  return (
    <div className="w-full h-[90vh] bg-white rounded-xl"> {/* Added bg-white class */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.5 }}
        minZoom={0.1}
        maxZoom={4}
        proOptions={{ hideAttribution: true }}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
      >
        <Background color="#f0f0f0" gap={0} />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'fpvNode':
                return '#3b82f6';
              default:
                return '#4B5563';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
};

export default FPVSchematic;
