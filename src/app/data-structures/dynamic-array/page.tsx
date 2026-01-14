"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BookOpen, X, Code2, Activity, Zap, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import ArrayBlock from "@/components/Visualization/Array/ArrayBlock";
import { ArrayNode, DSAnimationStep } from "@/lib/data-structures/types"; 
import { createDynamicArray, generatePushBackSteps, generateInsertAtSteps, generatePopBackSteps } from "@/lib/data-structures/dynamicArrayLogic";
import { dynamicArrayCodeSnippets } from "@/lib/data-structures/codeSnippets";

const INITIAL_CAPACITY = 4; // Bắt đầu nhỏ để dễ thấy resize

// --- THEORY ---
const DynamicArrayTheory = () => (
  <div className="space-y-4 text-slate-300 text-sm">
    <p><strong>Dynamic Array</strong> (như <code>ArrayList</code> trong Java, <code>vector</code> trong C++) là mảng có khả năng tự động thay đổi kích thước.</p>
    <div className="bg-slate-900 p-3 rounded border border-slate-700">
        <h4 className="text-white font-bold mb-2">Cơ chế Resize (Amortized Analysis)</h4>
        <p>Khi mảng đầy, ta tạo mảng mới gấp đôi kích thước (2x), copy toàn bộ phần tử sang mảng mới.</p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
            <li>Insert bình thường: <span className="text-green-400">O(1)</span></li>
            <li>Insert khi đầy (Resize): <span className="text-red-400">O(N)</span></li>
            <li><strong>Trung bình (Amortized):</strong> <span className="text-green-400">O(1)</span></li>
        </ul>
    </div>
  </div>
);

// --- COMPONENTS ---
const TabBtn = ({ name, isActive, onClick }: { name: string, isActive: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`flex-1 px-4 py-3 font-bold text-sm transition-all border-b-2 ${isActive ? 'border-blue-500 text-blue-400 bg-slate-900/50' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/20'}`}>{name}</button>
);

export default function DynamicArrayPage() {
    return (
        <Suspense fallback={<div className="text-white text-center p-10">Loading...</div>}>
            <DynamicArrayVisualizer />
        </Suspense>
    );
}

