"use client";
import { motion, AnimatePresence } from "framer-motion";
import { TreeNodeData } from "@/lib/data-structures/types";
import TreeNode from "./TreeNode";

interface TreeViewProps {
    nodes: TreeNodeData[];
    containerHeight?: number;
}

export default function TreeView({ nodes, containerHeight = 400 }: TreeViewProps) {
    return (
        <div className="relative w-full overflow-hidden" style={{ height: containerHeight }}>
            {/* SVG cho các đường nối (Edges) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                {nodes.map(node => {
                    if (node.left || node.right) {
                        const edges = [];
                        if (node.left) {
                            const leftChild = nodes.find(n => n.id === node.left);
                            if (leftChild && leftChild.isVisible) {
                                edges.push(
                                    <motion.line 
                                          key={`edge-l-${node.id}`} 
                                          animate={{ x1: `${node.x}%`, y1: node.y + 25, x2: `${leftChild.x}%`, y2: leftChild.y + 25 }}
                                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                          stroke="#475569" strokeWidth="2" />
                                );
                            }
                        }
                        if (node.right) {
                            const rightChild = nodes.find(n => n.id === node.right);
                            if (rightChild && rightChild.isVisible) {
                                edges.push(
                                    <motion.line 
                                          key={`edge-r-${node.id}`} 
                                          animate={{ x1: `${node.x}%`, y1: node.y + 25, x2: `${rightChild.x}%`, y2: rightChild.y + 25 }}
                                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                          stroke="#475569" strokeWidth="2" />
                                );
                            }
                        }
                        return edges;
                    } else if (node.children && node.children.length > 0) {
                        return node.children.map(childId => {
                            const child = nodes.find(n => n.id === childId);
                            if (child && child.isVisible) {
                                return (
                                    <motion.line 
                                          key={`edge-c-${node.id}-${child.id}`} 
                                          animate={{ x1: `${node.x}%`, y1: node.y + 25, x2: `${child.x}%`, y2: child.y + 25 }}
                                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                          stroke="#475569" strokeWidth="2" />
                                );
                            }
                            return null;
                        });
                    }
                    return null;
                })}
            </svg>
            
            {/* Các Node */}
            <AnimatePresence>
                {nodes.filter(n => n.isVisible).map(node => (
                    <TreeNode key={node.id} node={node} />
                ))}
            </AnimatePresence>
        </div>
    );
}
