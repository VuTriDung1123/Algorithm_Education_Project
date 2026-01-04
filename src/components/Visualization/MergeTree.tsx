"use client";

import { motion } from "framer-motion";
import { AnimationStep } from "@/lib/algorithms/types";
import { useMemo } from "react";

interface MergeTreeProps {
  data: AnimationStep;
  array: number[];
}

// Định nghĩa kiểu dữ liệu cho một Node trên cây Merge
interface TreeNode {
  left: number;
  right: number;
  x: number;
  y: number;
  level: number;
  children: TreeNode[];
}

export default function MergeTree({ data, array }: MergeTreeProps) {
  const width = 800;
  const height = 400;
  const nodeRadius = 18;
  const levelHeight = 70;

  // Hàm đệ quy để tính toán vị trí các Node (Chỉ chạy 1 lần khi mảng đổi kích thước)
  const treeStructure = useMemo(() => {
    const buildTree = (l: number, r: number, x: number, y: number, level: number, parentWidth: number): TreeNode => {
      const node: TreeNode = { left: l, right: r, x, y, level, children: [] };
      
      if (l < r) {
        const mid = Math.floor((l + r) / 2);
        const nextY = y + levelHeight;
        // Chia chiều ngang cho con dựa trên số lượng phần tử
        const offset = parentWidth / 2;
        
        node.children.push(buildTree(l, mid, x - offset / 2, nextY, level + 1, offset));
        node.children.push(buildTree(mid + 1, r, x + offset / 2, nextY, level + 1, offset));
      }
      return node;
    };

    return buildTree(0, array.length - 1, width / 2, 40, 0, width);
  }, [array.length]);

  // Hàm render đệ quy để vẽ các đường nối (Edges)
  const renderEdges = (node: TreeNode) => {
    return (
      <g key={`edges-${node.left}-${node.right}`}>
        {node.children.map((child) => (
          <g key={`edge-${node.left}-${node.right}-to-${child.left}-${child.right}`}>
            <motion.line
              x1={node.x} y1={node.y}
              x2={child.x} y2={child.y}
              stroke="#334155" // slate-700
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
            {renderEdges(child)}
          </g>
        ))}
      </g>
    );
  };

  // Hàm render đệ quy để vẽ các Node
  const renderNodes = (node: TreeNode) => {
    // Logic tô màu
    const { variables, indices, type } = data;
    const currentLeft = variables.left ?? -1;
    const currentRight = variables.right ?? -1;
    
    // Kiểm tra xem Node này có nằm trong vùng đang xử lý không
    const isActiveRange = node.left >= currentLeft && node.right <= currentRight;
    const isExactMatch = node.left === currentLeft && node.right === currentRight;

    // Màu mặc định
    let fillColor = "#1e293b"; // slate-800
    let strokeColor = "#475569"; // slate-600
    let scale = 1;

    // 1. Highlight Node đang được gọi đệ quy (Chính xác range hiện tại)
    if (isExactMatch) {
        fillColor = "#9333ea"; // purple-600 (Focus Range)
        strokeColor = "#d8b4fe";
        scale = 1.2;
    } 
    // 2. Highlight vùng con đang được merge/xử lý
    else if (isActiveRange) {
        fillColor = "#0f172a"; // slate-900
        strokeColor = "#9333ea"; // viền tím
    }

    // 3. Highlight lá (Leaf Nodes) - Hiển thị giá trị mảng
    const isLeaf = node.left === node.right;
    let label = isLeaf ? array[node.left].toString() : ""; // Chỉ hiện số ở lá
    
    // Nếu là lá và đang được so sánh/ghi đè
    if (isLeaf && indices.includes(node.left)) {
        if (type === 'COMPARE') { fillColor = "#facc15"; label = array[node.left].toString(); } // yellow
        if (type === 'OVERWRITE') { fillColor = "#22c55e"; label = array[node.left].toString(); } // green
    }

    return (
      <g key={`node-${node.left}-${node.right}`}>
        <motion.circle
          cx={node.x} cy={node.y}
          r={isLeaf ? 20 : 10} // Node lá to hơn để chứa số
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
          animate={{ scale, fill: fillColor, stroke: strokeColor }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Hiển thị giá trị (chỉ cho Leaf Node) */}
        {isLeaf && (
            <text x={node.x} y={node.y} dy=".35em" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="monospace">
                {label}
            </text>
        )}

        {/* Hiển thị range nhỏ bên cạnh (cho Internal Node) để dễ theo dõi */}
        {!isLeaf && isExactMatch && (
             <text x={node.x + 15} y={node.y} fill="#a855f7" fontSize="10">
                 [{node.left}-{node.right}]
             </text>
        )}

        {node.children.map(renderNodes)}
      </g>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-slate-900/30 rounded-xl border border-slate-800 relative">
        <div className="absolute top-2 left-4 text-xs text-slate-500 font-mono">Recursion Tree View</div>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
            {renderEdges(treeStructure)}
            {renderNodes(treeStructure)}
        </svg>
    </div>
  );
}