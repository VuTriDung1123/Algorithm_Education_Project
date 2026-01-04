"use client";

import { motion } from "framer-motion";
import { AnimationStep } from "@/lib/algorithms/types";

interface HeapTreeProps {
  data: AnimationStep;
  array: number[];
}

export default function HeapTree({ data, array }: HeapTreeProps) {
  // Cấu hình kích thước SVG
  const width = 800;
  const height = 400;
  const nodeRadius = 20;
  const verticalSpacing = 80;

  // Hàm tính toạ độ (x, y) cho node tại index i
  const getPosition = (index: number) => {
    const level = Math.floor(Math.log2(index + 1));
    // Số lượng node tối đa ở level này
    const maxNodesInLevel = Math.pow(2, level);
    // Thứ tự của node trong level đó (0, 1, 2...)
    const positionInLevel = index - (Math.pow(2, level) - 1);
    
    // Chia chiều rộng thành các phần bằng nhau
    const sectionWidth = width / maxNodesInLevel;
    const x = sectionWidth * positionInLevel + sectionWidth / 2;
    const y = level * verticalSpacing + 40;
    
    return { x, y };
  };

  // Hàm lấy màu sắc (Logic giống hệt Bar Chart)
  const getNodeColor = (index: number) => {
    const { type, indices, variables, sortedIndices } = data;
    const heapSize = variables.heapSize ?? 0;

    // 1. Sorted (Màu xanh lá)
    if (sortedIndices.includes(index)) return "#22c55e"; // green-500

    // 2. Parent & Child (Màu Tím & Hồng)
    if (index === variables.parent) return "#9333ea"; // purple-600
    if (index === variables.child) return "#ec4899"; // pink-500

    // 3. Actions (Compare/Swap)
    if (indices.includes(index)) {
      if (type === 'COMPARE') return "#facc15"; // yellow-400
      if (type === 'SWAP') return "#f97316"; // orange-500
    }

    // 4. Heap Area (Màu xanh mặc định) vs Out of Heap (Màu xám)
    if (index < heapSize) return "#0891b2"; // cyan-600
    
    return "#334155"; // slate-700 (Đã bị loại khỏi heap nhưng chưa sorted)
  };

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-slate-900/30 rounded-xl border border-slate-800">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {/* VẼ ĐƯỜNG NỐI (EDGES) */}
        {array.map((_, index) => {
          if (index === 0) return null; // Gốc không có cha
          const parentIndex = Math.floor((index - 1) / 2);
          const start = getPosition(parentIndex);
          const end = getPosition(index);
          
          // Kiểm tra nếu node này nằm ngoài vùng Heap thì vẽ nét đứt hoặc mờ
          const heapSize = data.variables.heapSize ?? 0;
          const isActiveEdge = index < heapSize;

          return (
            <motion.line
              key={`line-${index}`}
              x1={start.x} y1={start.y}
              x2={end.x} y2={end.y}
              stroke={isActiveEdge ? "#475569" : "#1e293b"}
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
          );
        })}

        {/* VẼ NODE (CIRCLES) */}
        {array.map((value, index) => {
          const pos = getPosition(index);
          const color = getNodeColor(index);
          const isSorted = data.sortedIndices.includes(index);

          return (
            <g key={`node-${index}`}>
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={nodeRadius}
                fill={color}
                stroke="#0f172a"
                strokeWidth="2"
                layout // Giúp node di chuyển mượt nếu toạ độ đổi (ở đây toạ độ cố định, chỉ màu đổi)
                animate={{ fill: color, scale: isSorted ? 0.8 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
              <motion.text
                x={pos.x}
                y={pos.y}
                dy=".35em"
                textAnchor="middle"
                className="text-xs font-bold font-mono"
                fill="white"
                style={{ fontSize: "12px", pointerEvents: "none" }}
              >
                {value}
              </motion.text>
              {/* Hiển thị chỉ số index nhỏ bên cạnh */}
              <text x={pos.x + 22} y={pos.y} fill="#64748b" fontSize="10" fontFamily="monospace">
                {index}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}