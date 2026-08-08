"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BookOpen, X, Code2, Activity, Zap, Plus, Minus, Search } from "lucide-react";
import Link from "next/link";
import ArrayBlock from "@/components/Visualization/Array/ArrayBlock";
import { ArrayNode, DSAnimationStep } from "@/lib/data-structures/types"; 
import { createEmptyStack, generateStackPush, generateStackPop, generateStackPeek } from "@/lib/data-structures/stackLogic";
import { stackSnippets } from "@/lib/data-structures/stackCode";

const MAX_CAPACITY = 8;

const StackTheory = () => (
  <div className="space-y-4 text-slate-300 text-sm">
    <p><strong>Stack (Ngăn xếp)</strong> là cấu trúc dữ liệu hoạt động theo nguyên tắc <strong>LIFO</strong> (Last-In-First-Out) - Vào sau ra trước.</p>
    <ul className="list-disc pl-5 mt-2 space-y-1">
        <li><strong>Push:</strong> Thêm một phần tử vào đỉnh (Top). <span className="text-green-400">O(1)</span></li>
        <li><strong>Pop:</strong> Lấy phần tử ở đỉnh ra khỏi Stack. <span className="text-green-400">O(1)</span></li>
        <li><strong>Peek:</strong> Xem giá trị phần tử ở đỉnh mà không lấy ra. <span className="text-green-400">O(1)</span></li>
    </ul>
    <p className="mt-2 text-slate-400 italic">Thường được ứng dụng trong Undo/Redo, Call Stack của hệ điều hành, kiểm tra dấu ngoặc hợp lệ...</p>
  </div>
);

const TabBtn = ({ name, isActive, onClick }: { name: string, isActive: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`flex-1 px-4 py-3 font-bold text-sm transition-all border-b-2 ${isActive ? 'border-purple-500 text-purple-400 bg-slate-900/50' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/20'}`}>{name}</button>
);

export default function StackPage() {
    return (
        <Suspense fallback={<div className="text-white text-center p-10">Loading...</div>}>
            <StackVisualizer />
        </Suspense>
    );
}

