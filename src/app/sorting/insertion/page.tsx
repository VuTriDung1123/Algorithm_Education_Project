"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, StepForward, StepBack, 
  ArrowLeft, SkipBack, SkipForward,
  ListRestart, CheckCircle2, Code2, Activity,
  Hash, ArrowRightLeft, Clock, Zap,
  Info, X, BookOpen, 
  Volume2, VolumeX, Share2, Gamepad2, Trophy, ThumbsDown,
  ArrowRight, ArrowDown // Icon mới
} from "lucide-react"; 
import Link from "next/link";
import { generateInsertionSortTimeline } from "@/lib/algorithms/insertionSort";
import { AnimationStep } from "@/lib/algorithms/types";
import { insertionSortCode, Language } from "@/lib/algorithms/codeSnippets";
import { playCompareSound, playSwapSound, playSuccessSound, playErrorSound, playNote } from "@/lib/sound";

// --- 1. CONFIG ---
const ARRAY_SIZE = 15;
const MIN_VALUE = 10;
const MAX_VALUE = 100;
const ANIMATION_SPEED_MIN = 10;
const ANIMATION_SPEED_MAX = 500;

// --- THEORY COMPONENT ---
const InsertionSortTheory = () => (
  <div className="space-y-6 text-slate-300 leading-relaxed">
    <div>
      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <Info size={20} className="text-cyan-400" /> 1. What is Insertion Sort?
      </h3>
      <p>
        <strong>Insertion Sort</strong> builds the sorted array one item at a time. It is much like sorting playing cards in your hands.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <Activity size={20} className="text-yellow-400" /> 2. How it works
      </h3>
      <ul className="list-disc pl-5 space-y-2 marker:text-yellow-500">
        <li>Pick the next element to be sorted (called the <strong>Key</strong>).</li>
        <li>Compare the Key with the elements in the sorted sub-list (to its left).</li>
        <li>Shift all elements greater than the Key to the right.</li>
        <li><strong>Insert</strong> the Key into the correct position.</li>
      </ul>
    </div>

    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
      <h3 className="text-white font-bold mb-2">Step-by-step Example: [5, 2, 4]</h3>
      <div className="font-mono text-sm space-y-2">
        <div>
          <span className="text-yellow-400 font-bold">Pass 1 (Key = 2):</span>
          <ul className="pl-4 border-l-2 border-slate-700 ml-2 mt-1 space-y-1">
             <li>Compare 2 &amp; 5. Is 5 &gt; 2? Yes.</li>
             <li>Shift 5 to right &rarr; [5, 5, 4] (2 is held in temp).</li>
             <li>Insert 2 at start &rarr; [2, 5, 4].</li>
          </ul>
        </div>
        
        <div>
          <span className="text-yellow-400 font-bold">Pass 2 (Key = 4):</span>
          <ul className="pl-4 border-l-2 border-slate-700 ml-2 mt-1 space-y-1">
             <li>Compare 4 &amp; 5. Is 5 &gt; 4? Yes.</li>
             <li>Shift 5 &rarr; [2, 5, 5].</li>
             <li>Compare 4 &amp; 2. Is 2 &gt; 4? No.</li>
             <li>Insert 4 &rarr; [2, 4, 5].</li>
          </ul>
        </div>
      </div>
    </div>

    <div>
      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <Zap size={20} className="text-red-400" /> 3. Complexity Analysis
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800 p-3 rounded border border-slate-700">
          <span className="text-slate-400 text-xs uppercase font-bold">Time Complexity</span>
          <p className="text-lg font-bold text-red-400">O(n²)</p>
          <p className="text-xs text-slate-500">Efficient for small or nearly sorted datasets.</p>
        </div>
        <div className="bg-slate-800 p-3 rounded border border-slate-700">
          <span className="text-slate-400 text-xs uppercase font-bold">Space Complexity</span>
          <p className="text-lg font-bold text-green-400">O(1)</p>
          <p className="text-xs text-slate-500">In-place sorting.</p>
        </div>
      </div>
    </div>
  </div>
);