function DynamicArrayVisualizer() {
  const [arrayData, setArrayData] = useState<ArrayNode[]>(() => createDynamicArray(INITIAL_CAPACITY));
  const [tempArrayData, setTempArrayData] = useState<ArrayNode[] | undefined>(undefined); // Cho resize animation
  const [size, setSize] = useState(0); 
  
  const [timeline, setTimeline] = useState<DSAnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'PUSH' | 'INSERT' | 'POP'>('PUSH');
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [activeCode, setActiveCode] = useState(dynamicArrayCodeSnippets.PUSH_BACK);

  const [valInput, setValInput] = useState(10);
  const [idxInput, setIdxInput] = useState(0);

  // --- HELPERS ---
  const reset = useCallback(() => {
      setArrayData(createDynamicArray(INITIAL_CAPACITY));
      setTempArrayData(undefined);
      setSize(0);
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
            setTempArrayData(undefined); // Ẩn mảng temp sau khi xong
            
            const newSize = lastStep.arrayState.filter((n: ArrayNode) => n.value !== null).length;
            setSize(newSize);
        }, 500);
        return () => clearTimeout(timeoutId);
    }
    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, timeline]);

  // Update visual state based on timeline
  const currentMainArr = isAnimating && timeline.length > 0 ? timeline[currentStep].arrayState : arrayData;
  const currentTempArr = isAnimating && timeline.length > 0 ? timeline[currentStep].tempArrayState : tempArrayData;
  const currentMessage = isAnimating && timeline.length > 0 ? timeline[currentStep].message : "Ready. Start with capacity " + INITIAL_CAPACITY;

  // --- HANDLERS ---
  const handlePushBack = () => {
      setActiveCode(dynamicArrayCodeSnippets.PUSH_BACK);
      runAnimation(generatePushBackSteps(arrayData, valInput, size, arrayData.length));
  };

  const handlePopBack = () => {
      setActiveCode(dynamicArrayCodeSnippets.POP_BACK);
      runAnimation(generatePopBackSteps(arrayData, size, arrayData.length));
  };

  const handleInsertAt = () => {
      if (idxInput < 0 || idxInput > size) return alert("Invalid Index");
      setActiveCode(dynamicArrayCodeSnippets.INSERT_AT);
      runAnimation(generateInsertAtSteps(arrayData, idxInput, valInput, size, arrayData.length));
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-4 md:p-8 relative font-sans">
      
      {/* THEORY MODAL */}
      <AnimatePresence>{isTheoryOpen && (<motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={()=>setIsTheoryOpen(false)}><motion.div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-2xl" onClick={(e)=>e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-white">Dynamic Array Theory</h2><button onClick={()=>setIsTheoryOpen(false)}><X/></button></div><DynamicArrayTheory/></motion.div></motion.div>)}</AnimatePresence>

      {/* TOP NAV */}
      <div className="w-full max-w-7xl mb-6 flex justify-between items-center">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white gap-2"><ArrowLeft size={20} /> Dashboard</Link>
        <button onClick={() => setIsTheoryOpen(true)} className="p-2 bg-slate-800 rounded-full text-blue-400 hover:text-white"><BookOpen size={20}/></button>
      </div>

      <h1 className="text-3xl font-extrabold mb-2 bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Dynamic Array</h1>
      <p className="text-slate-500 mb-6 text-sm">Resizing Visualization</p>

      {/* --- MAIN GRID --- */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: VISUAL + CONTROL */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 relative overflow-hidden flex flex-col items-center min-h-[350px] shadow-xl transition-all duration-500">
                {/* INFO HEADER */}
                <div className="w-full flex justify-between text-[10px] font-mono text-slate-500 mb-4 border-b border-slate-800 pb-2 uppercase tracking-wider">
                    <span>Size: <strong className="text-blue-400">{size}</strong></span>
                    <span>Capacity: <strong className="text-purple-400">{currentMainArr.length}</strong></span>
                </div>

                {/* MAIN ARRAY */}
                <div className="mb-2 text-xs text-slate-400 font-bold uppercase tracking-widest w-full text-center">Current Array</div>
                <div className="flex items-center justify-center gap-2 flex-wrap py-2 transition-all">
                    <AnimatePresence mode="popLayout">
                        {currentMainArr.map((node) => (
                            <ArrayBlock key={node.id} node={node} isActive={node.index < size || node.state !== 'DEFAULT'} />
                        ))}
                    </AnimatePresence>
                </div>

                {/* TEMP ARRAY (RESIZING) */}
                <AnimatePresence>
                    {currentTempArr && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="mt-8 w-full flex flex-col items-center"
                        >
                            <div className="w-full h-px bg-yellow-500/30 mb-4 relative"><span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-slate-900 px-2 text-[10px] text-yellow-500 uppercase font-bold">Resizing... Copying Data</span></div>
                            <div className="mb-2 text-xs text-yellow-400 font-bold uppercase tracking-widest w-full text-center">New Array (2x Capacity)</div>
                            <div className="flex items-center justify-center gap-2 flex-wrap py-2">
                                {currentTempArr.map((node) => (
                                    <ArrayBlock key={node.id} node={node} isActive={node.value !== null} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* STATUS */}
            <div className="bg-slate-900 border-l-4 border-purple-500 p-4 rounded-r-xl shadow-lg flex items-center gap-3">
                <Activity size={18} className="text-purple-400" />
                <p className="font-mono text-slate-200 text-sm">{currentMessage}</p>
            </div>

            {/* CONTROLS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="flex bg-slate-950/50 border-b border-slate-800">
                    <TabBtn name="Push Back" isActive={activeTab === 'PUSH'} onClick={() => setActiveTab('PUSH')} />
                    <TabBtn name="Insert At" isActive={activeTab === 'INSERT'} onClick={() => setActiveTab('INSERT')} />
                    <TabBtn name="Pop Back" isActive={activeTab === 'POP'} onClick={() => setActiveTab('POP')} />
                </div>
                <div className="p-6 bg-slate-900/50 flex items-center justify-center gap-4 min-h-[100px]">
                    {activeTab === 'PUSH' && (
                        <div className="flex items-center gap-3">
                            <input type="number" value={valInput} onChange={(e) => setValInput(Number(e.target.value))} className="bg-slate-950 border border-slate-700 rounded px-3 py-2 w-20 text-center text-white" />
                            <button onClick={handlePushBack} disabled={isAnimating} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold flex items-center gap-2"><Plus size={18}/> Push Back</button>
                        </div>
                    )}
                    {activeTab === 'INSERT' && (
                        <div className="flex items-center gap-3">
                            <input type="number" value={idxInput} onChange={(e) => setIdxInput(Number(e.target.value))} className="bg-slate-950 border border-slate-700 rounded px-3 py-2 w-16 text-center text-white" placeholder="Idx" />
                            <input type="number" value={valInput} onChange={(e) => setValInput(Number(e.target.value))} className="bg-slate-950 border border-slate-700 rounded px-3 py-2 w-20 text-center text-white" placeholder="Val" />
                            <button onClick={handleInsertAt} disabled={isAnimating} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold">Insert At</button>
                        </div>
                    )}
                    {activeTab === 'POP' && (
                        <button onClick={handlePopBack} disabled={isAnimating} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-bold flex items-center gap-2"><Trash2 size={18}/> Pop Back</button>
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