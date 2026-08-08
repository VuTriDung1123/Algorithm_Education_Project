"use client";

import { motion } from "framer-motion";
import { SearchStateData } from "@/lib/data-structures/types";

interface SearchViewProps {
    searchState: SearchStateData;
}

export default function SearchView({ searchState }: SearchViewProps) {
    const { array, target, left, right, mid, current, found, foundIndex } = searchState;

    return (
        <div className="flex flex-col items-center justify-center w-full mt-8 overflow-x-auto pb-12 pt-8">
            <div className="flex gap-2 relative min-w-max px-8">
                {array.map((val, idx) => {
                    let bgColor = "bg-slate-800";
                    let borderColor = "border-slate-700";
                    let scale = 1;

                    // L, R bounds styling
                    if (left !== undefined && right !== undefined && idx >= left && idx <= right) {
                        bgColor = "bg-slate-700";
                        borderColor = "border-slate-500";
                    }

                    // Currently examining
                    if (current === idx || mid === idx) {
                        bgColor = "bg-yellow-600";
                        borderColor = "border-yellow-400";
                        scale = 1.1;
                    }

                    // Found styling
                    if (found && foundIndex === idx) {
                        bgColor = "bg-green-600";
                        borderColor = "border-green-400";
                        scale = 1.15;
                    }

                    return (
                        <div key={idx} className="flex flex-col items-center">
                            {/* Pointers above */}
                            <div className="h-6 flex items-end justify-center mb-1 text-xs font-bold font-mono">
                                {left === idx && <span className="text-blue-400 mx-0.5">L</span>}
                                {mid === idx && <span className="text-yellow-400 mx-0.5">M</span>}
                                {current === idx && <span className="text-yellow-400 mx-0.5">C</span>}
                                {right === idx && <span className="text-blue-400 mx-0.5">R</span>}
                            </div>
                            
                            <motion.div
                                layout
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className={`
                                    w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg border-2 
                                    font-bold font-mono text-lg sm:text-xl shadow-lg relative text-white
                                    ${bgColor} ${borderColor}
                                `}
                                style={{ scale }}
                            >
                                {val}
                                <span className="absolute bottom-0.5 right-1 text-[8px] opacity-60 font-sans">
                                    {idx}
                                </span>
                            </motion.div>
                        </div>
                    );
                })}
            </div>
            
            {/* Target Status */}
            <div className="mt-8 px-6 py-3 bg-slate-900 border border-slate-700 rounded-xl flex items-center gap-4 text-lg">
                <span className="text-slate-400">Đang tìm Target:</span>
                <span className="font-mono font-bold text-yellow-400 text-2xl">{target}</span>
                {found !== undefined && (
                    <span className={`ml-4 font-bold ${found ? 'text-green-400' : 'text-red-400'}`}>
                        {found ? `✓ Tìm thấy tại index ${foundIndex}` : '✗ Không tìm thấy!'}
                    </span>
                )}
            </div>
        </div>
    );
}
