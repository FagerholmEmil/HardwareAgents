import Image from 'next/image';
import React from 'react';
import { Handle, Position } from 'reactflow';

interface FPVCustomNodeProps {
  data: {
    label: string;
    price: string;
    url: string;
    imageUrl: string;
  };
}

const FPVCustomNode: React.FC<FPVCustomNodeProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-md hover:shadow-lg transition-shadow w-64"> {/* Increased width to w-64 (256px) */}
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="relative w-full h-40 mb-2"> {/* Increased height to maintain aspect ratio */}
        <Image 
          src={data.imageUrl} 
          alt={data.label} 
          fill
          style={{ objectFit: 'cover' }}
          className="rounded"
        />
      </div>
      <h2 className="text-lg font-semibold mb-2 text-gray-800">{data.label}</h2>
      <p className="text-sm text-gray-600 mb-2">Price: {data.price}</p>
      <a
        href={data.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
      >
        View Product
      </a>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default FPVCustomNode;
