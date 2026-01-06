"use client";

import { motion } from "framer-motion";
import { AnimationStep } from "@/lib/algorithms/types";

interface TimSortTilesProps {
  data: AnimationStep;
  array: number[];
}

export default function TimSortTiles({ data, array }: TimSortTilesProps) {
  const { indices, sortedIndices, type, variables } = data;
  
  const isInsertionPhase = variables.keyVal !== undefined;
  const isMergePhase = variables.mid !== undefined;

  const runStart = variables.runStart ?? -1;
  const runEnd = variables.runEnd ?? -1;

  const leftStart = variables.left ?? -1;
  const mid = variables.mid ?? -1;
  const rightEnd = variables.right ?? -1;

  // Giảm kích thước Tile một chút để vừa vặn hơn
  const tileSize = 40; 

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/30 rounded-xl border border-slate-800 p-4 relative overflow-hidden">
      
      {/* Label Phase */}
      <div className="absolute top-4 left-4 flex gap-4 text-xs font-mono font-bold uppercase tracking-widest z-20">
        {isInsertionPhase && <span className="text-purple-400 bg-purple-400/10 px-2 py-1 rounded">Phase: Insertion Run</span>}
        {isMergePhase && <span className="text-blue-400 bg-blue-400/10 px-2 py-1 rounded">Phase: Merge Runs</span>}
        {!isInsertionPhase && !isMergePhase && <span className="text-slate-500">Status: {type}</span>}
      </div>

      {/* CONTAINER CHÍNH: Thêm overflow-x-auto để cuộn nếu quá dài */}
      <div className="w-full overflow-x-auto custom-scrollbar flex items-end justify-center pb-8 pt-12">
          <div className="flex gap-2 items-end min-w-max px-4">
            {array.map((value, index) => {
              let bgColor = "bg-slate-800";
              let borderColor = "border-slate-700";
              let textColor = "text-slate-500";
              let opacity = 0.4;
              let scale = 1;
              let label = null;

              // --- LOGIC MÀU SẮC (GIỮ NGUYÊN) ---
              if (isInsertionPhase) {
                if (index >= runStart && index <= runEnd) {
                    opacity = 1;
                    bgColor = "bg-slate-700";
                    textColor = "text-slate-300";
                    if (index === variables.i) {
                        bgColor = "bg-purple-600";
                        borderColor = "border-purple-400";
                        textColor = "text-white";
                        label = "KEY";
                        scale = 1.1;
                    } else if (indices.includes(index) && type === 'COMPARE') {
                        bgColor = "bg-yellow-500/20";
                        borderColor = "border-yellow-500";
                        textColor = "text-yellow-400";
                    } else if (indices.includes(index) && (type === 'SHIFT' || type === 'INSERT')) {
                        bgColor = "bg-pink-500";
                        textColor = "text-white";
                    }
                }
              } else if (isMergePhase) {
                if (index >= leftStart && index <= rightEnd) {
                    opacity = 1;
                    if (index <= mid) {
                        bgColor = "bg-blue-900/40";
                        borderColor = "border-blue-600";
                        textColor = "text-blue-300";
                    } else {
                        bgColor = "bg-orange-900/40";
                        borderColor = "border-orange-600";
                        textColor = "text-orange-300";
                    }
                    if (indices.includes(index) && type === 'COMPARE') {
                        bgColor = "bg-yellow-500";
                        textColor = "text-black";
                        scale = 1.1;
                    }
                    if (indices.includes(index) && type === 'OVERWRITE') {
                        bgColor = "bg-green-600";
                        borderColor = "border-green-400";
                        textColor = "text-white";
                    }
                }
              } else if (type === 'SORTED') {
                  opacity = 1;
                  bgColor = "bg-green-500/20";
                  borderColor = "border-green-500";
                  textColor = "text-green-400";
              }

              return (
                <div key={index} className="relative flex flex-col items-center">
                  {label && (
                      <motion.span 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="absolute -top-6 text-[10px] font-bold text-purple-400 font-mono"
                      >
                          {label}
                      </motion.span>
                  )}

                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`
                      relative flex items-center justify-center rounded-md border-2
                      ${bgColor} ${borderColor} ${textColor} font-bold font-mono text-lg shadow-sm
                    `}
                    style={{ width: tileSize, height: tileSize, opacity }}
                    animate={{ scale, backgroundColor: bgColor, borderColor: borderColor }}
                  >
                    {value}
                  </motion.div>
                  
                  <span className={`mt-2 text-[10px] font-mono ${opacity === 1 ? 'text-slate-500' : 'text-slate-800'}`}>{index}</span>
                </div>
              );
            })}
          </div>
      </div>
      
      {/* Thanh Progress */}
      {(isInsertionPhase || isMergePhase) && (
          <div className="absolute bottom-2 left-0 right-0 px-8 flex justify-center">
              <div className="h-1 bg-slate-800 rounded-full w-full max-w-md relative overflow-hidden">
                  <motion.div 
                    className={`absolute h-full ${isInsertionPhase ? 'bg-purple-500' : 'bg-blue-500'}`}
                    initial={false}
                    animate={{ 
                        left: `${((isInsertionPhase ? runStart : leftStart) / array.length) * 100}%`,
                        width: `${(((isInsertionPhase ? runEnd : rightEnd) - (isInsertionPhase ? runStart : leftStart) + 1) / array.length) * 100}%`
                    }}
                  />
              </div>
          </div>
      )}
    </div>
  );
}