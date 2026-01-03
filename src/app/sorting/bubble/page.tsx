"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, StepForward, RotateCcw, ArrowLeft } from "lucide-react"; 
import Link from "next/link";
import { generateBubbleSortSteps } from "@/lib/algorithms/bubbleSort";
import { AnimationStep } from "@/lib/algorithms/types";

export default function BubbleSortPage() {
  // --- 1. SETUP STATE & REFS ---
  const createRandomArray = () => {
    const newArray = [];
    for (let i = 0; i < 20; i++) {
      newArray.push(Math.floor(Math.random() * 90) + 10);
    }
    return newArray;
  };

  const [array, setArray] = useState<number[]>(() => createRandomArray());
  
  // Trạng thái điều khiển
  const [isSorting, setIsSorting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [delay, setDelay] = useState(100);

  // Trạng thái hiển thị
  const [highlightIndices, setHighlightIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [actionType, setActionType] = useState<'COMPARE' | 'SWAP' | 'SORTED' | null>(null);

  // REFS
  const generatorRef = useRef<Generator<AnimationStep> | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- 2. CÁC HÀM XỬ LÝ LOGIC ---
  const processNextStep = () => {
    if (!generatorRef.current) return;

    const { value, done } = generatorRef.current.next();

    if (done) {
      setIsSorting(false);
      setIsPlaying(false);
      setHighlightIndices([]);
      setActionType(null);
      return;
    }

    if (value) {
      setArray(value.arrayState);
      setHighlightIndices(value.indices);
      setActionType(value.type);
      if (value.type === 'SORTED') {
        setSortedIndices((prev) => [...prev, ...value.indices]);
      }
    }
  };

  const handleRandomize = () => {
    if (isSorting) return;
    setArray(createRandomArray());
    setSortedIndices([]);
    setHighlightIndices([]);
    setActionType(null);
  };

  const handlePlayPause = () => {
    if (!isSorting) {
      setIsSorting(true);
      setSortedIndices([]);
      generatorRef.current = generateBubbleSortSteps(array);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    if (!isSorting) {
      setIsSorting(true);
      setSortedIndices([]);
      generatorRef.current = generateBubbleSortSteps(array);
    }
    processNextStep();
  };

  // --- 3. EFFECT ---
  useEffect(() => {
    if (isPlaying) {
      timeoutRef.current = setTimeout(() => {
        processNextStep();
      }, delay);
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPlaying, delay, array]);

  // --- 4. HÀM HELPER ---
  const getBarColor = (index: number) => {
    if (sortedIndices.includes(index)) return "bg-green-500";
    if (highlightIndices.includes(index)) {
      if (actionType === 'SWAP') return "bg-red-500";
      if (actionType === 'COMPARE') return "bg-yellow-400";
    }
    return "bg-cyan-500";
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-8">
      
      {/* Header & Back Button */}
      <div className="w-full max-w-4xl mb-6">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white transition-colors gap-2 w-fit">
            <ArrowLeft size={20} /> Back to Dashboard
        </Link>
      </div>

      <div className="flex justify-between items-center w-full max-w-4xl mb-8">
        <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Bubble Sort Visualization
        </h1>
      </div>

      {/* CONTROL PANEL */}
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 p-4 rounded-xl mb-8 flex flex-col md:flex-row gap-6 items-center justify-between shadow-xl">
        
        <div className="flex gap-3">
          <button 
            onClick={handleRandomize} disabled={isSorting}
            className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-full transition-colors"
            title="Randomize Array"
          >
            <RotateCcw size={20} />
          </button>

          <button 
            onClick={handlePlayPause}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${
              isPlaying 
              ? "bg-yellow-500 text-black hover:bg-yellow-400" 
              : "bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-900/30"
            }`}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            {isPlaying ? "Pause" : isSorting ? "Resume" : "Start"}
          </button>

          <button 
            onClick={handleStepForward}
            disabled={isPlaying}
            className="p-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-colors border border-slate-600"
            title="Next Step"
          >
            <StepForward size={20} />
          </button>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto bg-slate-950/50 p-3 rounded-lg border border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase">Speed</span>
          <input 
            type="range" 
            min="10" max="1000" step="10"
            value={1010 - delay} 
            onChange={(e) => setDelay(1010 - Number(e.target.value))}
            className="w-32 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <span className="text-xs font-mono text-cyan-400 w-12 text-right">
            {delay}ms
          </span>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="flex items-end justify-center gap-2 h-96 w-full max-w-4xl bg-slate-900/50 p-8 rounded-xl border border-slate-800 backdrop-blur-sm shadow-2xl">
        {array.map((value, index) => (
          <motion.div
            key={index}
            layout 
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{ height: `${value * 3}px` }} 
            className={`w-8 rounded-t-md relative group cursor-pointer transition-colors duration-100 ${getBarColor(index)}`}
          >
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-cyan-200">
              {value}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex gap-6 text-sm text-slate-400">
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-cyan-500 rounded"></div> Idle</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-400 rounded"></div> Compare</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded"></div> Swap</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded"></div> Sorted</div>
      </div>
    </main>
  );
}