"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ArrayNode } from "@/lib/data-structures/types";

interface LinkedListNodeProps {
  node: ArrayNode;
  isHead?: boolean;
}

export default function LinkedListNode({ node, isHead }: LinkedListNodeProps) {
  const { value, address, state, auxiliary } = node;
  
  // Lấy địa chỉ Next từ biến auxiliary (do logic tính toán) hoặc mặc định là NULL
  // Đây là điểm mấu chốt để visual thấy được sự thay đổi pointer
  const nextAddr = (auxiliary as any)?.next || 'NULL';

  // Màu sắc
  let bgMain = "bg-slate-800";
  let bgNext = "bg-slate-700";
  let border = "border-slate-600";
  let arrowColor = "text-slate-500";
  
  if (state === 'ACCESS') { bgMain = "bg-green-600"; border = "border-green-400"; }
  if (state === 'SELECTED') { bgMain = "bg-yellow-600"; border = "border-yellow-400"; }
  // SHIFTING ở Linked List nghĩa là đang thao tác nối dây (Pointer Manipulation)
  if (state === 'SHIFTING') { 
      bgMain = "bg-slate-800"; 
      bgNext = "bg-purple-600"; // Highlight phần Next Pointer
      border = "border-purple-400"; 
      arrowColor = "text-purple-400"; // Mũi tên cũng đổi màu
  }
  if (state === 'DELETED') { bgMain = "bg-red-600"; border = "border-red-400"; }

  return (
    <div className="flex items-center gap-1 group">
      {/* Container Node */}
      <div className="relative flex flex-col items-center">
        {/* Label Head */}
        {isHead && (
            <motion.span layoutId="head-label" className="absolute -top-7 text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-slate-900 px-2 py-0.5 rounded border border-blue-900/50">
                HEAD
            </motion.span>
        )}
        
        {/* Address Label (Top) */}
        <span className="text-[9px] font-mono text-slate-500 mb-1">{address}</span>

        {/* THE NODE BOX */}
        <motion.div 
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`flex items-center rounded-lg border-2 overflow-hidden shadow-lg ${border}`}
        >
            {/* DATA PART */}
            <div className={`w-14 h-14 flex items-center justify-center font-bold text-xl text-white ${bgMain}`}>
                {value}
            </div>
            
            {/* POINTER PART (Hiển thị Next Address) */}
            <div className={`w-16 h-14 flex flex-col items-center justify-center border-l border-slate-900/50 transition-colors duration-300 ${bgNext}`}>
                <span className="text-[7px] text-slate-300 font-mono uppercase mb-0.5 opacity-70">Next Ptr</span>
                <span className="text-[10px] font-mono font-bold text-white tracking-tight">{nextAddr}</span>
            </div>
        </motion.div>
        
        {/* Index Label (Bottom) */}
        <span className="mt-1 text-[9px] text-slate-600 font-mono">{node.index}</span>
      </div>

      {/* ARROW CONNECTION */}
      <div className={`mx-1 transition-colors duration-300 ${arrowColor}`}>
          {nextAddr !== 'NULL' ? (
              <ArrowRight size={24} strokeWidth={3} />
          ) : (
              <div className="mx-2 flex flex-col items-center justify-center opacity-30">
                  <div className="w-px h-6 bg-slate-500"></div>
                  <div className="w-6 h-px bg-slate-500"></div>
                  <span className="text-[8px] mt-0.5">NULL</span>
              </div>
          )}
      </div>
    </div>
  );
}