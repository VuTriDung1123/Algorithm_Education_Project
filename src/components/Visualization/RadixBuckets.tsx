"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AnimationStep } from "@/lib/algorithms/types";

interface RadixBucketsProps {
  data: AnimationStep;
}

export default function RadixBuckets({ data }: RadixBucketsProps) {
  const { variables } = data;
  const buckets = variables.buckets || Array.from({ length: 10 }, () => []);
  const activeBucket = variables.activeBucket;
  const digitPlace = variables.digitPlace || 1;

  // Format digit place (1 -> "1s", 10 -> "10s", 100 -> "100s")
  const placeLabel = digitPlace === 1 ? "1s" : digitPlace === 10 ? "10s" : digitPlace === 100 ? "100s" : `${digitPlace}s`;

  return (
    <div className="w-full h-full flex flex-col bg-slate-900/30 rounded-xl border border-slate-800 p-4">
        <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-slate-500 font-mono">LSD Buckets (0-9)</span>
            <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">Current Place: {placeLabel}</span>
        </div>
        
        <div className="flex-1 grid grid-cols-10 gap-2">
            {buckets.map((bucket, idx) => {
                const isActive = idx === activeBucket;
                
                return (
                    <div key={idx} className={`flex flex-col items-center h-full rounded-lg border transition-colors ${isActive ? 'border-yellow-500 bg-yellow-500/10' : 'border-slate-700 bg-slate-800/50'}`}>
                        {/* Bucket Label */}
                        <div className={`w-full text-center py-1 text-xs font-bold border-b ${isActive ? 'border-yellow-500 text-yellow-400' : 'border-slate-700 text-slate-400'}`}>
                            {idx}
                        </div>
                        
                        {/* Bucket Content (Stacked from bottom) */}
                        <div className="flex-1 w-full flex flex-col-reverse justify-start items-center gap-1 p-1 overflow-hidden">
                            <AnimatePresence>
                                {bucket.map((val, vIdx) => (
                                    <motion.div
                                        key={`${idx}-${val}-${vIdx}`} // Key độc nhất
                                        initial={{ opacity: 0, scale: 0.5, y: -20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.5, y: 20 }}
                                        className="w-full text-center text-[10px] md:text-xs font-mono bg-cyan-600 text-white rounded py-1 shadow-sm truncate"
                                    >
                                        {val}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
}