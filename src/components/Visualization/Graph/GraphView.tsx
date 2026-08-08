"use client";
import { GraphStateData } from "@/lib/data-structures/types";
import GraphNode from "./GraphNode";
import { motion, AnimatePresence } from "framer-motion";

interface GraphViewProps {
    graph: GraphStateData;
    containerHeight?: number;
}

export default function GraphView({ graph, containerHeight = 400 }: GraphViewProps) {
    const { nodes, edges } = graph;

    return (
        <div className="relative w-full overflow-hidden" style={{ height: containerHeight }}>
            {/* SVG cho các đường nối (Edges) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5"
                        markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                    </marker>
                    <marker id="arrow-active" viewBox="0 0 10 10" refX="22" refY="5"
                        markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#facc15" />
                    </marker>
                    <marker id="arrow-found" viewBox="0 0 10 10" refX="22" refY="5"
                        markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                    </marker>
                </defs>
                <AnimatePresence>
                    {edges.map(edge => {
                        const sourceNode = nodes.find(n => n.id === edge.source);
                        const targetNode = nodes.find(n => n.id === edge.target);
                        if (!sourceNode || !targetNode) return null;

                        const strokeColor = edge.state === 'SELECTED' ? '#facc15' : (edge.state === 'FOUND' ? '#3b82f6' : '#64748b');
                        const strokeWidth = edge.state === 'SELECTED' || edge.state === 'FOUND' ? "3" : "2";
                        const markerEnd = edge.isDirected ? (edge.state === 'SELECTED' ? "url(#arrow-active)" : (edge.state === 'FOUND' ? "url(#arrow-found)" : "url(#arrow)")) : "";

                        return (
                            <g key={edge.id}>
                                <motion.line 
                                    initial={{ opacity: 0 }}
                                    animate={{ 
                                        opacity: 1,
                                        x1: `${sourceNode.x}%`, y1: `${sourceNode.y}%`, 
                                        x2: `${targetNode.x}%`, y2: `${targetNode.y}%` 
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    stroke={strokeColor} 
                                    strokeWidth={strokeWidth} 
                                    markerEnd={markerEnd}
                                />
                                {edge.weight !== undefined && (
                                    <motion.text
                                        initial={{ opacity: 0 }}
                                        animate={{
                                            opacity: 1,
                                            x: `${(sourceNode.x + targetNode.x) / 2}%`,
                                            y: `${(sourceNode.y + targetNode.y) / 2}%`
                                        }}
                                        exit={{ opacity: 0 }}
                                        fill={strokeColor}
                                        fontSize="14"
                                        fontWeight="bold"
                                        dy="-10"
                                        textAnchor="middle"
                                    >
                                        {edge.weight}
                                    </motion.text>
                                )}
                            </g>
                        );
                    })}
                </AnimatePresence>
            </svg>
            
            {/* Các Node */}
            <AnimatePresence>
                {nodes.map(node => (
                    <GraphNode key={node.id} node={node} />
                ))}
            </AnimatePresence>
        </div>
    );
}
