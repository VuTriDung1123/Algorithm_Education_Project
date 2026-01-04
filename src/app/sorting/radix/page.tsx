"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, StepForward, 
  ArrowLeft,
  ListRestart, CheckCircle2, Code2, Activity,
  Hash, ArrowRightLeft, Clock, Zap,
  Info, X, BookOpen, 
  Volume2, VolumeX, Share2, Gamepad2, Trophy, ThumbsDown,
  ArrowDown
} from "lucide-react"; 
import Link from "next/link";
import { generateRadixSortTimeline } from "@/lib/algorithms/radixSort";
import { AnimationStep } from "@/lib/algorithms/types";
import { radixSortCode, Language } from "@/lib/algorithms/codeSnippets";
import { playSuccessSound, playNote, playErrorSound } from "@/lib/sound";
import RadixBuckets from "@/components/Visualization/RadixBuckets";

// --- 1. CONFIG ---
const ARRAY_SIZE = 12;
const MIN_VALUE = 10;
const MAX_VALUE = 999;
const ANIMATION_SPEED_MIN = 10;
const ANIMATION_SPEED_MAX = 500;

const RadixSortTheory = () => (
  <div className="space-y-6 text-slate-300 leading-relaxed">
    <div><h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Info size={20} className="text-cyan-400" /> 1. What is Radix Sort?</h3><p><strong>Radix Sort</strong> is a non-comparative sorting algorithm. It avoids comparison by creating and distributing elements into buckets according to their radix.</p></div>
    <div><h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Activity size={20} className="text-yellow-400" /> 2. How it works</h3><ul className="list-disc pl-5 space-y-2 marker:text-yellow-500"><li>Start with the <strong>Least Significant Digit (LSD)</strong>.</li><li>Group numbers into buckets (0-9).</li><li>Collect numbers back.</li><li>Repeat for next digit.</li></ul></div>
    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700"><h3 className="text-white font-bold mb-2">Complexity</h3><p className="text-green-400 font-mono">Time: O(nk)</p><p className="text-yellow-400 font-mono">Space: O(n+k)</p></div>
  </div>
);

// --- HELPER FUNCTIONS ---
const generateRandomArray = () => Array.from({ length: ARRAY_SIZE }, () => Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1) + MIN_VALUE));
const generateSortedArray = () => { const arr = generateRandomArray(); return arr.sort((a,b) => a-b); };
const generateReverseSortedArray = () => generateSortedArray().reverse();

export default function RadixSortPage() {
  return (
    <Suspense fallback={<div className="text-white text-center p-10">Loading...</div>}>
      <RadixSortVisualizer />
    </Suspense>
  );
}

