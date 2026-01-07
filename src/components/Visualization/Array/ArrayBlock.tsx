"use client";

import { motion } from "framer-motion";
// Đảm bảo đường dẫn import chính xác tới file types bạn vừa tạo
import { ArrayNode } from "@/lib/data-structures/types";

interface ArrayBlockProps {
  node: ArrayNode;
  isActive?: boolean; // Nếu mảng chưa full thì các ô sau sẽ mờ đi
}

export default function ArrayBlock({ node, isActive }: ArrayBlockProps) {
  const { value, index, address, state } = node;

  // Logic màu sắc dựa trên state
  let bgColor = "bg-slate-800";
  let borderColor = "border-slate-700";
  let textColor = "text-white";
  let scale = 1;
  let zIndex = 0;

  if (state === 'ACCESS') {
      bgColor = "bg-green-600";
      borderColor = "border-green-400";
      scale = 1.1;
      zIndex = 10;
  } else if (state === 'SELECTED') {
      bgColor = "bg-yellow-600";
      borderColor = "border-yellow-400";
      textColor = "text-black";
      scale = 1.1;
      zIndex = 10;
  } else if (state === 'SHIFTING') {
      bgColor = "bg-orange-600";
      borderColor = "border-orange-400";
      textColor = "text-white";
      zIndex = 5;
  } else if (state === 'FOUND') {
      bgColor = "bg-blue-600";
      borderColor = "border-blue-400";
      scale = 1.15;
      zIndex = 20;
  } else if (state === 'DELETED') {
      bgColor = "bg-red-900/50";
      borderColor = "border-red-600";
      textColor = "text-red-400";
  } else if (!isActive) {
      // Ô rác (Garbage) - Chưa dùng tới
      bgColor = "bg-slate-900/50";
      borderColor = "border-slate-800";
      textColor = "text-slate-700";
  }

  return (
    <div className="flex flex-col items-center mx-1">
      {/* Address Label (Hex) */}
      <span className="text-[10px] font-mono text-slate-500 mb-1">{address}</span>

      {/* Main Block */}
      <motion.div
        layout // Magic của Framer Motion để tự bay khi đổi vị trí (Shift)
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`
            w-16 h-16 flex items-center justify-center rounded-lg border-2 
            font-bold font-mono text-xl shadow-lg relative
            ${bgColor} ${borderColor} ${textColor}
        `}
        style={{ scale, zIndex }}
      >
        {value !== null ? value : <span className="opacity-20 text-sm">?</span>}
        
        {/* Index Label (Góc dưới phải) */}
        <span className="absolute bottom-0.5 right-1 text-[8px] opacity-60 font-sans">
            {index}
        </span>
      </motion.div>
    </div>
  );
}