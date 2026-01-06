"use client";

import { motion } from "framer-motion";
import { AnimationStep } from "@/lib/algorithms/types";
import { ArrowLeftRight } from "lucide-react";

interface ShellSortGapViewProps {
  data: AnimationStep;
  array: number[];
}

export default function ShellSortGapView({ data, array }: ShellSortGapViewProps) {
  const { indices, sortedIndices, type, variables } = data;
  
  const gap = variables.gap || 0;
  const currentIdx = variables.j; // Vị trí đang xét chèn (hoặc đang đứng)
  const compareIdx = currentIdx !== undefined && gap > 0 ? currentIdx - gap : undefined; // Vị trí so sánh (cách 1 khoảng gap)
  const tempVal = variables.tempVal; // Giá trị đang cầm trên tay (Key)

  // Kích thước Tile
  const tileSize = 45;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/30 rounded-xl border border-slate-800 p-4 relative overflow-hidden">
      
      {/* Label Gap */}
      <div className="absolute top-4 left-4 flex gap-4 text-xs font-mono font-bold uppercase tracking-widest z-20">
        <span className="text-blue-400 bg-blue-400/10 px-2 py-1 rounded">Current Gap: {gap}</span>
        {tempVal !== undefined && <span className="text-purple-400 bg-purple-400/10 px-2 py-1 rounded">Holding: {tempVal}</span>}
      </div>

      {/* CONTAINER CHÍNH: Cuộn ngang nếu mảng dài */}
      <div className="w-full overflow-x-auto custom-scrollbar flex items-end justify-center pb-8 pt-12">
          <div className="flex gap-2 items-end min-w-max px-4">
            {array.map((value, index) => {
              let bgColor = "bg-slate-800";
              let borderColor = "border-slate-700";
              let textColor = "text-slate-500";
              let opacity = 0.4;
              let scale = 1;
              let label = null;

              // Logic Highlight
              const isCurrent = index === currentIdx;
              const isCompare = index === compareIdx;
              
              // Nếu đang trong vùng sorted tạm thời hoặc đã sorted hẳn
              if (sortedIndices.includes(index)) {
                  bgColor = "bg-green-900/30";
                  borderColor = "border-green-700";
                  opacity = 0.6;
              }

              // Highlight cặp đang so sánh (Gap Pair)
              if (isCurrent || isCompare) {
                  opacity = 1;
                  scale = 1.1;
                  
                  if (isCurrent) {
                      bgColor = "bg-purple-600";
                      borderColor = "border-purple-400";
                      textColor = "text-white";
                      label = "CURR";
                  } else if (isCompare) {
                      bgColor = "bg-yellow-600";
                      borderColor = "border-yellow-400";
                      textColor = "text-white";
                      label = `-${gap}`; // Label: -Gap
                  }
              } 
              // Highlight các phần tử cùng nhóm Gap (để thấy pattern)
              else if (currentIdx !== undefined && gap > 0 && index % gap === currentIdx % gap) {
                  opacity = 0.7;
                  bgColor = "bg-slate-700";
                  borderColor = "border-blue-500/30";
              }

              // Action specific colors
              if (indices.includes(index)) {
                  if (type === 'SHIFT') {
                      bgColor = "bg-orange-500";
                      borderColor = "border-orange-300";
                  } else if (type === 'INSERT') {
                      bgColor = "bg-green-500";
                      borderColor = "border-green-300";
                  }
              }

              return (
                <div key={index} className="relative flex flex-col items-center">
                  {label && (
                      <motion.span 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="absolute -top-7 text-[10px] font-bold text-white font-mono bg-slate-900/80 px-1 rounded"
                      >
                          {label}
                      </motion.span>
                  )}

                  {/* Visual Line nối Gap (Chỉ hiện ở ô Compare hướng tới ô Current) */}
                  {isCompare && (
                      <div className="absolute top-1/2 -right-3 w-4 h-0.5 bg-yellow-500/50 z-0 hidden md:block"></div>
                  )}

                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`
                      relative flex items-center justify-center rounded-md border-2
                      ${bgColor} ${borderColor} ${textColor} font-bold font-mono text-lg shadow-lg z-10
                    `}
                    style={{ width: tileSize, height: tileSize, opacity }}
                    animate={{ scale, backgroundColor: bgColor, borderColor: borderColor }}
                  >
                    {value}
                  </motion.div>
                  
                  <span className={`mt-2 text-[10px] font-mono ${opacity === 1 ? 'text-slate-400' : 'text-slate-800'}`}>{index}</span>
                </div>
              );
            })}
          </div>
      </div>
    </div>
  );
}