function RadixSortVisualizer() {
  const searchParams = useSearchParams();
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

  useEffect(() => {
    const urlArr = searchParams.get('arr');
    let startArr: number[] = [];
    if (urlArr) { try { const parsed = urlArr.split(',').map(n => parseInt(n)).filter(n => !isNaN(n)); if (parsed.length > 0) startArr = parsed.slice(0, 20); } catch (e) { console.error(e); } }
    if (startArr.length === 0) startArr = generateRandomArray();
    loadNewArray(startArr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const loadNewArray = (newArr: number[]) => {
    const steps = generateRadixSortTimeline(newArr);
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

  useEffect(() => {
    if (isMuted || currentStep === 0) return;
    const stepData = timeline[currentStep];
    if (!stepData) return;
    if (stepData.type === 'GET_DIGIT') playNote(400, 'sine', 0.05);
    else if (stepData.type === 'BUCKET_PUSH') playNote(300 + (stepData.variables.digitVal || 0) * 30, 'square', 0.1); 
    else if (stepData.type === 'BUCKET_POP') playNote(600, 'triangle', 0.1);
    else if (stepData.type === 'SORTED') playSuccessSound();
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
      const updateTimer = () => { if (startTimeRef.current) { setElapsedTime((Date.now() - startTimeRef.current) / 1000); animationFrameId = requestAnimationFrame(updateTimer); } };
      animationFrameId = requestAnimationFrame(updateTimer);
    } else { startTimeRef.current = null; }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); if (animationFrameId) cancelAnimationFrame(animationFrameId); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, speed, timeline.length, currentStep, isPracticeMode]);

  const handleRandomize = () => loadNewArray(generateRandomArray());
  const handleSorted = () => loadNewArray(generateSortedArray());
  const handleReverse = () => loadNewArray(generateReverseSortedArray());
  
  const handleUserSubmit = () => { const arr = userInput.split(",").map(num => parseInt(num.trim())).filter(num => !isNaN(num)); if (arr.length > 0) loadNewArray(arr.slice(0, 20)); else alert("Invalid input!"); };
  const handleStepForward = () => { setIsPlaying(false); if (currentStep < timeline.length - 1) setCurrentStep(c => c + 1); };
  const handleSkipStart = () => { setIsPlaying(false); setCurrentStep(0); setElapsedTime(0); };
  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => { setIsPlaying(false); setCurrentStep(Number(e.target.value)); };
  const handleShare = () => { navigator.clipboard.writeText(window.location.href); alert("Copied URL to clipboard!"); };
  const handlePracticeModeToggle = () => { setIsPracticeMode(!isPracticeMode); setIsPlaying(false); setPracticeFeedback(null); };

  // --- LOGIC PRACTICE (FIXED) ---
  const handlePracticeDecision = (bucketIdx: number) => {
    if (currentStep >= timeline.length - 1) { 
        setPracticeFeedback({ type: 'success', msg: 'Finished!' }); 
        return; 
    }
    
    const currentData = timeline[currentStep];
    
    // FIX: Nếu digitVal chưa có (bước Init), bỏ qua check và auto next
    if (currentData.variables.digitVal === undefined) {
        handleStepForward();
        return;
    }

    if (currentData.type === 'GET_DIGIT' || currentData.type === 'BUCKET_PUSH') {
        const correctBucket = currentData.variables.digitVal;
        
        if (bucketIdx === correctBucket) {
            setPracticeScore(s => s + 10);
            setPracticeFeedback({ type: 'success', msg: 'Correct Bucket!' });
            playSuccessSound();
            
            if (currentData.type === 'GET_DIGIT') setCurrentStep(c => c + 2); 
            else handleStepForward();
        } else {
            setPracticeScore(s => Math.max(0, s - 5));
            setPracticeFeedback({ type: 'error', msg: `Wrong! Last digit is ${correctBucket}` });
            playErrorSound();
        }
    } else {
        handleStepForward();
    }
    setTimeout(() => setPracticeFeedback(null), 800);
  };

  const currentData = timeline[currentStep] || { arrayState: initialArray, indices: [], sortedIndices: [], type: null, message: "Ready...", variables: {}, counts: { comparisons: 0, swaps: 0 } };
  const isFinished = currentStep >= timeline.length - 1;

  const getBarColor = (index: number) => {
    if (!timeline.length) return "bg-cyan-500";
    const { type, indices } = currentData;
    if (type === 'GET_DIGIT' && indices.includes(index)) return "bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]";
    if (type === 'BUCKET_PUSH' && indices.includes(index)) return "bg-transparent border-2 border-dashed border-slate-600 opacity-30";
    return "bg-cyan-600";
  };

  const getActiveLine = () => {
    const snippet = radixSortCode[selectedLanguage];
    if (!currentData.type) return -1;
    if (currentData.type === 'GET_DIGIT') return snippet.highlight.GET_DIGIT;
    if (currentData.type === 'BUCKET_PUSH') return snippet.highlight.BUCKET_PUSH;
    if (currentData.type === 'BUCKET_POP') return snippet.highlight.BUCKET_POP;
    return -1;
  };

  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true) }, []);
  if (!isClient) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Loading...</div>;

  // --- KIỂM TRA ĐIỀU KIỆN HIỂN THỊ CÂU HỎI ---
  // Chỉ hiển thị câu hỏi nếu digitVal đã tồn tại (không phải undefined)
  const canShowQuestion = (currentData.type === 'GET_DIGIT' || currentData.type === 'BUCKET_PUSH') && currentData.variables.digitVal !== undefined;

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-4 md:p-8 relative">
      <AnimatePresence>{isTheoryOpen && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setIsTheoryOpen(false)}><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-slate-900 border border-slate-700 w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}><div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-950"><h2 className="text-2xl font-bold text-white flex items-center gap-2"><BookOpen className="text-purple-400" /> Theory: Radix Sort</h2><button onClick={() => setIsTheoryOpen(false)}><X size={24} /></button></div><div className="p-6 overflow-y-auto custom-scrollbar"><RadixSortTheory /></div></motion.div></motion.div>)}</AnimatePresence>

      <div className="w-full max-w-7xl mb-6 flex flex-col md:flex-row justify-between items-center gap-4"><Link href="/" className="flex items-center text-slate-400 hover:text-white gap-2"><ArrowLeft size={20} /> Dashboard</Link><div className="flex items-center gap-3"><button onClick={() => setIsMuted(!isMuted)} className="p-2 bg-slate-800 rounded-full">{isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}</button><button onClick={handleShare} className="p-2 bg-slate-800 rounded-full"><Share2 size={20} /></button><button onClick={handlePracticeModeToggle} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${isPracticeMode ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-300"}`}><Gamepad2 size={20} /> {isPracticeMode ? "Practice ON" : "Practice"}</button></div></div>
      <div className="flex justify-between items-center w-full max-w-7xl mb-6"><button onClick={() => setIsTheoryOpen(true)} className="group flex items-center gap-3 text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Radix Sort Visualization <BookOpen className="text-slate-500 group-hover:text-purple-400" size={24} /></button></div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full max-w-7xl">
        <div className="xl:col-span-2 space-y-6">
            <div className="flex flex-col gap-4">
                {/* 1. MAIN ARRAY */}
                <div className="flex items-end justify-center gap-2 h-64 w-full bg-slate-900/50 p-8 rounded-xl border border-slate-800 relative">
                    <AnimatePresence>{practiceFeedback && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`absolute top-10 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-bold shadow-xl z-20 ${practiceFeedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>{practiceFeedback.type === 'success' ? <CheckCircle2 className="inline mr-2" /> : <ThumbsDown className="inline mr-2" />}{practiceFeedback.msg}</motion.div>)}</AnimatePresence>
                    {currentData.arrayState.length > 0 ? currentData.arrayState.map((value, index) => (
                    <div key={index} className="flex-1 max-w-10 flex flex-col items-center gap-2">
                        <motion.div layout transition={{ type: "spring", stiffness: 300, damping: 25 }} style={{ height: `${(value / MAX_VALUE) * 150 + 20}px` }} className={`w-full rounded-t-md relative ${getBarColor(index)}`}>
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white shadow-sm">{value}</span>
                        </motion.div>
                        <span className="text-[10px] text-slate-500 font-mono font-semibold">{index}</span>
                    </div>
                    )) : <div className="text-slate-500">Initializing...</div>}
                </div>

                {/* 2. RADIX BUCKETS */}
                <div className="h-64 w-full">
                    <RadixBuckets data={currentData} />
                </div>
            </div>

            {/* STATUS & CONTROL */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
                {isPracticeMode ? (
                  <div className="flex flex-col items-center justify-center space-y-4 py-2">
                    {isFinished ? (
                        <div className="text-center"><h3 className="text-2xl font-bold text-green-400">🎉 Finished!</h3><button onClick={handleRandomize} className="px-6 py-2 bg-slate-700 mt-2 rounded">Retry</button></div>
                    ) : (
                        canShowQuestion ? (
                            <>
                                <div className="flex items-center gap-4 mb-2"><span className="text-purple-400 font-bold uppercase text-sm">Task:</span><span className="text-white text-lg">Which bucket for <span className="text-yellow-400 font-bold">{currentData.arrayState[currentData.indices[0]]}</span> ({currentData.variables.digitPlace === 1 ? '1s' : currentData.variables.digitPlace === 10 ? '10s' : '100s'})?</span></div>
                                <div className="grid grid-cols-5 gap-2">
                                    {[0,1,2,3,4,5,6,7,8,9].map(num => (
                                        <button key={num} onClick={() => handlePracticeDecision(num)} className="w-12 h-12 bg-slate-700 hover:bg-yellow-600 rounded font-bold text-xl transition-colors">{num}</button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <button onClick={() => handleStepForward()} className="px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold flex items-center gap-2">
                                <ArrowDown size={20} /> START / NEXT STEP
                            </button>
                        )
                    )}
                    <div className="absolute top-4 right-6 flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-full border border-purple-500/30"><Trophy className="text-yellow-500" size={18} /><span className="font-bold text-white">Score: {practiceScore}</span></div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row gap-4 justify-between border-b border-slate-800 pb-6">
                        <div className="flex gap-2 flex-wrap">
                            <button onClick={handleRandomize} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-300">Random</button>
                            <button onClick={handleSorted} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-300">Sorted</button>
                            <button onClick={handleReverse} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-300">Reverse</button>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto"><input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs" /><button onClick={handleUserSubmit} className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold">Load</button></div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono uppercase"><span>Step {currentStep}</span><span>Total {timeline.length - 1}</span></div>
                        <input type="range" min="0" max={Math.max(0, timeline.length - 1)} value={currentStep} onChange={handleScrub} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-1">
                                <button onClick={handleSkipStart} disabled={currentStep === 0} className="p-2 text-slate-400"><ListRestart size={20} /></button>
                                <button onClick={() => setIsPlaying(!isPlaying)} className={`w-10 h-10 flex items-center justify-center rounded-full shadow-lg ${isPlaying ? 'bg-yellow-500 text-black' : 'bg-cyan-500 text-black'}`}>{isPlaying ? <Pause size={18} /> : <Play size={18} />}</button>
                                <button onClick={handleStepForward} disabled={currentStep === timeline.length - 1} className="p-2 text-slate-400"><StepForward size={20} /></button>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800"><span className="text-[10px] font-bold text-slate-500 uppercase">Speed</span><input type="range" min={ANIMATION_SPEED_MIN} max={ANIMATION_SPEED_MAX} value={ANIMATION_SPEED_MAX - speed + ANIMATION_SPEED_MIN} onChange={(e) => setSpeed(ANIMATION_SPEED_MAX - Number(e.target.value) + ANIMATION_SPEED_MIN)} className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" /></div>
                        </div>
                    </div>
                  </>
                )}
            </div>

            {/* STATUS LOG & VARIABLES (ĐÃ THÊM LẠI) */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row gap-6 mt-6">
                 <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold uppercase tracking-wider"><Activity size={16} /> Status Log</div>
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 h-24 flex items-center overflow-y-auto"><p className="text-slate-300 text-sm font-mono leading-relaxed">{currentData.message}</p></div>
                 </div>
                 <div className="w-full md:w-64 space-y-2">
                    <div className="flex items-center gap-2 text-purple-400 text-sm font-bold uppercase tracking-wider">Variables</div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-950 border border-slate-800 p-2 rounded flex justify-between items-center"><span className="text-slate-500 font-mono text-xs">Digit Place</span><span className="text-yellow-400 font-mono font-bold">{currentData.variables.digitPlace === 1 ? '1s' : currentData.variables.digitPlace === 10 ? '10s' : '100s'}</span></div>
                        <div className="bg-slate-950 border border-slate-800 p-2 rounded flex justify-between items-center"><span className="text-slate-500 font-mono text-xs">Current Digit</span><span className="text-pink-400 font-mono font-bold">{currentData.variables.digitVal ?? '-'}</span></div>
                        <div className="bg-slate-950 border border-slate-800 p-2 rounded flex justify-between items-center"><span className="text-slate-500 font-mono text-xs">Active Bucket</span><span className="text-green-400 font-mono font-bold">{currentData.variables.activeBucket ?? '-'}</span></div>
                        <div className="bg-slate-950 border border-slate-800 p-2 rounded flex justify-between items-center"><span className="text-slate-500 font-mono text-xs">Array Idx</span><span className="text-blue-400 font-mono font-bold">{currentData.indices[0] ?? '-'}</span></div>
                    </div>
                 </div>
            </div>

        </div>

        <div className="xl:col-span-1 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl p-4 space-y-4">
               <div className="flex items-center gap-2 text-slate-200 font-bold pb-2 border-b border-slate-800"><Zap size={18} className="text-yellow-500" /><span>Statistics</span></div>
               <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 bg-slate-950 border border-slate-800 p-3 rounded-lg flex items-center justify-between"><span className="text-slate-500 text-xs font-bold uppercase">Complexity</span><span className="text-green-400 font-mono font-bold">O(nk)</span></div>
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg"><div className="flex items-center gap-2 mb-1"><Hash size={14} className="text-blue-400" /><span className="text-slate-500 text-[10px] font-bold uppercase">Extract Digit</span></div><span className="text-2xl font-mono text-white">{currentData.counts.comparisons}</span></div>
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg"><div className="flex items-center gap-2 mb-1"><ArrowRightLeft size={14} className="text-pink-400" /><span className="text-slate-500 text-[10px] font-bold uppercase">Moves</span></div><span className="text-2xl font-mono text-white">{currentData.counts.swaps}</span></div>
                  <div className="col-span-2 bg-slate-950 border border-slate-800 p-3 rounded-lg flex items-center justify-between"><div className="flex items-center gap-2"><Clock size={14} className="text-green-400" /><span className="text-slate-500 text-[10px] font-bold uppercase">Time Elapsed</span></div><span className="text-green-400 font-mono font-bold">{elapsedTime.toFixed(2)}s</span></div>
               </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col flex-1 min-h-125">
                <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
                    <div className="flex items-center gap-2 text-slate-200 font-bold"><Code2 size={18} className="text-purple-400" /><span>Code Trace</span></div>
                    <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value as Language)} className="bg-slate-800 text-slate-200 text-xs rounded px-2 py-1 border border-slate-700 focus:outline-none focus:border-purple-500">{Object.keys(radixSortCode).map(lang => (<option key={lang} value={lang}>{lang}</option>))}</select>
                </div>
                <div className="flex-1 p-4 overflow-auto bg-[#1e1e1e] font-mono text-xs md:text-sm relative">
                    <table className="w-full border-collapse"><tbody>{radixSortCode[selectedLanguage].code.split('\n').map((line, i) => (<tr key={i} className={`relative ${getActiveLine() === i ? 'bg-yellow-500/20' : ''}`}><td className="w-8 text-right pr-4 text-slate-600 select-none border-r border-slate-700/50 align-top">{i + 1}</td><td className={`pl-4 align-top whitespace-pre-wrap ${getActiveLine() === i ? 'text-yellow-100 font-bold' : 'text-slate-300'}`}>{line}</td></tr>))}</tbody></table>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}