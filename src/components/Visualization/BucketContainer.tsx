"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AnimationStep } from "@/lib/algorithms/types";

interface BucketContainerProps {
  data: AnimationStep;
  onBucketClick?: (index: number) => void;
  isPracticeMode?: boolean;
}

export default function BucketContainer({ data, onBucketClick, isPracticeMode }: BucketContainerProps) {
  const { variables, type } = data;
  const buckets = variables.buckets || [];
  const ranges = variables.bucketRanges || [];
  const activeBucket = variables.activeBucket;

  return (
    <div className="w-full h-full flex flex-col bg-slate-900/30 rounded-xl border border-slate-800 p-4">
        <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-slate-500 font-mono">Buckets (Ranges)</span>
            <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded">Total: {buckets.length}</span>
        </div>
        
        <div className="flex-1 grid grid-cols-5 gap-3">
            {buckets.map((bucket, idx) => {
                // 1. Logic Highlight: Chỉ sáng đèn nếu KHÔNG PHẢI Practice Mode
                const shouldHighlight = idx === activeBucket && !isPracticeMode;
                const rangeLabel = ranges[idx] || "??";

                // 2. Logic Anti-Spoiler (Chống lộ đề):
                // Nếu đang Practice, và đây là cái thùng chuẩn bị bỏ vào (activeBucket),
                // Thì ta phải TẠM ẨN phần tử vừa mới vào (phần tử cuối cùng) đi.
                const displayBucket = [...bucket];
                if (isPracticeMode && idx === activeBucket && type === 'BUCKET_SCATTER') {
                    displayBucket.pop(); // Xóa tạm phần tử cuối để user không thấy nó nằm sẵn trong đó
                }

                return (
                    <button
                        key={idx}
                        onClick={() => isPracticeMode && onBucketClick && onBucketClick(idx)}
                        disabled={!isPracticeMode} 
                        className={`
                            relative flex flex-col justify-end h-full rounded-b-xl border-b-4 border-x-2 border-t-0 
                            transition-all duration-300 focus:outline-none
                            ${shouldHighlight 
                                ? 'border-yellow-500 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
                                : 'border-slate-600 bg-slate-800/30 hover:border-slate-500'}
                            ${isPracticeMode ? 'cursor-pointer hover:bg-slate-700/50 hover:border-slate-400' : 'cursor-default'}
                        `}
                    >
                        {/* Bucket Items */}
                        <div className="flex flex-col-reverse items-center gap-1 p-2 w-full overflow-hidden mb-1">
                            <AnimatePresence>
                                {displayBucket.map((val, vIdx) => (
                                    <motion.div
                                        key={`${idx}-${vIdx}-${val}`}
                                        initial={{ opacity: 0, scale: 0, y: -20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0, y: -20 }}
                                        className="w-full text-center text-[10px] font-bold font-mono bg-blue-600 text-white rounded py-1 shadow-sm"
                                    >
                                        {val}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Bucket Label (Range) */}
                        <div className={`absolute -bottom-8 left-0 right-0 text-center text-[10px] font-mono font-bold ${shouldHighlight ? 'text-yellow-400' : 'text-slate-500'}`}>
                            [{rangeLabel}]
                        </div>
                    </button>
                );
            })}
        </div>
    </div>
  );
}