// --- HELPER FUNCTIONS ---
const generateRandomArray = (length = ARRAY_SIZE) => Array.from({ length }, () => Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE) + MIN_VALUE));
const generateSortedArray = (length = ARRAY_SIZE) => { const step = Math.floor((MAX_VALUE - MIN_VALUE) / length); return Array.from({ length }, (_, i) => MIN_VALUE + i * step); };
const generateReverseSortedArray = (length = ARRAY_SIZE) => generateSortedArray(length).reverse();
const generateNearlySortedArray = (length = ARRAY_SIZE) => { const arr = generateSortedArray(length); for (let i = 0; i < 3; i++) { const idx1 = Math.floor(Math.random() * length); const idx2 = Math.floor(Math.random() * length); [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]]; } return arr; };

export default function InsertionSortPage() {
  return (
    <Suspense fallback={<div className="text-white text-center p-10">Loading...</div>}>
      <InsertionSortVisualizer />
    </Suspense>
  );
}

function InsertionSortVisualizer() {
  const searchParams = useSearchParams();

  // --- STATE ---
  const [initialArray, setInitialArray] = useState<number[]>([]);
  const [timeline, setTimeline] = useState<AnimationStep[]>([]);
  const [userInput, setUserInput] = useState("");

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('Pseudo');
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);
  const [practiceFeedback, setPracticeFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- INIT LOGIC ---
  useEffect(() => {
    const urlArr = searchParams.get('arr');
    let startArr: number[] = [];
    if (urlArr) {
      try { const parsed = urlArr.split(',').map(n => parseInt(n)).filter(n => !isNaN(n)); if (parsed.length > 0) startArr = parsed.slice(0, 20); } catch (e) { console.error(e); }
    }
    if (startArr.length === 0) startArr = generateRandomArray();
    loadNewArray(startArr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const loadNewArray = (newArr: number[]) => {
    const steps = generateInsertionSortTimeline(newArr);
    setInitialArray(newArr);
    setTimeline(steps);
    setCurrentStep(0);
    setIsPlaying(false);
    setElapsedTime(0);
    setUserInput(newArr.join(", "));
    setPracticeScore(0);
    setPracticeFeedback(null);
    const newUrl = `${window.location.pathname}?arr=${newArr.join(',')}`;
    window.history.replaceState({ path: newUrl }, '', newUrl);
  };

  // --- EFFECTS ---
  useEffect(() => {
    if (isMuted || currentStep === 0) return;
    const stepData = timeline[currentStep];
    if (!stepData) return;
    if (stepData.type === 'COMPARE') {
      const val = Math.max(stepData.variables.compareVal1 || 0, stepData.variables.keyVal || 0);
      playCompareSound(val);
    } else if (stepData.type === 'SHIFT') {
      playSwapSound();
    } else if (stepData.type === 'INSERT') {
      playNote(600, 'sine', 0.1); // Sound for insert
    } else if (stepData.type === 'SORTED' && currentStep === timeline.length - 1) {
      playSuccessSound();
    }
  }, [currentStep, isMuted, timeline]);

  useEffect(() => {
    let animationFrameId: number;
    if (isPlaying && !isPracticeMode) {
      timeoutRef.current = setTimeout(() => {
        setCurrentStep((prev) => {
          if (prev < timeline.length - 1) return prev + 1;
          else { setIsPlaying(false); return prev; }
        });
      }, speed);
      if (!startTimeRef.current) startTimeRef.current = Date.now() - elapsedTime * 1000;
      const updateTimer = () => {
        if (startTimeRef.current) {
          setElapsedTime((Date.now() - startTimeRef.current) / 1000);
          animationFrameId = requestAnimationFrame(updateTimer);
        }
      };
      animationFrameId = requestAnimationFrame(updateTimer);
    } else { startTimeRef.current = null; }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); if (animationFrameId) cancelAnimationFrame(animationFrameId); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, speed, timeline.length, currentStep, isPracticeMode]);

  // --- HANDLERS ---
  const handleRandomize = () => loadNewArray(generateRandomArray());
  const handleSorted = () => loadNewArray(generateSortedArray());
  const handleReverse = () => loadNewArray(generateReverseSortedArray());
  const handleNearlySorted = () => loadNewArray(generateNearlySortedArray());
  const handleUserSubmit = () => { const arr = userInput.split(",").map(num => parseInt(num.trim())).filter(num => !isNaN(num)); if (arr.length > 0) loadNewArray(arr.slice(0, 20)); else alert("Invalid input!"); };
  const handleStepForward = () => { setIsPlaying(false); if (currentStep < timeline.length - 1) setCurrentStep(c => c + 1); };
  const handleStepBackward = () => { setIsPlaying(false); if (currentStep > 0) setCurrentStep(c => c - 1); };
  const handleSkipStart = () => { setIsPlaying(false); setCurrentStep(0); setElapsedTime(0); };
  const handleSkipEnd = () => { setIsPlaying(false); setCurrentStep(timeline.length - 1); };
  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => { setIsPlaying(false); setCurrentStep(Number(e.target.value)); };
  const handleShare = () => { navigator.clipboard.writeText(window.location.href); alert("Copied URL to clipboard!"); };
  const handlePracticeModeToggle = () => { setIsPracticeMode(!isPracticeMode); setIsPlaying(false); setPracticeFeedback(null); };

  // --- PRACTICE LOGIC (INSERTION) ---
  const handlePracticeDecision = (decision: 'SHIFT' | 'INSERT') => {
    if (currentStep >= timeline.length - 1) {
        setPracticeFeedback({ type: 'success', msg: 'Finished!' });
        return;
    }

    const currentData = timeline[currentStep];
    const valCheck = currentData.variables.compareVal1 || 0; // arr[j]
    const keyVal = currentData.variables.keyVal || 0;        // key
    
    let isCorrect = false;

    // Logic: 
    // - COMPARE: arr[j] > key ? YES -> Next step is SHIFT.
    //                         ? NO  -> Next step is INSERT (or break loop).
    // - SHIFT: User predicts SHIFT.
    // - INSERT: User predicts INSERT.
    
    if (currentData.type === 'COMPARE') {
        const shouldShift = valCheck > keyVal;
        if (decision === 'SHIFT' && shouldShift) isCorrect = true;
        else if (decision === 'INSERT' && !shouldShift) isCorrect = true;
    } 
    else if (currentData.type === 'SHIFT') {
        if (decision === 'SHIFT') isCorrect = true;
    }
    else if (currentData.type === 'INSERT') {
        if (decision === 'INSERT') isCorrect = true;
    }
    else {
        handleStepForward(); // Auto skip other steps
        return;
    }

    if (isCorrect) {
      setPracticeScore(s => s + 10);
      setPracticeFeedback({ type: 'success', msg: 'Correct! +10 pts' });
      playSuccessSound();
      handleStepForward();
    } else {
      setPracticeScore(s => Math.max(0, s - 5));
      setPracticeFeedback({ type: 'error', msg: 'Wrong! Try again.' });
      playErrorSound();
    }
    setTimeout(() => setPracticeFeedback(null), 1000);
  };

  // --- RENDER ---
  const currentData = timeline[currentStep] || { arrayState: initialArray, indices: [], sortedIndices: [], type: null, message: "Ready...", variables: { i: 0, j: 0 }, counts: { comparisons: 0, swaps: 0 } };
  const isFinished = currentStep >= timeline.length - 1;

  const getBarColor = (index: number) => {
    if (!timeline.length) return "bg-cyan-500";
    if (currentData.sortedIndices.includes(index)) return "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]";
    const { type, indices, variables } = currentData;
    
    // Highlight Key (Màu Tím)
    if (index === variables.i) return "bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)]";

    if (indices.includes(index)) {
        if (type === 'SHIFT') return "bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)]";
        if (type === 'INSERT') return "bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.6)]";
        if (type === 'COMPARE') return "bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]";
    }
    return "bg-cyan-500";
  };

  const getActiveLine = () => {
    const snippet = insertionSortCode[selectedLanguage];
    if (!currentData.type) return -1;
    if (currentData.type === 'COMPARE') return snippet.highlight.COMPARE;
    if (currentData.type === 'SHIFT') return snippet.highlight.SHIFT;
    if (currentData.type === 'INSERT') return snippet.highlight.INSERT;
    return -1;
  };

  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true) }, []);
  if (!isClient) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Loading...</div>;

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-4 md:p-8 relative">
      
      {/* THEORY MODAL */}
      <AnimatePresence>
        {isTheoryOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setIsTheoryOpen(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-slate-900 border border-slate-700 w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-950"><h2 className="text-2xl font-bold text-white flex items-center gap-2"><BookOpen className="text-purple-400" /> Theory: Insertion Sort</h2><button onClick={() => setIsTheoryOpen(false)}><X size={24} /></button></div>
              <div className="p-6 overflow-y-auto custom-scrollbar"><InsertionSortTheory /></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP NAV */}
      <div className="w-full max-w-7xl mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white gap-2"><ArrowLeft size={20} /> Dashboard</Link>
        <div className="flex items-center gap-3">
             <button onClick={() => setIsMuted(!isMuted)} className="p-2 bg-slate-800 rounded-full">{isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
             <button onClick={handleShare} className="p-2 bg-slate-800 rounded-full"><Share2 size={20} /></button>
             <button onClick={handlePracticeModeToggle} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${isPracticeMode ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-300"}`}><Gamepad2 size={20} /> {isPracticeMode ? "Practice ON" : "Practice"}</button>
        </div>
      </div>

      <div className="flex justify-between items-center w-full max-w-7xl mb-6">
        <button onClick={() => setIsTheoryOpen(true)} className="group flex items-center gap-3 text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Insertion Sort Visualization <BookOpen className="text-slate-500 group-hover:text-purple-400" size={24} /></button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full max-w-7xl">
        <div className="xl:col-span-2 space-y-6">
            
            {/* VISUALIZER */}
            <div className="flex items-end justify-center gap-2 h-96 w-full bg-slate-900/50 p-8 rounded-xl border border-slate-800 relative">
                <AnimatePresence>
                  {practiceFeedback && (
                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`absolute top-10 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-bold shadow-xl z-20 ${practiceFeedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                       {practiceFeedback.type === 'success' ? <CheckCircle2 className="inline mr-2" /> : <ThumbsDown className="inline mr-2" />}{practiceFeedback.msg}
                     </motion.div>
                  )}
                </AnimatePresence>
                {currentData.arrayState.length > 0 ? currentData.arrayState.map((value, index) => (
                  <div key={index} className="flex-1 max-w-10 flex flex-col items-center gap-2">
                      <motion.div layout transition={{ type: "spring", stiffness: 300, damping: 25 }} style={{ height: `${value * 3}px` }} className={`w-full rounded-t-md relative ${getBarColor(index)}`}>
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold text-cyan-200">{value}</span>
                      </motion.div>
                      <span className="text-[10px] text-slate-500 font-mono font-semibold">{index}</span>
                  </div>
                )) : <div className="text-slate-500">Initializing...</div>}
            </div>

            {/* LEGEND */}
            <div className="flex flex-wrap justify-center gap-6 pb-2">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div><span className="text-slate-400 text-xs">Key</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-400 rounded"></div><span className="text-slate-400 text-xs">Compare</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded"></div><span className="text-slate-400 text-xs">Shift</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-pink-500 rounded"></div><span className="text-slate-400 text-xs">Insert</span></div>
            </div>

            {/* CONTROL PANEL */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
                {isPracticeMode ? (
                  <div className="flex flex-col items-center justify-center space-y-4 py-2 animate-in fade-in duration-300">
                    
                    {isFinished ? (
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold text-green-400">🎉 Algorithm Finished!</h3>
                            <p className="text-slate-400">Final Score: <span className="text-yellow-400 font-bold text-xl">{practiceScore}</span></p>
                            <button onClick={handleRandomize} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white mt-2">Try Again</button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-4 mb-2">
                               <span className="text-purple-400 font-bold uppercase tracking-widest text-sm">Question:</span>
                               <span className="text-white text-lg">
                                   Is <span className="text-yellow-400 font-bold">{currentData.variables.compareVal1}</span> &gt; Key (<span className="text-purple-400 font-bold">{currentData.variables.keyVal}</span>)?
                               </span>
                            </div>
                            
                            {/* Buttons for Compare */}
                            {currentData.type === 'COMPARE' && (
                              <div className="flex gap-4">
                                <button onClick={() => handlePracticeDecision('SHIFT')} className="px-6 py-4 bg-orange-600 hover:bg-orange-500 hover:scale-105 transition-all rounded-xl font-bold shadow-lg flex items-center gap-2"><ArrowRight /> YES (Shift)</button>
                                <button onClick={() => handlePracticeDecision('INSERT')} className="px-6 py-4 bg-pink-600 hover:bg-pink-500 hover:scale-105 transition-all rounded-xl font-bold shadow-lg flex items-center gap-2"><ArrowDown /> NO (Insert)</button>
                              </div>
                            )}

                            {/* Buttons for Shift */}
                            {currentData.type === 'SHIFT' && (
                               <div className="flex flex-col items-center gap-2">
                                   <p className="text-slate-300 text-sm italic">Shifting element...</p>
                                   <button onClick={() => handlePracticeDecision('SHIFT')} className="px-8 py-4 bg-orange-600 hover:bg-orange-500 hover:scale-105 transition-all rounded-xl font-bold text-xl shadow-lg flex items-center gap-2"><ArrowRight /> SHIFT NOW</button>
                               </div>
                            )}

                            {/* Buttons for Insert */}
                            {currentData.type === 'INSERT' && (
                               <div className="flex flex-col items-center gap-2">
                                   <p className="text-slate-300 text-sm italic">Found position for Key.</p>
                                   <button onClick={() => handlePracticeDecision('INSERT')} className="px-8 py-4 bg-pink-600 hover:bg-pink-500 hover:scale-105 transition-all rounded-xl font-bold text-xl shadow-lg flex items-center gap-2"><ArrowDown /> INSERT KEY</button>
                               </div>
                            )}
                        </>
                    )}

                    <div className="absolute top-4 right-6 flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-full border border-purple-500/30">
                       <Trophy className="text-yellow-500" size={18} /><span className="font-bold text-white">Score: {practiceScore}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row gap-4 justify-between border-b border-slate-800 pb-6">
                        <div className="flex gap-2 flex-wrap">
                            <button onClick={handleRandomize} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-300 transition-colors flex items-center gap-2"><ListRestart size={14} /> Random</button>
                            <button onClick={handleSorted} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-300">Sorted</button>
                            <button onClick={handleReverse} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-300">Reverse</button>
                            <button onClick={handleNearlySorted} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-300">Nearly Sorted</button>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono" />
                            <button onClick={handleUserSubmit} className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold flex items-center gap-2"><CheckCircle2 size={14} /> Load</button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono uppercase"><span>Step {currentStep}</span><span>Total {timeline.length - 1}</span></div>
                        <input type="range" min="0" max={Math.max(0, timeline.length - 1)} value={currentStep} onChange={handleScrub} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400" />
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-1">
                                <button onClick={handleSkipStart} disabled={currentStep === 0} className="p-2 text-slate-400 hover:text-white disabled:opacity-30"><SkipBack size={20} /></button>
                                <button onClick={handleStepBackward} disabled={currentStep === 0} className="p-2 text-slate-400 hover:text-white disabled:opacity-30"><StepBack size={20} /></button>
                                <button onClick={() => setIsPlaying(!isPlaying)} className={`w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all mx-2 ${isPlaying ? 'bg-yellow-500 text-black' : 'bg-cyan-500 text-black'}`}>
                                    {isPlaying ? <Pause fill="currentColor" size={18} /> : <Play fill="currentColor" className="ml-0.5" size={18} />}
                                </button>
                                <button onClick={handleStepForward} disabled={currentStep === timeline.length - 1} className="p-2 text-slate-400 hover:text-white disabled:opacity-30"><StepForward size={20} /></button>
                                <button onClick={handleSkipEnd} disabled={currentStep === timeline.length - 1} className="p-2 text-slate-400 hover:text-white disabled:opacity-30"><SkipForward size={20} /></button>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800"><span className="text-[10px] font-bold text-slate-500 uppercase">Speed</span><input type="range" min={ANIMATION_SPEED_MIN} max={ANIMATION_SPEED_MAX} value={ANIMATION_SPEED_MAX - speed + ANIMATION_SPEED_MIN} onChange={(e) => setSpeed(ANIMATION_SPEED_MAX - Number(e.target.value) + ANIMATION_SPEED_MIN)} className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" /></div>
                        </div>
                    </div>
                  </>
                )}
            </div>

            {/* STATUS LOG */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row gap-6">
                 <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold uppercase tracking-wider"><Activity size={16} /> Status Log</div>
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 h-24 flex items-center"><p className="text-slate-300 text-sm font-mono leading-relaxed">{currentData.message}</p></div>
                 </div>
                 <div className="w-full md:w-64 space-y-2">
                    <div className="flex items-center gap-2 text-purple-400 text-sm font-bold uppercase tracking-wider">Variables</div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-950 border border-slate-800 p-2 rounded flex justify-between items-center"><span className="text-slate-500 font-mono text-xs">i</span><span className="text-white font-mono font-bold">{currentData.variables.i}</span></div>
                        <div className="bg-slate-950 border border-slate-800 p-2 rounded flex justify-between items-center"><span className="text-slate-500 font-mono text-xs">j</span><span className="text-white font-mono font-bold">{currentData.variables.j}</span></div>
                        <div className="bg-slate-950 border border-slate-800 p-2 rounded flex justify-between items-center"><span className="text-slate-500 font-mono text-xs">arr[j]</span><span className="text-yellow-400 font-mono font-bold">{currentData.variables.compareVal1 ?? '-'}</span></div>
                        <div className="bg-slate-950 border border-slate-800 p-2 rounded flex justify-between items-center"><span className="text-slate-500 font-mono text-xs">Key</span><span className="text-purple-400 font-mono font-bold">{currentData.variables.keyVal ?? '-'}</span></div>
                    </div>
                 </div>
            </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="xl:col-span-1 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl p-4 space-y-4">
               <div className="flex items-center gap-2 text-slate-200 font-bold pb-2 border-b border-slate-800"><Zap size={18} className="text-yellow-500" /><span>Statistics</span></div>
               <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 bg-slate-950 border border-slate-800 p-3 rounded-lg flex items-center justify-between"><span className="text-slate-500 text-xs font-bold uppercase">Complexity</span><span className="text-red-400 font-mono font-bold">O(n²)</span></div>
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg"><div className="flex items-center gap-2 mb-1"><Hash size={14} className="text-blue-400" /><span className="text-slate-500 text-[10px] font-bold uppercase">Comparisons</span></div><span className="text-2xl font-mono text-white">{currentData.counts.comparisons}</span></div>
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg"><div className="flex items-center gap-2 mb-1"><ArrowRightLeft size={14} className="text-pink-400" /><span className="text-slate-500 text-[10px] font-bold uppercase">Swaps</span></div><span className="text-2xl font-mono text-white">{currentData.counts.swaps}</span></div>
                  <div className="col-span-2 bg-slate-950 border border-slate-800 p-3 rounded-lg flex items-center justify-between"><div className="flex items-center gap-2"><Clock size={14} className="text-green-400" /><span className="text-slate-500 text-[10px] font-bold uppercase">Time Elapsed</span></div><span className="text-green-400 font-mono font-bold">{elapsedTime.toFixed(2)}s</span></div>
               </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col flex-1 min-h-125">
                <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
                    <div className="flex items-center gap-2 text-slate-200 font-bold"><Code2 size={18} className="text-purple-400" /><span>Code Trace</span></div>
                    <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value as Language)} className="bg-slate-800 text-slate-200 text-xs rounded px-2 py-1 border border-slate-700 focus:outline-none focus:border-purple-500">
                        {Object.keys(insertionSortCode).map(lang => (<option key={lang} value={lang}>{lang}</option>))}
                    </select>
                </div>
                <div className="flex-1 p-4 overflow-auto bg-[#1e1e1e] font-mono text-xs md:text-sm relative">
                    <table className="w-full border-collapse">
                        <tbody>
                            {insertionSortCode[selectedLanguage].code.split('\n').map((line, i) => (
                                <tr key={i} className={`relative ${getActiveLine() === i ? 'bg-yellow-500/20' : ''}`}>
                                    <td className="w-8 text-right pr-4 text-slate-600 select-none border-r border-slate-700/50 align-top">{i + 1}</td>
                                    <td className={`pl-4 align-top whitespace-pre-wrap ${getActiveLine() === i ? 'text-yellow-100 font-bold' : 'text-slate-300'}`}>{line}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}