"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BookOpen, X, Code2, Activity, Plus, Minus, Search } from "lucide-react";
import Link from "next/link";
import ArrayBlock from "@/components/Visualization/Array/ArrayBlock";
import { ArrayNode, DSAnimationStep } from "@/lib/data-structures/types"; 
import { createEmptyQueue, generateQueueEnqueue, generateQueueDequeue } from "@/lib/data-structures/queueLogic";
import { queueSnippets } from "@/lib/data-structures/queueCode";

const MAX_CAPACITY = 8;

const QueueTheory = () => (
  <div className="space-y-4 text-slate-300 text-sm">
    <p><strong>Queue (Hàng đợi)</strong> là cấu trúc dữ liệu hoạt động theo nguyên tắc <strong>FIFO</strong> (First-In-First-Out) - Vào trước ra trước.</p>
    <ul className="list-disc pl-5 mt-2 space-y-1">
        <li><strong>Enqueue:</strong> Thêm một phần tử vào cuối (Rear). <span className="text-green-400">O(1)</span></li>
        <li><strong>Dequeue:</strong> Lấy phần tử ở đầu ra (Front). <span className="text-green-400">O(1)</span></li>
        <li><strong>Front:</strong> Xem giá trị phần tử ở đầu mà không lấy ra. <span className="text-green-400">O(1)</span></li>
    </ul>
    <p className="mt-2 text-slate-400 italic">Ứng dụng: Hàng đợi in ấn (Printer Queue), Lập lịch tiến trình CPU (CPU Scheduling), Duyệt đồ thị theo chiều rộng (BFS)...</p>
  </div>
);

const TabBtn = ({ name, isActive, onClick }: { name: string, isActive: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`flex-1 px-4 py-3 font-bold text-sm transition-all border-b-2 ${isActive ? 'border-orange-500 text-orange-400 bg-slate-900/50' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/20'}`}>{name}</button>
);

export default function QueuePage() {
    return (
        <Suspense fallback={<div className="text-white text-center p-10">Loading...</div>}>
            <QueueVisualizer />
        </Suspense>
    );
}

