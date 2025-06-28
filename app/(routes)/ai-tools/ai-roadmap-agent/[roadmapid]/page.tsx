"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import ReactFlow, { Background, Controls, MiniMap, Handle, Position } from "reactflow";
import "reactflow/dist/style.css";
import { toPng } from "html-to-image";
import dagre from "dagre";
import { jsPDF } from 'jspdf';

// Enhanced color palette for nodes (with gradients)
const nodeGradients = [
  'bg-gradient-to-br from-blue-400 to-purple-500',
  'bg-gradient-to-br from-pink-400 to-red-400',
  'bg-gradient-to-br from-green-400 to-teal-400',
  'bg-gradient-to-br from-yellow-400 to-orange-400',
  'bg-gradient-to-br from-indigo-400 to-blue-400',
  'bg-gradient-to-br from-cyan-400 to-blue-500',
  'bg-gradient-to-br from-fuchsia-400 to-pink-500',
  'bg-gradient-to-br from-lime-400 to-green-500',
  'bg-gradient-to-br from-amber-400 to-yellow-500',
  'bg-gradient-to-br from-rose-400 to-pink-500',
];

// Enhanced Custom Node Component
const CustomNode = ({ data, id, selected, xPos, yPos, ...props }: any) => {
  const colorClass = nodeGradients[parseInt(id, 10) % nodeGradients.length] || nodeGradients[0];
  const [descOpen, setDescOpen] = React.useState(false);
  return (
    <div
      className={`rounded-3xl shadow-2xl px-10 py-6 min-w-[240px] max-w-lg border-4 border-white dark:border-gray-800 ${colorClass} text-white dark:text-gray-100 transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-3xl focus:ring-4 focus:ring-blue-300 ${selected ? 'ring-4 ring-blue-400' : ''}`}
      style={{ fontSize: 22, fontWeight: 700, boxShadow: '0 8px 32px rgba(80,0,120,0.10)' }}
      tabIndex={0}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#fff', border: '2px solid #fff' }} />
      <div className="mb-2 text-2xl font-extrabold whitespace-pre-line break-words drop-shadow-lg text-center">{data.title || data.label}</div>
      <div className="flex flex-row items-center justify-between gap-4 mb-2 w-full">
        <div className="flex-1 flex justify-start">
          {data.description && (
            <button
              className="text-xs underline focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={e => { e.stopPropagation(); setDescOpen(v => !v); }}
            >
              {descOpen ? 'Hide details' : 'Show details'}
            </button>
          )}
        </div>
        <div className="flex-1 flex justify-end">
          {data.link && (
            <a href={data.link} target="_blank" rel="noopener noreferrer" className="underline text-xs text-white/90 hover:text-white font-semibold">Resource</a>
          )}
        </div>
      </div>
      {descOpen && data.description && (
        <div className="text-base opacity-95 mb-3 whitespace-pre-line break-words drop-shadow-sm text-center">
          {data.description}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: '#fff', border: '2px solid #fff' }} />
    </div>
  );
};

// Move nodeTypes outside the component
const nodeTypes = { custom: CustomNode };

const RoadmapGeneratorAgent = () => {
  const params = useParams();
  const roadmapId = params.roadmapid as string;
  const [roadmapDetails, setRoadmapDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowViewportRef = useRef<HTMLDivElement>(null);
  const [showMiniMap, setShowMiniMap] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await axios.get("/api/history?recordId=" + roadmapId);
        setRoadmapDetails(result.data?.content);
      } catch (err) {
        console.error("Failed to fetch roadmap:", err);
        setError("Failed to load roadmap. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [roadmapId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading roadmap...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!roadmapDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <p className="text-gray-600">No roadmap data found.</p>
      </div>
    );
  }

  // Dagre auto-layout setup
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  const nodeWidth = 320;
  const nodeHeight = 120;
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 80, ranksep: 120 }); // Top-to-bottom, more spacing

  roadmapDetails.initialNodes.forEach((node: any) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });
  roadmapDetails.initialEdges.forEach((edge: any) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
  dagre.layout(dagreGraph);

  const nodes = roadmapDetails.initialNodes.map((node: any, idx: number) => {
    const dagreNode = dagreGraph.node(node.id);
    return {
      id: node.id,
      type: 'custom',
      position: { x: dagreNode.x - nodeWidth / 2, y: dagreNode.y - nodeHeight / 2 },
      data: {
        ...node.data,
        label: node.data?.label || node.data?.title || `Node ${node.id}`,
      },
      style: { zIndex: 10 },
    };
  });

  // Vibrant edge colors
  const edgeColors = [
    '#6366f1', '#f43f5e', '#06b6d4', '#f59e42', '#a21caf', '#10b981', '#eab308', '#f472b6', '#3b82f6', '#84cc16',
  ];
  const edges = roadmapDetails.initialEdges.map((edge: any, idx: number) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: 'straight',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    style: { stroke: edgeColors[parseInt(edge.id, 10) % edgeColors.length], strokeWidth: 6 },
    markerEnd: {
      type: 'arrowclosed',
      color: edgeColors[parseInt(edge.id, 10) % edgeColors.length],
    },
  }));

  // Debug logs
  console.log('roadmapDetails', roadmapDetails);
  console.log('nodes', nodes);
  console.log('edges', edges);

  nodes.forEach((n: any) => console.log(`Node ${n.id} position:`, n.position));

  const handleExport = async () => {
    setShowMiniMap(false);
    setTimeout(async () => {
      const wrapper = reactFlowWrapper.current;
      if (wrapper) {
        const flow = wrapper.querySelector('.react-flow') as HTMLElement | null;
        if (flow) {
          const dataUrl = await toPng(flow, {
            cacheBust: true,
            backgroundColor: 'white',
            pixelRatio: 2,
          });
          const link = document.createElement('a');
          link.download = 'roadmap.png';
          link.href = dataUrl;
          link.click();
        }
        setShowMiniMap(true);
      } else {
        setShowMiniMap(true);
      }
    }, 200);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {roadmapDetails.roadmapTitle}
        </h2>
        <div className="flex items-center gap-4 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm font-medium">
            {roadmapDetails.estimatedDuration}
          </span>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
          {roadmapDetails.description}
        </p>
      </div>

      <div ref={reactFlowWrapper} className="relative h-[120vh] w-full rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-y-auto bg-white dark:bg-gray-900">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          minZoom={0.1}
          className="bg-white dark:bg-gray-900"
          nodeTypes={nodeTypes}
        >
          {showMiniMap && (
            <MiniMap 
              nodeColor={(n: any) => {
                if (n.type === 'turbo') return '#3b82f6';
                return '#94a3b8';
              }} 
              maskColor="rgba(255, 255, 255, 0.6)"
            />
          )}
          <Controls 
            position="top-right"
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
              border: '1px solid #e5e7eb',
            }}
          />
          <Background 
            gap={24} 
            size={1} 
            color="#e5e7eb"
          />
        </ReactFlow>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button onClick={handleExport} className="px-4 py-2 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Export as Image
        </button>
      </div>
    </div>
  );
};

export default RoadmapGeneratorAgent;