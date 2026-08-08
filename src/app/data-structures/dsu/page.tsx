"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BookOpen, X, Code2, Activity, Link2, Search } from "lucide-react";
import Link from "next/link";
import GraphView from "@/components/Visualization/Graph/GraphView";
import { GraphStateData, DSAnimationStep } from "@/lib/data-structures/types"; 
import { createDSUGraph, generateDSUFind, generateDSUUnion } from "@/lib/data-structures/dsuLogic";
import { dsuSnippets } from "@/lib/data-structures/dsuCode";

const DSUTheory = () => (
  <div className="space-y-4 text-slate-300 text-sm">
    <p><strong>Disjoint Set Union (DSU)</strong> hay còn gọi là Union-Find, là cấu trúc dữ liệu theo dõi một tập hợp các phần tử được chia thành các tập con không giao nhau.</p>
    <ul className="list-disc pl-5 mt-2 space-y-1">
        <li><strong>Find:</strong> Xác định xem một phần tử thuộc tập hợp nào (trả về đại diện/root của tập đó). Dùng để kiểm tra xem 2 phần tử có cùng tập hay không.</li>
        <li><strong>Union:</strong> Gộp hai tập hợp lại với nhau.</li>
        <li><strong>Path Compression:</strong> Kỹ thuật tối ưu hóa trong hàm Find. Mỗi khi tìm được root, cập nhật trực tiếp parent của các node trên đường đi trỏ thẳng vào root. Giúp độ phức tạp giảm xuống gần như hằng số <span className="text-orange-400">O(α(n))</span>.</li>
    </ul>
  </div>
);

export default function DSUPage() {
    return (
        <Suspense fallback={<div className="text-white text-center p-10">Loading...</div>}>
            <DSUVisualizer />
        </Suspense>
    );
}

function DSUVisualizer() {
  const [graphData, setGraphData] = useState<GraphStateData>(() => createDSUGraph());
  
  const [timeline, setTimeline] = useState<DSAnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [activeCodeContext, setActiveCodeContext] = useState<'FIND' | 'UNION'>('UNION');
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);

  const [findNode, setFindNode] = useState("0");
  const [unionU, setUnionU] = useState("0");
  const [unionV, setUnionV] = useState("1");

  const reset = useCallback(() => {
      setGraphData(createDSUGraph());
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
        timer = setTimeout(() => setCurrentStep(p => p + 1), 700); 
    } else if (isAnimating && currentStep === timeline.length - 1) {
        const timeoutId = setTimeout(() => {
            setIsAnimating(false);
            const lastStep = timeline[timeline.length - 1];
            if (lastStep.auxiliary?.graphState) setGraphData(lastStep.auxiliary.graphState as GraphStateData);
            else if (lastStep.graphState) setGraphData(lastStep.graphState);
        }, 500);
        return () => clearTimeout(timeoutId);
    }
    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, timeline]);

  const currentMainGraph = isAnimating && timeline.length > 0 && timeline[currentStep].graphState ? timeline[currentStep].graphState! : graphData;
  const currentMessage = isAnimating && timeline.length > 0 ? timeline[currentStep].message : "Ready.";
  const activeCodeSnippet = dsuSnippets[activeCodeContext];

  const handleUnion = () => {
      if (unionU === unionV) return;
      setActiveCodeContext('UNION');
      runAnimation(generateDSUUnion(graphData, unionU, unionV));
  };

  const handleFind = () => {
      setActiveCodeContext('FIND');
      runAnimation(generateDSUFind(graphData, findNode));
  };

  const nodeOptions = ["0", "1", "2", "3", "4"];

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-4 md:p-8 relative font-sans">
      
      <AnimatePresence>{isTheoryOpen && (<motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={()=>setIsTheoryOpen(false)}><motion.div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-2xl" onClick={(e)=>e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-white">DSU Theory</h2><button onClick={()=>setIsTheoryOpen(false)}><X/></button></div><DSUTheory/></motion.div></motion.div>)}</AnimatePresence>

      <div className="w-full max-w-7xl mb-6 flex justify-between items-center">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white gap-2"><ArrowLeft size={20} /> Dashboard</Link>
        <button onClick={() => setIsTheoryOpen(true)} className="p-2 bg-slate-800 rounded-full text-orange-400 hover:text-white"><BookOpen size={20}/></button>
      </div>

      <h1 className="text-3xl font-extrabold mb-2 bg-linear-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Disjoint Set Union</h1>
      <p className="text-slate-500 mb-6 text-sm">Cấu trúc dữ liệu tập hợp rời rạc (Find & Union)</p>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: VISUAL + CONTROL */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden flex flex-col items-center shadow-xl">
                <GraphView graph={currentMainGraph} containerHeight={400} />
            </div>

            {/* STATUS */}
            <div className="bg-slate-900 border-l-4 border-orange-500 p-4 rounded-r-xl shadow-lg flex items-center gap-3">
                <Activity size={18} className="text-orange-400" />
                <p className="font-mono text-slate-200 text-sm">{currentMessage}</p>
            </div>

            {/* CONTROLS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 bg-slate-900/50 flex flex-wrap items-center justify-between gap-4 min-h-[100px]">
                    
                    {/* Union Control */}
                    <div className="flex items-center gap-2">
                        <select value={unionU} onChange={e=>setUnionU(e.target.value)} className="bg-slate-950 border border-slate-700 rounded px-2 py-2 text-white">
                            {nodeOptions.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <span className="text-slate-500">+</span>
                        <select value={unionV} onChange={e=>setUnionV(e.target.value)} className="bg-slate-950 border border-slate-700 rounded px-2 py-2 text-white">
                            {nodeOptions.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <button onClick={handleUnion} disabled={isAnimating || unionU === unionV} className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded font-bold flex items-center gap-2 ml-2 disabled:opacity-50"><Link2 size={18}/> Union</button>
                    </div>

                    <div className="h-8 w-px bg-slate-700 hidden lg:block"></div>

                    {/* Find Control */}
                    <div className="flex items-center gap-2">
                        <select value={findNode} onChange={e=>setFindNode(e.target.value)} className="bg-slate-950 border border-slate-700 rounded px-2 py-2 text-white">
                            {nodeOptions.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <button onClick={handleFind} disabled={isAnimating} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold flex items-center gap-2 ml-2 disabled:opacity-50"><Search size={18}/> Find & Compress</button>
                    </div>

                    <div className="h-8 w-px bg-slate-700 hidden lg:block"></div>
                    <button onClick={reset} className="text-slate-500 hover:text-white text-sm">Reset</button>
                </div>
            </div>
        </div>

        {/* RIGHT: CODE */}
        <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl sticky top-6">
                <div className="flex items-center gap-2 p-4 border-b border-slate-800 bg-slate-950">
                    <Code2 size={18} className="text-orange-400" />
                    <span className="font-bold text-slate-200">Pseudocode ({activeCodeContext})</span>
                </div>
                <div className="p-4 bg-[#1e1e1e] overflow-x-auto min-h-[400px]">
                    <table className="w-full border-collapse font-mono text-xs md:text-sm">
                        <tbody>
                            {activeCodeSnippet.split('\n').map((line, i) => {
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
