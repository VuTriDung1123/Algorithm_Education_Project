"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BookOpen, X, Code2, Activity, Plus, Minus } from "lucide-react";
import Link from "next/link";
import ArrayBlock from "@/components/Visualization/Array/ArrayBlock";
import { ArrayNode, DSAnimationStep } from "@/lib/data-structures/types"; 
import { createEmptyHeap, generateHeapInsert, generateHeapExtractMin } from "@/lib/data-structures/heapLogic";
import { heapSnippets } from "@/lib/data-structures/heapCode";

const MAX_CAPACITY = 15; // Phù hợp cho cây nhị phân hoàn chỉnh 4 tầng (1 + 2 + 4 + 8 = 15)

const HeapTheory = () => (
  <div className="space-y-4 text-slate-300 text-sm">
    <p><strong>Min Heap (Hàng đợi ưu tiên)</strong> là một cây nhị phân hoàn chỉnh được lưu trữ dưới dạng mảng, trong đó giá trị của node cha luôn nhỏ hơn hoặc bằng giá trị các node con.</p>
    <ul className="list-disc pl-5 mt-2 space-y-1">
        <li><strong>Vị trí:</strong> Node tại index <code>i</code> có con trái tại <code>2i + 1</code>, con phải tại <code>2i + 2</code>, và cha tại <code>(i - 1) / 2</code>.</li>
        <li><strong>Insert:</strong> Thêm vào cuối mảng, sau đó nổi bọt lên trên (Heapify Up). <span className="text-yellow-400">O(log n)</span></li>
        <li><strong>Extract Min:</strong> Lấy phần tử đầu mảng (Root), đưa phần tử cuối lên đầu rồi đẩy xuống (Heapify Down). <span className="text-yellow-400">O(log n)</span></li>
    </ul>
    <p className="mt-2 text-slate-400 italic">Thường được sử dụng làm <strong>Priority Queue</strong>, thuật toán Heap Sort, thuật toán Dijkstra, A*...</p>
  </div>
);

const TabBtn = ({ name, isActive, onClick }: { name: string, isActive: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`flex-1 px-4 py-3 font-bold text-sm transition-all border-b-2 ${isActive ? 'border-amber-500 text-amber-400 bg-slate-900/50' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/20'}`}>{name}</button>
);

export default function MinHeapPage() {
    return (
        <Suspense fallback={<div className="text-white text-center p-10">Loading...</div>}>
            <MinHeapVisualizer />
        </Suspense>
    );
}

