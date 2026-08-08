"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BookOpen, X, Code2, Activity, Plus, Search } from "lucide-react";
import Link from "next/link";
import TreeView from "@/components/Visualization/Tree/TreeView";
import { TreeNodeData, DSAnimationStep } from "@/lib/data-structures/types"; 
import { generateBSTInsert, generateBSTSearch } from "@/lib/data-structures/bstLogic";
import { bstSnippets } from "@/lib/data-structures/bstCode";

const BSTTheory = () => (
  <div className="space-y-4 text-slate-300 text-sm">
    <p><strong>Binary Search Tree (Cây tìm kiếm nhị phân)</strong> là cây nhị phân thỏa mãn điều kiện: Giá trị của tất cả node con bên trái nhỏ hơn node cha, và giá trị của tất cả node con bên phải lớn hơn node cha.</p>
    <ul className="list-disc pl-5 mt-2 space-y-1">
        <li><strong>Insert & Search:</strong> Trung bình <span className="text-yellow-400">O(log n)</span>. Tệ nhất <span className="text-red-400">O(n)</span> khi cây bị lệch (như danh sách liên kết).</li>
    </ul>
    <p className="mt-2 text-slate-400 italic">Thường được dùng làm nền tảng cho Set, Map trong thư viện chuẩn, và tiền đề để học các cây tự cân bằng như AVL, Red-Black.</p>
  </div>
);

const TabBtn = ({ name, isActive, onClick }: { name: string, isActive: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`flex-1 px-4 py-3 font-bold text-sm transition-all border-b-2 ${isActive ? 'border-emerald-500 text-emerald-400 bg-slate-900/50' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/20'}`}>{name}</button>
);

export default function BSTPage() {
    return (
        <Suspense fallback={<div className="text-white text-center p-10">Loading...</div>}>
            <BSTVisualizer />
        </Suspense>
    );
}

function BSTVisualizer() {
  const [treeData, setTreeData] = useState<TreeNodeData[]>([]);
  
  const [timeline, setTimeline] = useState<DSAnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'INSERT' | 'SEARCH' | 'DELETE'>('INSERT');
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [activeCode, setActiveCode] = useState(bstSnippets.INSERT);

  const [valInput, setValInput] = useState(50);

  const reset = useCallback(() => {
      setTreeData([]);
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
            if (lastStep.treeState) setTreeData(lastStep.treeState);
        }, 500);
        return () => clearTimeout(timeoutId);
    }
    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, timeline]);

  const currentMainTree = isAnimating && timeline.length > 0 && timeline[currentStep].treeState ? timeline[currentStep].treeState : treeData;
  const currentMessage = isAnimating && timeline.length > 0 ? timeline[currentStep].message : "Ready.";

  const handleInsert = () => {
      setActiveCode(bstSnippets.INSERT);
      runAnimation(generateBSTInsert(treeData, valInput));
      setValInput(Math.floor(Math.random() * 100)); // Auto random next val
  };

  const handleSearch = () => {
      setActiveCode(bstSnippets.SEARCH);
      runAnimation(generateBSTSearch(treeData, valInput));
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-4 md:p-8 relative font-sans">
      
      <AnimatePresence>{isTheoryOpen && (<motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={()=>setIsTheoryOpen(false)}><motion.div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-2xl" onClick={(e)=>e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-white">BST Theory</h2><button onClick={()=>setIsTheoryOpen(false)}><X/></button></div><BSTTheory/></motion.div></motion.div>)}</AnimatePresence>

      <div className="w-full max-w-7xl mb-6 flex justify-between items-center">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white gap-2"><ArrowLeft size={20} /> Dashboard</Link>
        <button onClick={() => setIsTheoryOpen(true)} className="p-2 bg-slate-800 rounded-full text-emerald-400 hover:text-white"><BookOpen size={20}/></button>
      </div>

      <h1 className="text-3xl font-extrabold mb-2 bg-linear-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">Binary Search Tree</h1>
      <p className="text-slate-500 mb-6 text-sm">Cây tìm kiếm nhị phân</p>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: VISUAL + CONTROL */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden flex flex-col items-center shadow-xl">
                <TreeView nodes={currentMainTree} containerHeight={400} />
            </div>

            {/* STATUS */}
            <div className="bg-slate-900 border-l-4 border-emerald-500 p-4 rounded-r-xl shadow-lg flex items-center gap-3">
                <Activity size={18} className="text-emerald-400" />
                <p className="font-mono text-slate-200 text-sm">{currentMessage}</p>
            </div>

            {/* CONTROLS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="flex bg-slate-950/50 border-b border-slate-800">
                    <TabBtn name="Insert" isActive={activeTab === 'INSERT'} onClick={() => setActiveTab('INSERT')} />
                    <TabBtn name="Search" isActive={activeTab === 'SEARCH'} onClick={() => setActiveTab('SEARCH')} />
                </div>
                <div className="p-6 bg-slate-900/50 flex flex-wrap items-center justify-center gap-4 min-h-[100px]">
                    {activeTab === 'INSERT' && (
                        <div className="flex items-center gap-3">
                            <input type="number" value={valInput} onChange={(e) => setValInput(Number(e.target.value))} className="bg-slate-950 border border-slate-700 rounded px-3 py-2 w-20 text-center text-white" />
                            <button onClick={handleInsert} disabled={isAnimating} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold flex items-center gap-2"><Plus size={18}/> Insert</button>
                        </div>
                    )}
                    {activeTab === 'SEARCH' && (
                        <div className="flex items-center gap-3">
                            <input type="number" value={valInput} onChange={(e) => setValInput(Number(e.target.value))} className="bg-slate-950 border border-slate-700 rounded px-3 py-2 w-20 text-center text-white" />
                            <button onClick={handleSearch} disabled={isAnimating} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold flex items-center gap-2"><Search size={18}/> Search</button>
                        </div>
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
                    <Code2 size={18} className="text-emerald-400" />
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
