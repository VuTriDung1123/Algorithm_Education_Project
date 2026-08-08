"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BookOpen, X, Code2, Activity, Plus, Minus, Search } from "lucide-react";
import Link from "next/link";
import { ArrayNode, DSAnimationStep } from "@/lib/data-structures/types"; 
import { createEmptyHashTable, generateHashInsert, generateHashSearch, generateHashDelete } from "@/lib/data-structures/bloomFilterLogic";
import { bloomFilterSnippets } from "@/lib/data-structures/bloomFilterCode";

// We need a slightly modified ArrayBlock to show KEY: VALUE
function HashBlock({ node, isActive }: { node: ArrayNode, isActive?: boolean }) {
    const { value, index, address, state, auxiliary } = node;
  
    let bgColor = "bg-slate-800";
    let borderColor = "border-slate-700";
    let textColor = "text-white";
    let scale = 1;
    let zIndex = 0;
  
    if (state === 'ACCESS') {
        bgColor = "bg-green-600";
        borderColor = "border-green-400";
        scale = 1.1;
        zIndex = 10;
    } else if (state === 'SELECTED') {
        bgColor = "bg-yellow-600";
        borderColor = "border-yellow-400";
        textColor = "text-black";
        scale = 1.1;
        zIndex = 10;
    } else if (state === 'FOUND') {
        bgColor = "bg-blue-600";
        borderColor = "border-blue-400";
        scale = 1.15;
        zIndex = 20;
    } else if (state === 'DELETED') {
        bgColor = "bg-red-900/50";
        borderColor = "border-red-600";
        textColor = "text-red-400";
    }
  
    const isTombstone = state === 'DELETED' || (value === null && auxiliary?.key === null);
  
    return (
      <div className="flex flex-col items-center mx-1">
        <span className="text-[10px] font-mono text-slate-500 mb-1">{address}</span>
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`
              w-20 h-20 flex flex-col items-center justify-center rounded-lg border-2 
              font-bold font-mono shadow-lg relative
              ${bgColor} ${borderColor} ${textColor}
          `}
          style={{ scale, zIndex }}
        >
          {isTombstone ? (
              <span className="opacity-50 text-sm italic">DEL</span>
          ) : value !== null ? (
              <>
                <span className="text-xs text-slate-300 opacity-80 border-b border-slate-600 w-full text-center pb-1 mb-1">K:{auxiliary?.key}</span>
                <span className="text-lg">V:{value}</span>
              </>
          ) : (
              <span className="opacity-20 text-sm">?</span>
          )}
          
          <span className="absolute bottom-0.5 right-1 text-[8px] opacity-60 font-sans">
              {index}
          </span>
        </motion.div>
      </div>
    );
  }

const MAX_CAPACITY = 7; // Prime number for better probing

const HashTheory = () => (
  <div className="space-y-4 text-slate-300 text-sm">
    <p><strong>Bloom Filter (Bảng băm)</strong> là cấu trúc dữ liệu lưu trữ dưới dạng Key-Value, sử dụng hàm băm (Hash function) để tính toán index lưu trữ.</p>
    <ul className="list-disc pl-5 mt-2 space-y-1">
        <li><strong>Trung bình:</strong> Insert/Search/Delete mất <span className="text-green-400">O(1)</span></li>
        <li><strong>Trường hợp xấu:</strong> Nhiều phần tử băm vào cùng 1 index (Đụng độ - Collision) mất <span className="text-red-400">O(n)</span></li>
    </ul>
    <p className="mt-2 text-slate-400 italic">Ứng dụng này minh họa kỹ thuật giải quyết đụng độ bằng <strong>Linear Probing</strong> (Dò tuyến tính). Nếu slot bị đầy, nó sẽ dò slot tiếp theo (index + 1) cho đến khi tìm được chỗ trống.</p>
  </div>
);

const TabBtn = ({ name, isActive, onClick }: { name: string, isActive: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`flex-1 px-4 py-3 font-bold text-sm transition-all border-b-2 ${isActive ? 'border-indigo-500 text-indigo-400 bg-slate-900/50' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/20'}`}>{name}</button>
);

export default function HashTablePage() {
    return (
        <Suspense fallback={<div className="text-white text-center p-10">Loading...</div>}>
            <HashTableVisualizer />
        </Suspense>
    );
}

