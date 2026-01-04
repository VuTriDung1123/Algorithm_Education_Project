"use client";

import { motion } from "framer-motion";
import { AnimationStep } from "@/lib/algorithms/types";

interface CountingBoardProps {
  data: AnimationStep;
  onBucketClick?: (index: number) => void;
  isPracticeMode?: boolean;
}

export default function CountingBoard({ data, onBucketClick, isPracticeMode }: CountingBoardProps) {
  const { variables, type } = data;
  const countArr = variables.countArr || [];
  const activeIndex = variables.countIndex; 

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/30 rounded-xl border border-slate-800 p-4 overflow-x-auto custom-scrollbar">
        <div className="text-xs text-slate-500 font-mono mb-4 w-full text-left">Frequency / Count Array</div>
        
        <div className="flex gap-2 items-end justify-center min-w-max">
            {countArr.map((val, idx) => {
                let bgColor = "bg-slate-800";
                let textColor = "text-slate-400";
                let scale = 1;
                let cursor = "cursor-default";

                // --- LOGIC MỚI: Ẩn Highlight & Fix số nhảy sớm ---
                const shouldHighlight = idx === activeIndex && !isPracticeMode; 
                
                // Hack hiển thị: Nếu đang Practice, ta lùi số lại 1 bước để user cảm giác "chưa cộng"
                let displayVal = val;
                if (isPracticeMode && idx === activeIndex) {
                    if (type === 'COUNT') displayVal = Math.max(0, val - 1); // Chưa đếm -> Trừ bớt 1
                    if (type === 'PLACE') displayVal = val + 1; // Chưa lấy ra -> Cộng thêm 1
                }
                // ------------------------------------------------

                if (shouldHighlight) {
                    scale = 1.1;
                    if (type === 'COUNT') { bgColor = "bg-yellow-500"; textColor = "text-black"; }
                    else if (type === 'ACCUMULATE') { bgColor = "bg-purple-500"; textColor = "text-white"; }
                    else if (type === 'PLACE') { bgColor = "bg-green-500"; textColor = "text-white"; }
                }

                if (isPracticeMode && onBucketClick) {
                    cursor = "cursor-pointer hover:ring-2 hover:ring-white";
                }

                return (
                    <button 
                        key={idx} 
                        onClick={() => isPracticeMode && onBucketClick && onBucketClick(idx)}
                        disabled={!isPracticeMode}
                        className={`flex flex-col items-center gap-1 ${cursor} transition-all focus:outline-none`}
                    >
                        <motion.div 
                            className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg border border-slate-700 shadow-lg font-bold text-lg ${bgColor} ${textColor}`}
                            // Chỉ animate màu khi không phải practice
                            animate={{ 
                                scale, 
                                backgroundColor: shouldHighlight ? (type === 'COUNT' ? '#eab308' : type === 'ACCUMULATE' ? '#a855f7' : '#22c55e') : '#1e293b' 
                            }}
                        >
                            {displayVal}
                        </motion.div>
                        
                        <span className="text-[10px] md:text-xs font-mono text-slate-500">{idx}</span>
                    </button>
                );
            })}
        </div>
        
        <div className="mt-4 flex gap-4 text-[10px] text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-500 rounded"></div> Counting</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-purple-500 rounded"></div> Accumulate</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded"></div> Decrement</div>
        </div>
    </div>
  );
}