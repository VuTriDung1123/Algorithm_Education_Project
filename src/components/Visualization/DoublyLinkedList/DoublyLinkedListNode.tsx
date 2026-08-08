"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { ArrayNode } from "@/lib/data-structures/types";

interface DoublyLinkedListNodeProps {
  node: ArrayNode;
  isHead?: boolean;
  isTail?: boolean;
}

export default function DoublyLinkedListNode({ node, isHead, isTail }: DoublyLinkedListNodeProps) {
  const { value, address, state, auxiliary } = node;
  
  const nextAddr = (auxiliary as any)?.next || 'NULL';
  const prevAddr = (auxiliary as any)?.prev || 'NULL';

  let bgMain = "bg-slate-800";
  let bgPtr = "bg-slate-700";
  let border = "border-slate-600";
  let arrowColor = "text-slate-500";
  
  if (state === 'ACCESS') { bgMain = "bg-green-600"; border = "border-green-400"; }
  if (state === 'SELECTED') { bgMain = "bg-yellow-600"; border = "border-yellow-400"; }
  if (state === 'SHIFTING') { 
      bgMain = "bg-slate-800"; 
      bgPtr = "bg-purple-600"; 
      border = "border-purple-400"; 
      arrowColor = "text-purple-400"; 
  }
  if (state === 'DELETED') { bgMain = "bg-red-600"; border = "border-red-400"; }

  return (
    <div className="flex items-center gap-1 group">
      
      {/* KHỐI NODE */}
      <div className="relative flex flex-col items-center">
        {isHead && (
            <motion.span layoutId="head-label" className="absolute -top-7 text-[10px] font-bold text-purple-400 uppercase tracking-widest bg-slate-900 px-2 py-0.5 rounded border border-purple-900/50">
                HEAD
            </motion.span>
        )}
        {isTail && (
            <motion.span layoutId="tail-label" className="absolute -bottom-6 text-[10px] font-bold text-pink-400 uppercase tracking-widest bg-slate-900 px-2 py-0.5 rounded border border-pink-900/50">
                TAIL
            </motion.span>
        )}
        
        <span className="text-[9px] font-mono text-slate-500 mb-1">{address}</span>

        <motion.div 
            layout transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`flex items-center rounded-lg border-2 overflow-hidden shadow-lg ${border}`}
        >
            {/* PREV POINTER */}
            <div className={`w-14 h-14 flex flex-col items-center justify-center border-r border-slate-900/50 transition-colors duration-300 ${bgPtr}`}>
                <span className="text-[7px] text-slate-300 font-mono uppercase mb-0.5 opacity-70">Prev</span>
                <span className="text-[9px] font-mono font-bold text-white tracking-tight">{prevAddr}</span>
            </div>

            {/* DATA */}
            <div className={`w-14 h-14 flex items-center justify-center font-bold text-xl text-white ${bgMain}`}>
                {value}
            </div>
            
            {/* NEXT POINTER */}
            <div className={`w-14 h-14 flex flex-col items-center justify-center border-l border-slate-900/50 transition-colors duration-300 ${bgPtr}`}>
                <span className="text-[7px] text-slate-300 font-mono uppercase mb-0.5 opacity-70">Next</span>
                <span className="text-[9px] font-mono font-bold text-white tracking-tight">{nextAddr}</span>
            </div>
        </motion.div>
        <span className="mt-1 text-[9px] text-slate-600 font-mono">{node.index}</span>
      </div>

      {/* ARROWS NỐI (2 CHIỀU) */}
      <div className={`mx-1 flex flex-col items-center justify-center gap-1 transition-colors duration-300 ${arrowColor}`}>
          {nextAddr !== 'NULL' ? (
              <>
                  <ArrowRight size={18} strokeWidth={3} className="text-green-500/70" />
                  <ArrowLeft size={18} strokeWidth={3} className="text-orange-500/70" />
              </>
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