function MinHeapVisualizer() {
  const [arrayData, setArrayData] = useState<ArrayNode[]>(() => createEmptyHeap(MAX_CAPACITY));
  const [size, setSize] = useState(0);
  
  const [timeline, setTimeline] = useState<DSAnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'INSERT' | 'EXTRACT_MIN'>('INSERT');
  const [activeCodeContext, setActiveCodeContext] = useState<'INSERT'|'HEAPIFY_UP'|'EXTRACT_MIN'|'HEAPIFY_DOWN'>('INSERT');
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);

  const [valInput, setValInput] = useState(50);

  const reset = useCallback(() => {
      setArrayData(createEmptyHeap(MAX_CAPACITY));
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
        timer = setTimeout(() => {
            setCurrentStep(p => p + 1);
            const step = timeline[currentStep + 1];
            if (step.auxiliary?.code) {
                setActiveCodeContext(step.auxiliary.code as any);
            }
        }, 600); 
    } else if (isAnimating && currentStep === timeline.length - 1) {
        const timeoutId = setTimeout(() => {
            setIsAnimating(false);
            const lastStep = timeline[timeline.length - 1];
            setArrayData(lastStep.arrayState);
            if (lastStep.auxiliary?.size !== undefined) {
                setSize(lastStep.auxiliary.size as number);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }
    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, timeline]);

  const currentMainArr = isAnimating && timeline.length > 0 ? timeline[currentStep].arrayState : arrayData;
  const currentMessage = isAnimating && timeline.length > 0 ? timeline[currentStep].message : "Ready.";
  
  const activeCodeSnippet = heapSnippets[activeCodeContext] || heapSnippets.INSERT;
  const currentSize = isAnimating && timeline.length > 0 && timeline[currentStep].auxiliary?.size !== undefined ? (timeline[currentStep].auxiliary!.size as number) : size;

  const handleInsert = () => {
      setActiveCodeContext('INSERT');
      setActiveTab('INSERT');
      runAnimation(generateHeapInsert(arrayData, valInput, size, MAX_CAPACITY));
      setValInput(Math.floor(Math.random() * 100)); // Auto random next val
  };

  const handleExtract = () => {
      setActiveCodeContext('EXTRACT_MIN');
      setActiveTab('EXTRACT_MIN');
      runAnimation(generateHeapExtractMin(arrayData, size));
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-4 md:p-8 relative font-sans">
      
      <AnimatePresence>{isTheoryOpen && (<motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={()=>setIsTheoryOpen(false)}><motion.div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-2xl" onClick={(e)=>e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-white">Min Heap Theory</h2><button onClick={()=>setIsTheoryOpen(false)}><X/></button></div><HeapTheory/></motion.div></motion.div>)}</AnimatePresence>

      <div className="w-full max-w-7xl mb-6 flex justify-between items-center">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white gap-2"><ArrowLeft size={20} /> Dashboard</Link>
        <button onClick={() => setIsTheoryOpen(true)} className="p-2 bg-slate-800 rounded-full text-amber-400 hover:text-white"><BookOpen size={20}/></button>
      </div>

      <h1 className="text-3xl font-extrabold mb-2 bg-linear-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Min Heap (Priority Queue)</h1>
      <p className="text-slate-500 mb-6 text-sm">Array-based Binary Tree Representation</p>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: VISUAL + CONTROL */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 relative overflow-hidden flex flex-col items-center min-h-[350px] shadow-xl">
                <div className="w-full flex justify-between text-[10px] font-mono text-slate-500 mb-4 border-b border-slate-800 pb-2 uppercase tracking-wider">
                    <span>Size: <strong className="text-amber-400">{currentSize}</strong></span>
                    <span>Capacity: <strong className="text-blue-400">{MAX_CAPACITY}</strong></span>
                </div>

                {/* Phân mảnh mảng thành các block cho dễ nhìn nếu quá dài */}
                <div className="flex justify-center flex-wrap gap-y-6 items-center w-full py-6">
                    <AnimatePresence mode="popLayout">
                        {currentMainArr.map((node, i) => (
                            <div key={node.id} className="relative flex flex-col items-center">
                                {/* Trực quan index ảo để thấy Tầng cây (0 -> 1,2 -> 3,4,5,6) */}
                                {(i === 0 || i === 1 || i === 3 || i === 7) && (
                                    <span className="absolute -top-6 text-[9px] text-slate-600">Level {Math.floor(Math.log2(i+1))}</span>
                                )}
                                <ArrayBlock node={node} isActive={i < currentSize} />
                                {i < currentSize && i > 0 && !isAnimating && (
                                    <span className="absolute -bottom-6 text-[8px] text-slate-600">P: {Math.floor((i-1)/2)}</span>
                                )}
                            </div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* STATUS */}
            <div className="bg-slate-900 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-lg flex items-center gap-3">
                <Activity size={18} className="text-amber-400" />
                <p className="font-mono text-slate-200 text-sm">{currentMessage}</p>
            </div>

            {/* CONTROLS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="flex bg-slate-950/50 border-b border-slate-800">
                    <TabBtn name="Insert" isActive={activeTab === 'INSERT'} onClick={() => {setActiveTab('INSERT'); setActiveCodeContext('INSERT')}} />
                    <TabBtn name="Extract Min" isActive={activeTab === 'EXTRACT_MIN'} onClick={() => {setActiveTab('EXTRACT_MIN'); setActiveCodeContext('EXTRACT_MIN')}} />
                </div>
                <div className="p-6 bg-slate-900/50 flex flex-wrap items-center justify-center gap-4 min-h-[100px]">
                    {activeTab === 'INSERT' && (
                        <div className="flex items-center gap-3">
                            <input type="number" value={valInput} onChange={(e) => setValInput(Number(e.target.value))} className="bg-slate-950 border border-slate-700 rounded px-3 py-2 w-20 text-center text-white" />
                            <button onClick={handleInsert} disabled={isAnimating} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded font-bold flex items-center gap-2"><Plus size={18}/> Insert</button>
                        </div>
                    )}
                    {activeTab === 'EXTRACT_MIN' && (
                        <button onClick={handleExtract} disabled={isAnimating} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-bold flex items-center gap-2"><Minus size={18}/> Extract Min</button>
                    )}
                    <div className="h-8 w-px bg-slate-700 mx-4 hidden md:block"></div>
                    <button onClick={reset} className="text-slate-500 hover:text-white text-sm">Reset</button>
                </div>
            </div>
        </div>

        {/* RIGHT: CODE */}
        <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl sticky top-6">
                <div className="flex items-center gap-2 p-4 border-b border-slate-800 bg-slate-950">
                    <Code2 size={18} className="text-amber-400" />
                    <span className="font-bold text-slate-200">Pseudocode ({activeCodeContext})</span>
                </div>
                <div className="p-4 bg-[#1e1e1e] overflow-x-auto min-h-[400px]">
                    <table className="w-full border-collapse font-mono text-xs md:text-sm">
                        <tbody>
                            {activeCodeSnippet.split('\n').map((line, i) => {
                                const isActive = timeline[currentStep]?.codeLine === i + 1 && timeline[currentStep]?.auxiliary?.code === activeCodeContext;
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