function HashTableVisualizer() {
  const [arrayData, setArrayData] = useState<ArrayNode[]>(() => createEmptyHashTable(MAX_CAPACITY));
  
  const [timeline, setTimeline] = useState<DSAnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'INSERT' | 'SEARCH' | 'DELETE'>('INSERT');
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [activeCode, setActiveCode] = useState(bloomFilterSnippets.INSERT);

  const [keyInput, setKeyInput] = useState(15);
  const [valInput, setValInput] = useState(100);

  const reset = useCallback(() => {
      setArrayData(createEmptyHashTable(MAX_CAPACITY));
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
        }, 500);
        return () => clearTimeout(timeoutId);
    }
    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, timeline]);

  const currentMainArr = isAnimating && timeline.length > 0 ? timeline[currentStep].arrayState : arrayData;
  const currentMessage = isAnimating && timeline.length > 0 ? timeline[currentStep].message : "Ready.";

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-4 md:p-8 relative font-sans">
      
      <AnimatePresence>{isTheoryOpen && (<motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={()=>setIsTheoryOpen(false)}><motion.div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-2xl" onClick={(e)=>e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-white">Bloom Filter Theory</h2><button onClick={()=>setIsTheoryOpen(false)}><X/></button></div><HashTheory/></motion.div></motion.div>)}</AnimatePresence>

      <div className="w-full max-w-7xl mb-6 flex justify-between items-center">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white gap-2"><ArrowLeft size={20} /> Dashboard</Link>
        <button onClick={() => setIsTheoryOpen(true)} className="p-2 bg-slate-800 rounded-full text-indigo-400 hover:text-white"><BookOpen size={20}/></button>
      </div>

      <h1 className="text-3xl font-extrabold mb-2 bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Bloom Filter (Linear Probing)</h1>
      <p className="text-slate-500 mb-6 text-sm">Key-Value store with collision resolution</p>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: VISUAL + CONTROL */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 relative overflow-hidden flex flex-col items-center min-h-[350px] shadow-xl">
                <div className="w-full flex justify-between text-[10px] font-mono text-slate-500 mb-4 border-b border-slate-800 pb-2 uppercase tracking-wider">
                    <span>Hash Function: <strong className="text-indigo-400">key % {MAX_CAPACITY}</strong></span>
                    <span>Capacity: <strong className="text-blue-400">{MAX_CAPACITY}</strong></span>
                </div>

                <div className="flex justify-center items-center w-full py-10 overflow-x-auto">
                    <div className="flex items-center gap-2 relative min-w-max">
                        <AnimatePresence mode="popLayout">
                            {currentMainArr.map((node, i) => (
                                <HashBlock key={node.id} node={node} />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* STATUS */}
            <div className="bg-slate-900 border-l-4 border-indigo-500 p-4 rounded-r-xl shadow-lg flex items-center gap-3">
                <Activity size={18} className="text-indigo-400" />
                <p className="font-mono text-slate-200 text-sm">{currentMessage}</p>
            </div>

            {/* CONTROLS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="flex flex-wrap bg-slate-950/50 border-b border-slate-800">
                    <TabBtn name="Insert" isActive={activeTab === 'INSERT'} onClick={() => setActiveTab('INSERT')} />
                    <TabBtn name="Search" isActive={activeTab === 'SEARCH'} onClick={() => setActiveTab('SEARCH')} />
                    <TabBtn name="Delete" isActive={activeTab === 'DELETE'} onClick={() => setActiveTab('DELETE')} />
                </div>
                <div className="p-6 bg-slate-900/50 flex flex-wrap items-center justify-center gap-4 min-h-[100px]">
                    
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-sm font-bold">KEY</span>
                        <input type="number" value={keyInput} onChange={(e) => setKeyInput(Number(e.target.value))} className="bg-slate-950 border border-slate-700 rounded px-3 py-2 w-20 text-center text-white" />
                    </div>

                    {activeTab === 'INSERT' && (
                        <div className="flex items-center gap-3">
                            <span className="text-slate-500 text-sm font-bold ml-2">VAL</span>
                            <input type="number" value={valInput} onChange={(e) => setValInput(Number(e.target.value))} className="bg-slate-950 border border-slate-700 rounded px-3 py-2 w-20 text-center text-white" />
                            <button onClick={() => { setActiveCode(bloomFilterSnippets.INSERT); runAnimation(generateHashInsert(arrayData, keyInput, valInput, MAX_CAPACITY)); }} disabled={isAnimating} className="ml-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold flex items-center gap-2"><Plus size={18}/> Insert</button>
                        </div>
                    )}
                    {activeTab === 'SEARCH' && (
                        <button onClick={() => { setActiveCode(bloomFilterSnippets.SEARCH); runAnimation(generateHashSearch(arrayData, keyInput, MAX_CAPACITY)); }} disabled={isAnimating} className="ml-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold flex items-center gap-2"><Search size={18}/> Search</button>
                    )}
                    {activeTab === 'DELETE' && (
                        <button onClick={() => { setActiveCode(bloomFilterSnippets.DELETE); runAnimation(generateHashDelete(arrayData, keyInput, MAX_CAPACITY)); }} disabled={isAnimating} className="ml-2 px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-bold flex items-center gap-2"><Minus size={18}/> Delete</button>
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
                    <Code2 size={18} className="text-indigo-400" />
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