function QueueVisualizer() {
  const [arrayData, setArrayData] = useState<ArrayNode[]>(() => createEmptyQueue(MAX_CAPACITY));
  const [front, setFront] = useState(-1);
  const [rear, setRear] = useState(-1);
  
  const [timeline, setTimeline] = useState<DSAnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'ENQUEUE' | 'DEQUEUE' | 'FRONT'>('ENQUEUE');
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [activeCode, setActiveCode] = useState(queueSnippets.ENQUEUE);

  const [valInput, setValInput] = useState(10);

  const reset = useCallback(() => {
      setArrayData(createEmptyQueue(MAX_CAPACITY));
      setFront(-1);
      setRear(-1);
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
            
            // Recalculate front and rear
            let newFront = -1;
            let newRear = -1;
            for(let i=0; i<lastStep.arrayState.length; i++) {
                if (lastStep.arrayState[i].value !== null) {
                    if (newFront === -1) newFront = i;
                    newRear = i;
                }
            }
            setFront(newFront);
            setRear(newRear);
        }, 500);
        return () => clearTimeout(timeoutId);
    }
    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, timeline]);

  const currentMainArr = isAnimating && timeline.length > 0 ? timeline[currentStep].arrayState : arrayData;
  const currentMessage = isAnimating && timeline.length > 0 ? timeline[currentStep].message : "Ready.";

  const handleEnqueue = () => {
      setActiveCode(queueSnippets.ENQUEUE);
      runAnimation(generateQueueEnqueue(arrayData, valInput, front, rear, MAX_CAPACITY));
  };

  const handleDequeue = () => {
      setActiveCode(queueSnippets.DEQUEUE);
      runAnimation(generateQueueDequeue(arrayData, front, rear));
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-4 md:p-8 relative font-sans">
      
      <AnimatePresence>{isTheoryOpen && (<motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={()=>setIsTheoryOpen(false)}><motion.div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-2xl" onClick={(e)=>e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-white">Queue Theory</h2><button onClick={()=>setIsTheoryOpen(false)}><X/></button></div><QueueTheory/></motion.div></motion.div>)}</AnimatePresence>

      <div className="w-full max-w-7xl mb-6 flex justify-between items-center">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white gap-2"><ArrowLeft size={20} /> Dashboard</Link>
        <button onClick={() => setIsTheoryOpen(true)} className="p-2 bg-slate-800 rounded-full text-orange-400 hover:text-white"><BookOpen size={20}/></button>
      </div>

      <h1 className="text-3xl font-extrabold mb-2 bg-linear-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">Queue (FIFO)</h1>
      <p className="text-slate-500 mb-6 text-sm">First In, First Out Visualization</p>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: VISUAL + CONTROL */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 relative overflow-hidden flex flex-col items-center min-h-[350px] shadow-xl">
                <div className="w-full flex justify-between text-[10px] font-mono text-slate-500 mb-4 border-b border-slate-800 pb-2 uppercase tracking-wider">
                    <span>Front: <strong className="text-orange-400">{front}</strong> | Rear: <strong className="text-yellow-400">{rear}</strong></span>
                    <span>Capacity: <strong className="text-blue-400">{MAX_CAPACITY}</strong></span>
                </div>

                <div className="flex justify-center items-center w-full py-10 overflow-x-auto">
                    <div className="flex items-center gap-2 p-4 border-t-4 border-b-4 border-slate-700 relative min-w-max bg-slate-950/30 rounded">
                        <AnimatePresence mode="popLayout">
                            {currentMainArr.map((node, i) => (
                                <div key={node.id} className="relative flex flex-col items-center">
                                    {/* Mũi tên trỏ vào Front */}
                                    {i === front && !isAnimating && (
                                        <motion.div initial={{y:-20, opacity:0}} animate={{y:0, opacity:1}} className="absolute -top-10 flex flex-col items-center gap-1 text-orange-400 font-bold text-xs">
                                            FRONT <span>⬇</span>
                                        </motion.div>
                                    )}
                                    <ArrayBlock node={node} isActive={i >= front && i <= rear && node.value !== null || node.state !== 'DEFAULT'} />
                                    {/* Mũi tên trỏ vào Rear */}
                                    {i === rear && !isAnimating && (
                                        <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="absolute -bottom-10 flex flex-col items-center gap-1 text-yellow-400 font-bold text-xs">
                                            <span>⬆</span> REAR
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* STATUS */}
            <div className="bg-slate-900 border-l-4 border-orange-500 p-4 rounded-r-xl shadow-lg flex items-center gap-3">
                <Activity size={18} className="text-orange-400" />
                <p className="font-mono text-slate-200 text-sm">{currentMessage}</p>
            </div>

            {/* CONTROLS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="flex bg-slate-950/50 border-b border-slate-800">
                    <TabBtn name="Enqueue" isActive={activeTab === 'ENQUEUE'} onClick={() => setActiveTab('ENQUEUE')} />
                    <TabBtn name="Dequeue" isActive={activeTab === 'DEQUEUE'} onClick={() => setActiveTab('DEQUEUE')} />
                </div>
                <div className="p-6 bg-slate-900/50 flex items-center justify-center gap-4 min-h-[100px]">
                    {activeTab === 'ENQUEUE' && (
                        <div className="flex items-center gap-3">
                            <input type="number" value={valInput} onChange={(e) => setValInput(Number(e.target.value))} className="bg-slate-950 border border-slate-700 rounded px-3 py-2 w-20 text-center text-white" />
                            <button onClick={handleEnqueue} disabled={isAnimating} className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded font-bold flex items-center gap-2"><Plus size={18}/> Enqueue</button>
                        </div>
                    )}
                    {activeTab === 'DEQUEUE' && (
                        <button onClick={handleDequeue} disabled={isAnimating} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-bold flex items-center gap-2"><Minus size={18}/> Dequeue</button>
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
                    <Code2 size={18} className="text-orange-400" />
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
