"use client";

import { useState, useEffect, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  ArrowLeft, BookOpen, X, Code2, Link as LinkIcon, 
  Trash2, Search as SearchIcon, Activity, Zap 
} from "lucide-react";
import Link from "next/link";
import { DSAnimationStep, ArrayNode } from "@/lib/data-structures/types"; 
import { linkedListSnippets } from "@/lib/data-structures/linkedListCode";
import { 
    initLinkedList,
    generateLLSearch, 
    generateLLInsertHead, 
    generateLLInsertTail, 
    generateLLInsertIndex,
    generateLLDeleteIndex 
} from "@/lib/data-structures/linkedListLogic";
import LinkedListNode from "@/components/Visualization/LinkedList/LinkedListNode";

// --- THEORY CONTENT ---
const LinkedListTheory = () => (
  <div className="space-y-6 text-slate-300 leading-relaxed text-sm md:text-base">
    <section>
        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <LinkIcon size={20} className="text-blue-400"/> 1. Danh sách liên kết đơn (Singly Linked List)
        </h3>
        <p className="mb-2">
            Là một cấu trúc dữ liệu động, bao gồm các nút (Nodes). Mỗi nút chứa:
        </p>
        <ul className="list-disc pl-5 space-y-1 marker:text-blue-500">
            <li><strong>Data:</strong> Giá trị lưu trữ.</li>
            <li><strong>Next Pointer:</strong> Địa chỉ của nút tiếp theo.</li>
        </ul>
        <p className="mt-2 text-xs italic text-slate-500">*Các nút không nằm liền kề nhau trong bộ nhớ (Non-contiguous memory).</p>
    </section>

    <div className="w-full h-px bg-slate-700/50 my-4"></div>

    <section>
        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Zap size={20} className="text-yellow-400"/> 2. Độ phức tạp
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <span className="block text-slate-500 text-xs font-bold uppercase">Access/Search</span>
                <span className="text-yellow-400 font-mono font-bold text-lg">O(N)</span>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <span className="block text-slate-500 text-xs font-bold uppercase">Insert/Delete (Head)</span>
                <span className="text-green-400 font-mono font-bold text-lg">O(1)</span>
            </div>
        </div>
    </section>
  </div>
);

// --- COMPONENT BUTTONS ---
interface TabBtnProps {
    name: string;
    isActive: boolean;
    onClick: () => void;
}

const TabBtn = ({ name, isActive, onClick }: TabBtnProps) => (
    <button onClick={onClick} className={`flex-1 px-4 py-3 font-bold text-xs md:text-sm transition-all border-b-2 whitespace-nowrap ${isActive ? 'border-blue-500 text-blue-400 bg-slate-900/50' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/20'}`}>{name}</button>
);

export default function LinkedListPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-white">Loading Linked List...</div>}>
            <LinkedListVisualizer />
        </Suspense>
    );
}