function StackVisualizer() {
  const [arrayData, setArrayData] = useState<ArrayNode[]>(() => createEmptyStack(MAX_CAPACITY));
  const [top, setTop] = useState(-1); 
  
  const [timeline, setTimeline] = useState<DSAnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'PUSH' | 'POP' | 'PEEK'>('PUSH');
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [activeCode, setActiveCode] = useState(stackSnippets.PUSH);

  const [valInput, setValInput] = useState(10);

  const reset = useCallback(() => {
      setArrayData(createEmptyStack(MAX_CAPACITY));
      setTop(-1);
      setTimeline([]);
      setCurrentStep(0);
      setIsAnimating(false);
  }, []);

  const runAnimation = (generator: Generator<DSAnimationStep>) => {
    const steps: DSAnimationStep[] = [];
    for (const step of generator) steps.push(step);
    if (steps.length === 0) return;
    setTimeline(steps);
    setCurrentStep(0);
    setIsAnimating(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAnimating && currentStep < timeline.length - 1) {
        timer = setTimeout(() => setCurrentStep(p => p + 1), 600); 
    } else if (isAnimating && currentStep === timeline.length - 1) {
        const timeoutId = setTimeout(() => {
            setIsAnimating(false);
            const lastStep = timeline[timeline.length - 1];
            setArrayData(lastStep.arrayState);
            
            // Re-calculate top based on non-null values
            let newTop = -1;
            for(let i=0; i<lastStep.arrayState.length; i++) {
                if (lastStep.arrayState[i].value !== null) newTop = i;
            }
            setTop(newTop);
        }, 500);
        return () => clearTimeout(timeoutId);
    }
    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, timeline]);

  const currentMainArr = isAnimating && timeline.length > 0 ? timeline[currentStep].arrayState : arrayData;
  const currentMessage = isAnimating && timeline.length > 0 ? timeline[currentStep].message : "Ready.";

  const handlePush = () => {
      setActiveCode(stackSnippets.PUSH);
      runAnimation(generateStackPush(arrayData, valInput, top, MAX_CAPACITY));
  };

  const handlePop = () => {
      setActiveCode(stackSnippets.POP);
      runAnimation(generateStackPop(arrayData, top));
  };

  const handlePeek = () => {
      setActiveCode(stackSnippets.PEEK);
      runAnimation(generateStackPeek(arrayData, top));
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-4 md:p-8 relative font-sans">
      
      <AnimatePresence>{isTheoryOpen && (<motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={()=>setIsTheoryOpen(false)}><motion.div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-2xl" onClick={(e)=>e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-white">Stack Theory</h2><button onClick={()=>setIsTheoryOpen(false)}><X/></button></div><StackTheory/></motion.div></motion.div>)}</AnimatePresence>

      <div className="w-full max-w-7xl mb-6 flex justify-between items-center">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white gap-2"><ArrowLeft size={20} /> Dashboard</Link>
        <button onClick={() => setIsTheoryOpen(true)} className="p-2 bg-slate-800 rounded-full text-purple-400 hover:text-white"><BookOpen size={20}/></button>
      </div>

      <h1 className="text-3xl font-extrabold mb-2 bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Stack (LIFO)</h1>
      <p className="text-slate-500 mb-6 text-sm">Last In, First Out Visualization</p>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: VISUAL + CONTROL */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 relative overflow-hidden flex flex-col items-center min-h-[350px] shadow-xl">
                <div className="w-full flex justify-between text-[10px] font-mono text-slate-500 mb-4 border-b border-slate-800 pb-2 uppercase tracking-wider">
                    <span>Top Index: <strong className="text-purple-400">{top}</strong></span>
                    <span>Capacity: <strong className="text-blue-400">{MAX_CAPACITY}</strong></span>
                </div>

                <div className="flex justify-center gap-10 items-end w-full py-2">
                    {/* Vẽ Stack theo chiều dọc (cột) */}
                    <div className="flex flex-col-reverse justify-start items-center p-4 border-b-4 border-l-4 border-r-4 border-slate-700 rounded-b-xl relative min-w-32 bg-slate-950/30">
                        {/* Chỉ vẽ từ 0 đến MAX_CAPACITY - 1 */}
                        {currentMainArr.map((node, i) => (
                            <div key={node.id} className="relative mb-2">
                                {/* Mũi tên trỏ vào Top */}
                                {i === top && !isAnimating && (
                                    <motion.div initial={{x:-20, opacity:0}} animate={{x:0, opacity:1}} className="absolute -left-16 top-1/2 -translate-y-1/2 flex items-center gap-1 text-purple-400 font-bold text-xs">
                                        TOP ➔
                                    </motion.div>
                                )}
                                <ArrayBlock node={node} isActive={node.index <= top || node.state !== 'DEFAULT'} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* STATUS */}
            <div className="bg-slate-900 border-l-4 border-purple-500 p-4 rounded-r-xl shadow-lg flex items-center gap-3">
                <Activity size={18} className="text-purple-400" />
                <p className="font-mono text-slate-200 text-sm">{currentMessage}</p>
            </div>

            {/* CONTROLS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="flex bg-slate-950/50 border-b border-slate-800">
                    <TabBtn name="Push" isActive={activeTab === 'PUSH'} onClick={() => setActiveTab('PUSH')} />
                    <TabBtn name="Pop" isActive={activeTab === 'POP'} onClick={() => setActiveTab('POP')} />
                    <TabBtn name="Peek" isActive={activeTab === 'PEEK'} onClick={() => setActiveTab('PEEK')} />
                </div>
                <div className="p-6 bg-slate-900/50 flex items-center justify-center gap-4 min-h-[100px]">
                    {activeTab === 'PUSH' && (
                        <div className="flex items-center gap-3">
                            <input type="number" value={valInput} onChange={(e) => setValInput(Number(e.target.value))} className="bg-slate-950 border border-slate-700 rounded px-3 py-2 w-20 text-center text-white" />
                            <button onClick={handlePush} disabled={isAnimating} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold flex items-center gap-2"><Plus size={18}/> Push</button>
                        </div>
                    )}
                    {activeTab === 'POP' && (
                        <button onClick={handlePop} disabled={isAnimating} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-bold flex items-center gap-2"><Minus size={18}/> Pop</button>
                    )}
                    {activeTab === 'PEEK' && (
                        <button onClick={handlePeek} disabled={isAnimating} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold flex items-center gap-2"><Search size={18}/> Peek</button>
                    )}
                    <div className="h-8 w-px bg-slate-700 mx-4"></div>
                    <button onClick={reset} className="text-slate-500 hover:text-white text-sm">Reset</button>
                </div>
            </div>
        </div>

        {/* RIGHT: CODE */}
        <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl sticky top-6">
                <div className="flex items-center gap-2 p-4 border-b border-slate-800 bg-slate-950">
                    <Code2 size={18} className="text-purple-400" />
                    <span className="font-bold text-slate-200">Pseudocode</span>
                </div>
                <div className="p-4 bg-[#1e1e1e] overflow-x-auto min-h-[400px]">
                    <table className="w-full border-collapse font-mono text-xs md:text-sm">
                        <tbody>
                            {activeCode.split('\n').map((line, i) => {
                                const isActive = timeline[currentStep]?.codeLine === i + 1;
                                return (
                                    <tr key={i} className={`${isActive ? 'bg-yellow-500/20' : ''} transition-colors`}>
                                        <td className="w-6 text-right pr-3 text-slate-600 border-r border-slate-700/50">{i + 1}</td>
                                        <td className={`pl-3 whitespace-pre-wrap ${isActive ? 'text-yellow-100 font-bold' : 'text-green-400'}`}>{line}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

      </div>
    </main>
  );
}
