"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Play, Pause, StepForward, StepBack, 
  RotateCcw, ArrowLeft, SkipBack, SkipForward 
} from "lucide-react"; 
import Link from "next/link";
import { generateBubbleSortTimeline } from "@/lib/algorithms/bubbleSort";
import { AnimationStep } from "@/lib/algorithms/types";

// --- 1. CONFIG ---
const ARRAY_SIZE = 15;
const MIN_VALUE = 10;
const MAX_VALUE = 100;
const ANIMATION_SPEED_MIN = 10;
const ANIMATION_SPEED_MAX = 500;

const generateRandomData = () => {
  const arr = Array.from({ length: ARRAY_SIZE }, () => 
    Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE) + MIN_VALUE)
  );
  const steps = generateBubbleSortTimeline(arr);
  return { arr, steps };
};

export default function BubbleSortPage() {
  
  // --- 2. STATE ---
  const [dataState, setDataState] = useState(() => generateRandomData());

  const [initialArray, setInitialArray] = useState<number[]>(dataState.arr);
  const [timeline, setTimeline] = useState<AnimationStep[]>(dataState.steps);
  const [currentStep, setCurrentStep] = useState(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(100);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- 3. LOGIC ---
  const handleRandomize = () => {
    const newData = generateRandomData();
    setInitialArray(newData.arr);
    setTimeline(newData.steps);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isPlaying) {
      timeoutRef.current = setTimeout(() => {
        setCurrentStep((prev) => {
          if (prev < timeline.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speed);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPlaying, speed, timeline.length, currentStep]);

  // --- 4. CONTROLS HANDLERS ---
  const handleStepForward = () => {
    setIsPlaying(false);
    if (currentStep < timeline.length - 1) setCurrentStep(c => c + 1);
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    if (currentStep > 0) setCurrentStep(c => c - 1);
  };

  const handleSkipStart = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleSkipEnd = () => {
    setIsPlaying(false);
    setCurrentStep(timeline.length - 1);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPlaying(false);
    setCurrentStep(Number(e.target.value));
  };

  // --- 5. RENDER DATA HELPER ---
  const currentData = timeline[currentStep] || { 
    arrayState: initialArray, 
    indices: [], 
    sortedIndices: [], 
    type: null 
  };

  const getBarColor = (index: number) => {
    if (!timeline.length) return "bg-cyan-500";
    
    // Ưu tiên 1: Đã sort xong
    if (currentData.sortedIndices.includes(index)) {
      return "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]";
    }
    
    const { type, indices } = currentData;
    
    // Ưu tiên 2: Đang tương tác
    if (indices.includes(index)) {
        if (type === 'SWAP') return "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]";
        if (type === 'COMPARE') return "bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]";
        if (type === 'SORTED') return "bg-green-500";
    }
    
    // Mặc định
    return "bg-cyan-500";
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-8">
      
      {/* HEADER & BACK BUTTON */}
      <div className="w-full max-w-4xl mb-6">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white transition-colors gap-2 w-fit">
            <ArrowLeft size={20} /> Back to Dashboard
        </Link>
      </div>

      <div className="flex justify-between items-center w-full max-w-4xl mb-8">
        <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Bubble Sort Visualization
        </h1>
        <div className="text-slate-400 font-mono text-sm">
          Step: <span className="text-cyan-400 font-bold">{currentStep}</span> / {timeline.length - 1}
        </div>
      </div>

      {/* CONTROL PANEL */}
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-8 shadow-2xl space-y-6">
        {/* Progress Bar */}
        <div className="w-full space-y-2">
           <div className="flex justify-between text-xs text-slate-500 font-mono uppercase">
              <span>Start</span>
              <span>Progress</span>
              <span>End</span>
           </div>
           <input 
              type="range" 
              min="0" 
              max={Math.max(0, timeline.length - 1)} 
              value={currentStep}
              onChange={handleScrub}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
           />
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
                <button onClick={handleSkipStart} disabled={currentStep === 0} className="p-2 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"><SkipBack size={24} /></button>
                <button onClick={handleStepBackward} disabled={currentStep === 0} className="p-2 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"><StepBack size={24} /></button>
                
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`w-14 h-14 flex items-center justify-center rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all ${isPlaying ? 'bg-yellow-500 text-black' : 'bg-cyan-500 text-black'}`}
                >
                  {isPlaying ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" className="ml-1" size={24} />}
                </button>

                <button onClick={handleStepForward} disabled={currentStep === timeline.length - 1} className="p-2 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"><StepForward size={24} /></button>
                <button onClick={handleSkipEnd} disabled={currentStep === timeline.length - 1} className="p-2 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"><SkipForward size={24} /></button>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden md:block"></div>

            <div className="flex items-center gap-4">
               <span className="text-xs font-bold text-slate-500 uppercase w-12">Slow</span>
               <input 
                  type="range" 
                  min={ANIMATION_SPEED_MIN} max={ANIMATION_SPEED_MAX} 
                  value={ANIMATION_SPEED_MAX - speed + ANIMATION_SPEED_MIN} 
                  onChange={(e) => setSpeed(ANIMATION_SPEED_MAX - Number(e.target.value) + ANIMATION_SPEED_MIN)}
                  className="w-32 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
               />
               <span className="text-xs font-bold text-slate-500 uppercase w-12 text-right">Fast</span>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden md:block"></div>

            <button 
                onClick={handleRandomize}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold transition-colors border border-slate-700"
            >
                <RotateCcw size={16} /> Randomize
            </button>
        </div>
      </div>

      {/* VISUALIZATION AREA */}
      <div className="flex items-end justify-center gap-2 h-96 w-full max-w-4xl bg-slate-900/50 p-8 rounded-xl border border-slate-800 backdrop-blur-sm shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px)', backgroundSize: '100% 40px' }}></div>

        {currentData.arrayState.map((value, index) => (
          <motion.div
            key={index}
            layout 
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{ height: `${value * 3}px` }} 
            className={`flex-1 max-w-10 rounded-t-md relative group cursor-pointer transition-colors duration-100 ${getBarColor(index)}`}
          >
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-bold text-cyan-200">
              {value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* --- COLOR LEGEND (CHÚ THÍCH MÀU) --- */}
      <div className="flex flex-wrap justify-center gap-8 mt-8 border-t border-slate-800 pt-6 w-full max-w-4xl">
        
        {/* Màu mặc định */}
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-cyan-500 rounded shadow-sm"></div>
            <span className="text-slate-400 text-sm font-medium">Idle (Chờ)</span>
        </div>

        {/* So sánh */}
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
            <span className="text-slate-400 text-sm font-medium">Compare (So sánh)</span>
        </div>

        {/* Đổi chỗ */}
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
            <span className="text-slate-400 text-sm font-medium">Swap (Đổi chỗ)</span>
        </div>

        {/* Đã xong */}
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            <span className="text-slate-400 text-sm font-medium">Sorted (Đã xếp xong)</span>
        </div>

      </div>
    </main>
  );
}