function LinkedListVisualizer() {
  const [nodes, setNodes] = useState<ArrayNode[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const [timeline, setTimeline] = useState<DSAnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'SEARCH'|'INSERT'|'DELETE'>('INSERT');
  const [activeCode, setActiveCode] = useState(linkedListSnippets.INSERT_TAIL);
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);

  // Inputs
  const [valInput, setValInput] = useState(99);
  const [idxInput, setIdxInput] = useState(0);

  // FIX HYDRATION ERROR: Dùng setTimeout để tránh lỗi set-state-in-effect đồng bộ
  useEffect(() => {
      const initTimer = setTimeout(() => {
          setIsMounted(true);
          setNodes(initLinkedList([15, 23, 42]));
      }, 0);
      return () => clearTimeout(initTimer);
  }, []);

  // --- ANIMATION CONTROLLER ---
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
        timer = setTimeout(() => setCurrentStep(p => p + 1), 1000); // Chậm (1s) để nhìn rõ pointer change
    } else if (isAnimating && currentStep === timeline.length - 1) {
        // Animation finished: Save final state
        const timeoutId = setTimeout(() => {
            setIsAnimating(false);
            setNodes(timeline[timeline.length - 1].arrayState); 
        }, 1000);
        return () => clearTimeout(timeoutId);
    }
    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, timeline]);

  // Current State
  const currentNodes = isAnimating && timeline.length > 0 ? timeline[currentStep].arrayState : nodes;
  const currentMessage = isAnimating && timeline.length > 0 ? timeline[currentStep].message : "Ready. Head is at index 0.";

  // --- HANDLERS ---
  const handleSearch = () => {
      setActiveCode(linkedListSnippets.SEARCH);
      runAnimation(generateLLSearch(nodes, valInput));
  };

  const handleInsertHead = () => {
      setActiveCode(linkedListSnippets.INSERT_HEAD);
      runAnimation(generateLLInsertHead(nodes, valInput));
  };

  const handleInsertTail = () => {
      setActiveCode(linkedListSnippets.INSERT_TAIL);
      runAnimation(generateLLInsertTail(nodes, valInput));
  };

  const handleInsertIndex = () => {
      if (idxInput < 0 || idxInput > nodes.length) return alert("Invalid Index");
      setActiveCode(linkedListSnippets.INSERT_INDEX);
      runAnimation(generateLLInsertIndex(nodes, idxInput, valInput));
  };

  const handleDeleteIndex = () => {
      if (idxInput < 0 || idxInput >= nodes.length) return alert("Invalid Index");
      if (idxInput === 0) setActiveCode(linkedListSnippets.DELETE_HEAD);
      else setActiveCode(linkedListSnippets.DELETE_INDEX);
      
      runAnimation(generateLLDeleteIndex(nodes, idxInput));
  };

  // Prevent Rendering Mismatch
  if (!isMounted) {
      return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-500 font-mono">Initializing Memory Addresses...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-4 md:p-8 relative font-sans">
      
      {/* THEORY MODAL */}
      <AnimatePresence>
        {isTheoryOpen && (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={()=>setIsTheoryOpen(false)}>
                <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden" onClick={(e)=>e.stopPropagation()}>
                    <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-950">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2"><BookOpen className="text-blue-400" /> Theory</h2>
                        <button onClick={()=>setIsTheoryOpen(false)}><X size={24} className="text-slate-400 hover:text-white"/></button>
                    </div>
                    <div className="p-6 overflow-y-auto custom-scrollbar"><LinkedListTheory/></div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* TOP NAVIGATION */}
      <div className="w-full max-w-7xl mb-6 flex justify-between items-center">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white gap-2"><ArrowLeft size={20} /> Dashboard</Link>
        <button onClick={() => setIsTheoryOpen(true)} className="p-2 bg-slate-800 rounded-full text-blue-400 hover:text-white"><BookOpen size={20}/></button>
      </div>

      <h1 className="text-3xl font-extrabold mb-8 bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Linked List Visualization</h1>

      {/* MAIN GRID LAYOUT */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: VISUALIZATION + CONTROLS (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* VISUALIZATION BOX */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 relative overflow-hidden min-h-87.5 shadow-xl flex flex-col justify-center">
                <div className="absolute top-4 left-4 flex gap-4 text-xs font-mono text-slate-500 uppercase tracking-widest">
                    <span>Size: <strong className="text-blue-400">{currentNodes.length}</strong></span>
                </div>

                {/* SCROLLABLE LIST CONTAINER */}
                <div className="w-full overflow-x-auto custom-scrollbar pb-8 pt-4">
                    <div className="flex items-start min-w-max px-4">
                        <AnimatePresence mode="popLayout">
                            {currentNodes.map((node: ArrayNode, i: number) => (
                                <motion.div 
                                    layout 
                                    key={node.id} 
                                    initial={{opacity: 0, scale: 0.5, y: -20}} 
                                    animate={{opacity: 1, scale: 1, y: 0}} 
                                    exit={{opacity: 0, scale: 0.5, y: 20}}
                                >
                                    <LinkedListNode 
                                        node={node}
                                        isHead={i === 0}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {currentNodes.length === 0 && (
                            <div className="text-slate-600 italic text-sm p-4">List is empty (Head = NULL)</div>
                        )}
                    </div>
                </div>
            </div>

            {/* STATUS MESSAGE */}
            <div className="bg-slate-900 border-l-4 border-blue-500 p-4 rounded-r-xl shadow-lg flex items-center gap-3">
                <Activity size={18} className="text-blue-400" />
                <p className="font-mono text-slate-200 text-sm">{currentMessage}</p>
            </div>

            {/* CONTROL PANEL */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="flex bg-slate-950/50 border-b border-slate-800">
                    <TabBtn name="Insert" isActive={activeTab === 'INSERT'} onClick={() => setActiveTab('INSERT')} />
                    <TabBtn name="Search" isActive={activeTab === 'SEARCH'} onClick={() => setActiveTab('SEARCH')} />
                    <TabBtn name="Delete" isActive={activeTab === 'DELETE'} onClick={() => setActiveTab('DELETE')} />
                </div>
                
                <div className="p-6 bg-slate-900/50 flex flex-wrap items-center gap-4 min-h-25">
                    
                    {activeTab === 'INSERT' && (
                        <>
                            <div className="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800">
                                <span className="text-xs font-bold text-slate-500 uppercase">Val</span>
                                <input type="number" value={valInput} onChange={(e) => setValInput(Number(e.target.value))} className="w-12 bg-transparent text-white text-center focus:outline-none font-mono" />
                            </div>
                            <button onClick={handleInsertHead} disabled={isAnimating} className="btn-secondary">Head</button>
                            <button onClick={handleInsertTail} disabled={isAnimating} className="btn-secondary">Tail</button>
                            <div className="h-8 w-px bg-slate-700 mx-2 hidden md:block"></div>
                            <div className="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800">
                                <span className="text-xs font-bold text-slate-500 uppercase">Idx</span>
                                <input type="number" value={idxInput} onChange={(e) => setIdxInput(Number(e.target.value))} className="w-10 bg-transparent text-white text-center focus:outline-none font-mono" />
                            </div>
                            <button onClick={handleInsertIndex} disabled={isAnimating} className="btn-primary bg-blue-600 hover:bg-blue-500">Insert(i)</button>
                        </>
                    )}

                    {activeTab === 'DELETE' && (
                        <>
                             <div className="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800">
                                <span className="text-xs font-bold text-slate-500 uppercase">Idx</span>
                                <input type="number" value={idxInput} onChange={(e) => setIdxInput(Number(e.target.value))} className="w-10 bg-transparent text-white text-center focus:outline-none font-mono" />
                            </div>
                            <button onClick={handleDeleteIndex} disabled={isAnimating} className="btn-primary bg-red-600 hover:bg-red-500 flex items-center gap-2"><Trash2 size={16}/> Remove(i)</button>
                        </>
                    )}

                    {activeTab === 'SEARCH' && (
                        <>
                            <div className="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800">
                                <span className="text-xs font-bold text-slate-500 uppercase">Val</span>
                                <input type="number" value={valInput} onChange={(e) => setValInput(Number(e.target.value))} className="w-12 bg-transparent text-white text-center focus:outline-none font-mono" />
                            </div>
                            <button onClick={handleSearch} disabled={isAnimating} className="btn-primary bg-yellow-600 hover:bg-yellow-500 text-black flex items-center gap-2"><SearchIcon size={16}/> Find</button>
                        </>
                    )}
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: CODE TRACE (1/3) */}
        <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl sticky top-6">
                <div className="flex items-center gap-2 p-4 border-b border-slate-800 bg-slate-950">
                    <Code2 size={18} className="text-purple-400" />
                    <span className="font-bold text-slate-200">Implementation</span>
                </div>
                <div className="p-4 bg-[#1e1e1e] overflow-x-auto min-h-100">
                    <table className="w-full border-collapse font-mono text-xs md:text-sm">
                        <tbody>
                            {activeCode.split('\n').map((line, i) => {
                                const isActive = timeline[currentStep]?.codeLine === i + 1;
                                return (
                                    <tr key={i} className={`${isActive ? 'bg-yellow-500/20' : ''} transition-colors duration-200`}>
                                        <td className="w-6 text-right pr-3 text-slate-600 border-r border-slate-700/50 select-none align-top">{i + 1}</td>
                                        <td className={`pl-3 whitespace-pre-wrap align-top ${isActive ? 'text-yellow-100 font-bold' : 'text-green-400'}`}>{line}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

      </div>

      <style jsx>{`
        .btn-primary { @apply px-4 py-2 rounded font-bold text-white transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none; }
        .btn-secondary { @apply px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 rounded font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none; }
      `}</style>
    </main>
  );
}