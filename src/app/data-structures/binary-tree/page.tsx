"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BookOpen, X, Code2, Activity, Play } from "lucide-react";
import Link from "next/link";
import TreeView from "@/components/Visualization/Tree/TreeView";
import { TreeNodeData, DSAnimationStep } from "@/lib/data-structures/types"; 
import { createSampleBinaryTree, generateTraversal } from "@/lib/data-structures/binaryTreeLogic";
import { btSnippets } from "@/lib/data-structures/binaryTreeCode";

const BTTheory = () => (
  <div className="space-y-4 text-slate-300 text-sm">
    <p><strong>Binary Tree (Cây Nhị Phân)</strong> là cấu trúc phân cấp, mỗi node có tối đa 2 node con (trái và phải).</p>
    <ul className="list-disc pl-5 mt-2 space-y-1">
        <li><strong>Pre-order (Tiền tự):</strong> Root ➔ Left ➔ Right</li>
        <li><strong>In-order (Trung tự):</strong> Left ➔ Root ➔ Right</li>
        <li><strong>Post-order (Hậu tự):</strong> Left ➔ Right ➔ Root</li>
    </ul>
    <p className="mt-2 text-slate-400 italic">Duyệt cây là kỹ thuật đệ quy quan trọng nhất khi làm việc với cấu trúc dữ liệu dạng cây.</p>
  </div>
);

const TabBtn = ({ name, isActive, onClick }: { name: string, isActive: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`flex-1 px-4 py-3 font-bold text-sm transition-all border-b-2 ${isActive ? 'border-sky-500 text-sky-400 bg-slate-900/50' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/20'}`}>{name}</button>
);

export default function BinaryTreePage() {
    return (
        <Suspense fallback={<div className="text-white text-center p-10">Loading...</div>}>
            <BinaryTreeVisualizer />
        </Suspense>
    );
}

function BinaryTreeVisualizer() {
  const [treeData, setTreeData] = useState<TreeNodeData[]>(() => createSampleBinaryTree());
  const [visited, setVisited] = useState<number[]>([]);
  
  const [timeline, setTimeline] = useState<DSAnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'PRE_ORDER' | 'IN_ORDER' | 'POST_ORDER'>('PRE_ORDER');
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [activeCode, setActiveCode] = useState(btSnippets.PRE_ORDER);

  const reset = useCallback(() => {
      setTreeData(createSampleBinaryTree());
      setVisited([]);
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
            if (lastStep.auxiliary?.visited) setVisited(lastStep.auxiliary.visited as number[]);
        }, 500);
        return () => clearTimeout(timeoutId);
    }
    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, timeline]);

  const currentMainTree = isAnimating && timeline.length > 0 && timeline[currentStep].treeState ? timeline[currentStep].treeState : treeData;
  const currentMessage = isAnimating && timeline.length > 0 ? timeline[currentStep].message : "Ready.";
  const currentVisited = isAnimating && timeline.length > 0 && timeline[currentStep].auxiliary?.visited ? timeline[currentStep].auxiliary!.visited as number[] : visited;

  const handleRun = () => {
      if (activeTab === 'PRE_ORDER') {
          setActiveCode(btSnippets.PRE_ORDER);
          runAnimation(generateTraversal('PRE'));
      } else if (activeTab === 'IN_ORDER') {
          setActiveCode(btSnippets.IN_ORDER);
          runAnimation(generateTraversal('IN'));
      } else {
          setActiveCode(btSnippets.POST_ORDER);
          runAnimation(generateTraversal('POST'));
      }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-4 md:p-8 relative font-sans">
      
      <AnimatePresence>{isTheoryOpen && (<motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={()=>setIsTheoryOpen(false)}><motion.div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-2xl" onClick={(e)=>e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-white">Binary Tree Theory</h2><button onClick={()=>setIsTheoryOpen(false)}><X/></button></div><BTTheory/></motion.div></motion.div>)}</AnimatePresence>

      <div className="w-full max-w-7xl mb-6 flex justify-between items-center">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white gap-2"><ArrowLeft size={20} /> Dashboard</Link>
        <button onClick={() => setIsTheoryOpen(true)} className="p-2 bg-slate-800 rounded-full text-sky-400 hover:text-white"><BookOpen size={20}/></button>
      </div>

      <h1 className="text-3xl font-extrabold mb-2 bg-linear-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">Binary Tree Traversal</h1>
      <p className="text-slate-500 mb-6 text-sm">Duyệt cây nhị phân (Pre-order, In-order, Post-order)</p>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: VISUAL + CONTROL */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden flex flex-col items-center shadow-xl">
                <TreeView nodes={currentMainTree} containerHeight={300} />
                
                {/* Result Bar */}
                <div className="w-full mt-4 p-4 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Visited Nodes</span>
                    <div className="flex gap-2 flex-wrap">
                        {currentVisited.map((val, idx) => (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} key={idx} className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm shadow-lg">
                                {val}
                            </motion.div>
                        ))}
                        {currentVisited.length === 0 && <span className="text-slate-700 italic">Not started yet...</span>}
                    </div>
                </div>
            </div>

            {/* STATUS */}
            <div className="bg-slate-900 border-l-4 border-sky-500 p-4 rounded-r-xl shadow-lg flex items-center gap-3">
                <Activity size={18} className="text-sky-400" />
                <p className="font-mono text-slate-200 text-sm">{currentMessage}</p>
            </div>

            {/* CONTROLS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="flex bg-slate-950/50 border-b border-slate-800">
                    <TabBtn name="Pre-order" isActive={activeTab === 'PRE_ORDER'} onClick={() => {setActiveTab('PRE_ORDER'); setActiveCode(btSnippets.PRE_ORDER)}} />
                    <TabBtn name="In-order" isActive={activeTab === 'IN_ORDER'} onClick={() => {setActiveTab('IN_ORDER'); setActiveCode(btSnippets.IN_ORDER)}} />
                    <TabBtn name="Post-order" isActive={activeTab === 'POST_ORDER'} onClick={() => {setActiveTab('POST_ORDER'); setActiveCode(btSnippets.POST_ORDER)}} />
                </div>
                <div className="p-6 bg-slate-900/50 flex flex-wrap items-center justify-center gap-4 min-h-[100px]">
                    <button onClick={handleRun} disabled={isAnimating} className="px-6 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded font-bold flex items-center gap-2"><Play size={18}/> Start Traversal</button>
                    <div className="h-8 w-px bg-slate-700 mx-4 hidden md:block"></div>
                    <button onClick={reset} className="text-slate-500 hover:text-white text-sm">Reset</button>
                </div>
            </div>
        </div>

        {/* RIGHT: CODE */}
        <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl sticky top-6">
                <div className="flex items-center gap-2 p-4 border-b border-slate-800 bg-slate-950">
                    <Code2 size={18} className="text-sky-400" />
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
