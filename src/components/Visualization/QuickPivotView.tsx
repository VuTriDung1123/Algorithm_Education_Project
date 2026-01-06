"use client";

import { motion } from "framer-motion";
import { AnimationStep } from "@/lib/algorithms/types";
import { Crown, ArrowUp } from "lucide-react";

interface QuickPivotViewProps {
  data: AnimationStep;
  array: number[];
}

export default function QuickPivotView({ data, array }: QuickPivotViewProps) {
  const { indices, sortedIndices, type, variables } = data;
  const pivotIdx = variables.pivotIdx; // Vị trí Pivot
  const low = variables.left;          // Cận trái vùng đang xét
  const high = variables.right;        // Cận phải vùng đang xét
  const i = variables.i;               // Con trỏ 'wall' (ranh giới nhỏ hơn)
  const j = variables.j;               // Con trỏ 'scanner' (đang chạy)

  // Cấu hình kích thước
  const boxSize = 50;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/30 rounded-xl border border-slate-800 p-8 relative overflow-hidden">
      
      {/* Legend */}
      <div className="absolute top-4 left-4 flex gap-4 text-[10px] text-slate-400 font-mono">
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-500 rounded"></div> Pivot</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded"></div> &lt; Pivot</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-700 border border-red-500 rounded"></div> &gt; Pivot</div>
      </div>

      <div className="flex gap-2 items-end justify-center relative z-10 flex-wrap min-h-[100px]">
        {array.map((value, index) => {
          // Chỉ hiển thị highlight trong vùng đang xét [low...high]
          // Các vùng khác làm mờ đi
          const isInRange = (low !== undefined && high !== undefined) ? (index >= low && index <= high) : true;
          const isPivot = index === pivotIdx;
          const isScanning = index === j;
          const isWall = index === i; // Vị trí i thường là ranh giới
          const isSorted = sortedIndices.includes(index);
          
          // Logic màu sắc
          let bgColor = "bg-slate-800";
          let borderColor = "border-slate-600";
          let scale = 1;
          const opacity = isInRange ? 1 : 0.3;
          let textColor = "text-slate-400";

          if (isSorted) {
             bgColor = "bg-green-600/20";
             borderColor = "border-green-500";
             textColor = "text-green-400";
          } else if (isPivot) {
             bgColor = "bg-yellow-600";
             borderColor = "border-yellow-400";
             textColor = "text-black";
             scale = 1.15;
          } else if (isInRange) {
             if (indices.includes(index) && type === 'SWAP') {
                 bgColor = "bg-orange-500";
                 borderColor = "border-orange-300";
                 textColor = "text-white";
             } else if (indices.includes(index) && type === 'COMPARE') {
                 bgColor = "bg-cyan-500";
                 borderColor = "border-cyan-300";
                 textColor = "text-black";
             } else {
                 // Phân loại visual dựa trên vị trí tương đối với i (Wall)
                 // Những phần tử <= i (trong vùng range) thường là < Pivot
                 if (i !== undefined && index <= i) {
                     bgColor = "bg-blue-600/30";
                     borderColor = "border-blue-500";
                 }
                 // Những phần tử > i và < pivotIdx (trong vùng range) thường là > Pivot
                 else if (i !== undefined && pivotIdx !== undefined && index > i && index < pivotIdx) {
                     bgColor = "bg-slate-800";
                     borderColor = "border-red-500/50"; // Viền đỏ nhẹ ám chỉ lớn hơn
                 }
             }
          }

          return (
            <div key={index} className="relative flex flex-col items-center">
               {/* Pivot Icon */}
               {isPivot && (
                   <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: -35, opacity: 1 }} className="absolute z-20 text-yellow-500">
                       <Crown size={24} fill="currentColor" />
                   </motion.div>
               )}

               {/* Wall Marker (Mũi tên chỉ vị trí chốt chặn i) */}
               {isWall && isInRange && !isPivot && !isSorted && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -top-8 z-10 text-blue-400 flex flex-col items-center">
                       <span className="text-[10px] font-bold">WALL</span>
                       <div className="w-0.5 h-4 bg-blue-400"></div>
                   </motion.div>
               )}

               {/* Scanner Marker (Mũi tên j) */}
               {isScanning && isInRange && !isPivot && !isSorted && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -bottom-8 z-10 text-cyan-400 flex flex-col items-center">
                       <ArrowUp size={16} />
                       <span className="text-[10px] font-bold">SCAN</span>
                   </motion.div>
               )}

               <motion.div
                layout
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`
                  relative flex items-center justify-center rounded-lg border-2
                  ${bgColor} ${borderColor} ${textColor} font-bold font-mono text-xl shadow-lg
                `}
                style={{ width: boxSize, height: boxSize, opacity }}
                animate={{ scale, backgroundColor: bgColor, borderColor: borderColor }}
              >
                {value}
              </motion.div>
              
              <span className="mt-2 text-[10px] text-slate-600 font-mono">{index}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}