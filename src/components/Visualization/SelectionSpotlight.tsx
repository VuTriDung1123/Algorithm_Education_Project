"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AnimationStep } from "@/lib/algorithms/types";
import { Search } from "lucide-react"; // Dùng icon kính lúp cho Scanner

interface SelectionSpotlightProps {
  data: AnimationStep;
  array: number[];
}

export default function SelectionSpotlight({ data, array }: SelectionSpotlightProps) {
  const { indices, sortedIndices, type, variables } = data;
  const minIdx = variables.minIdx; // Index của số nhỏ nhất hiện tại
  const currentIdx = variables.j;  // Index đang quét (Scanner)
  
  // Cấu hình kích thước thẻ
  const cardSize = 60;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/30 rounded-xl border border-slate-800 p-8 relative overflow-hidden">
      
      {/* Label giải thích */}
      <div className="absolute top-4 left-4 flex gap-4 text-xs font-mono">
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-600 rounded"></div> Current Min</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded"></div> Scanning</div>
      </div>

      <div className="flex gap-3 items-center justify-center relative z-10 flex-wrap">
        {array.map((value, index) => {
          const isSorted = sortedIndices.includes(index);
          const isMin = index === minIdx;
          const isScanning = index === currentIdx;
          const isSwap = type === 'SWAP' && indices.includes(index);

          // Màu sắc mặc định
          let bgColor = "bg-slate-800";
          let borderColor = "border-slate-600";
          let scale = 1;
          let shadow = "";

          if (isSorted) {
            bgColor = "bg-green-500/20";
            borderColor = "border-green-500";
          } else if (isSwap) {
            bgColor = "bg-orange-500/30";
            borderColor = "border-orange-500";
            scale = 1.1;
          } else if (isMin) {
            bgColor = "bg-purple-600/40";
            borderColor = "border-purple-500";
            shadow = "shadow-[0_0_20px_rgba(147,51,234,0.6)]";
            scale = 1.1;
          } else if (isScanning) {
            borderColor = "border-yellow-400";
            shadow = "shadow-[0_0_15px_rgba(250,204,21,0.4)]";
          }

          return (
            <div key={index} className="relative flex flex-col items-center">
              {/* SCANNER ICON (Kính lúp) - Chỉ hiện khi đang quét index này */}
              <AnimatePresence>
                {isScanning && !isSorted && (
                  <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: -45, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="absolute z-20 text-yellow-400"
                  >
                    <Search size={24} strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* MIN LABEL - Chỉ hiện trên đầu minIdx */}
              <AnimatePresence>
                {isMin && !isSorted && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-8 z-20 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
                  >
                    MIN
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CARD CHÍNH */}
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`
                  relative flex items-center justify-center rounded-xl border-2
                  ${bgColor} ${borderColor} ${shadow} text-white font-bold font-mono text-xl
                `}
                style={{ width: cardSize, height: cardSize }}
                animate={{ scale, backgroundColor: isMin ? "rgba(147,51,234,0.4)" : isSwap ? "rgba(249,115,22,0.3)" : bgColor }}
              >
                {value}
              </motion.div>

              {/* Index */}
              <span className="mt-2 text-[10px] text-slate-500 font-mono">{index}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}