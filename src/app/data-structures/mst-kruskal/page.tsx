"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BookOpen, X, Code2, Activity, Play } from "lucide-react";
import Link from "next/link";
import GraphView from "@/components/Visualization/Graph/GraphView";
import { GraphStateData, DSAnimationStep } from "@/lib/data-structures/types"; 
import { createKruskalGraph, generateKruskal } from "@/lib/data-structures/kruskalLogic";
import { kruskalSnippets } from "@/lib/data-structures/kruskalCode";

const KruskalTheory = () => (
  <div className="space-y-4 text-slate-300 text-sm">
    <p><strong>Kruskal's Algorithm</strong> là thuật toán Greedy (Tham lam) dùng để tìm Cây khung nhỏ nhất (Minimum Spanning Tree - MST) của một đồ thị liên thông, vô hướng có trọng số.</p>
    <ul className="list-disc pl-5 mt-2 space-y-1">
        <li><strong>Cơ chế:</strong> 
          1. Sắp xếp tất cả các cạnh theo trọng số tăng dần.
          2. Duyệt qua từng cạnh, nếu việc thêm cạnh đó vào MST không tạo thành chu trình thì lấy cạnh đó.
        </li>
        <li><strong>Chu trình:</strong> Việc kiểm tra chu trình được thực hiện cực kỳ hiệu quả thông qua cấu trúc dữ liệu Disjoint Set Union (DSU).</li>
        <li><strong>Độ phức tạp:</strong> <span className="text-pink-400">O(E log E)</span> do bước sắp xếp cạnh.</li>
    </ul>
  </div>
);

export default function KruskalPage() {
    return (
        <Suspense fallback={<div className="text-white text-center p-10">Loading...</div>}>
            <KruskalVisualizer />
        </Suspense>
    );
}

function KruskalVisualizer() {
  const [graphData, setGraphData] = useState<GraphStateData>(() => createKruskalGraph());
  const [mstEdges, setMstEdges] = useState<string[]>([]);
  const [sortedEdges, setSortedEdges] = useState<string[]>([]);
  
  const [timeline, setTimeline] = useState<DSAnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);

  const reset = useCallback(() => {
      setGraphData(createKruskalGraph());
      setMstEdges([]);
      setSortedEdges([]);
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
        timer = setTimeout(() => setCurrentStep(p => p + 1), 1000); 
    } else if (isAnimating && currentStep === timeline.length - 1) {
        const timeoutId = setTimeout(() => {
            setIsAnimating(false);
            const lastStep = timeline[timeline.length - 1];
            if (lastStep.graphState) setGraphData(lastStep.graphState);
            if (lastStep.auxiliary?.mst) setMstEdges(lastStep.auxiliary.mst as string[]);
            if (lastStep.auxiliary?.sortedEdges) setSortedEdges(lastStep.auxiliary.sortedEdges as string[]);
        }, 500);
        return () => clearTimeout(timeoutId);
    }
    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, timeline]);

  const currentMainGraph = isAnimating && timeline.length > 0 && timeline[currentStep].graphState ? timeline[currentStep].graphState! : graphData;
  const currentMessage = isAnimating && timeline.length > 0 ? timeline[currentStep].message : "Ready.";
  
  const currentMST = isAnimating && timeline.length > 0 && timeline[currentStep].auxiliary?.mst ? timeline[currentStep].auxiliary!.mst as string[] : mstEdges;
  const currentSorted = isAnimating && timeline.length > 0 && timeline[currentStep].auxiliary?.sortedEdges ? timeline[currentStep].auxiliary!.sortedEdges as string[] : sortedEdges;

  const handleRun = () => {
      runAnimation(generateKruskal());
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-4 md:p-8 relative font-sans">
      
      <AnimatePresence>{isTheoryOpen && (<motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={()=>setIsTheoryOpen(false)}><motion.div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-2xl" onClick={(e)=>e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-white">Kruskal's Theory</h2><button onClick={()=>setIsTheoryOpen(false)}><X/></button></div><KruskalTheory/></motion.div></motion.div>)}</AnimatePresence>

      <div className="w-full max-w-7xl mb-6 flex justify-between items-center">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white gap-2"><ArrowLeft size={20} /> Dashboard</Link>
        <button onClick={() => setIsTheoryOpen(true)} className="p-2 bg-slate-800 rounded-full text-pink-400 hover:text-white"><BookOpen size={20}/></button>
      </div>

      <h1 className="text-3xl font-extrabold mb-2 bg-linear-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">Kruskal's Algorithm</h1>
      <p className="text-slate-500 mb-6 text-sm">Cây khung nhỏ nhất (Minimum Spanning Tree)</p>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: VISUAL + CONTROL */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden flex flex-col items-center shadow-xl">
                <GraphView graph={currentMainGraph} containerHeight={300} />
                
                {/* Result Bar */}
                <div className="w-full mt-4 flex gap-4">
                    <div className="flex-1 p-4 bg-slate-950 rounded-lg border border-slate-800 max-h-32 overflow-y-auto">
                        <span className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Sorted Edges Queue</span>
                        <div className="flex gap-2 flex-wrap">
                            {currentSorted.map((edgeId, idx) => {
                                const edge = currentMainGraph.edges.find(e => e.id === edgeId);
                                const isMst = currentMST.includes(edgeId);
                                const isActive = currentMainGraph.edges.find(e => e.id === edgeId)?.state === 'ACCESS';
                                const isDeleted = currentMainGraph.edges.find(e => e.id === edgeId)?.state === 'DELETED';
                                
                                let color = "border-slate-700 text-slate-500";
                                if (isActive) color = "border-yellow-500 text-yellow-400 bg-yellow-900/20";
                                if (isMst) color = "border-blue-500 text-blue-400 bg-blue-900/20";
                                if (isDeleted) color = "border-red-500/50 text-red-500/50 bg-red-900/10 line-through";
                                
                                return (
                                    <div key={idx} className={`px-2 py-1 rounded border ${color} text-xs font-mono font-bold transition-all`}>
                                        {edge?.source}-{edge?.target} ({edge?.weight})
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* STATUS */}
            <div className="bg-slate-900 border-l-4 border-pink-500 p-4 rounded-r-xl shadow-lg flex items-center gap-3">
                <Activity size={18} className="text-pink-400" />
                <p className="font-mono text-slate-200 text-sm">{currentMessage}</p>
            </div>

            {/* CONTROLS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 bg-slate-900/50 flex flex-wrap items-center justify-center gap-4 min-h-[100px]">
                    <button onClick={handleRun} disabled={isAnimating} className="px-6 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded font-bold flex items-center gap-2"><Play size={18}/> Start Kruskal</button>
                    <div className="h-8 w-px bg-slate-700 mx-4 hidden md:block"></div>
                    <button onClick={reset} className="text-slate-500 hover:text-white text-sm">Reset</button>
                </div>
            </div>
        </div>

        {/* RIGHT: CODE */}
        <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl sticky top-6">
                <div className="flex items-center gap-2 p-4 border-b border-slate-800 bg-slate-950">
                    <Code2 size={18} className="text-pink-400" />
                    <span className="font-bold text-slate-200">Pseudocode</span>
                </div>
                <div className="p-4 bg-[#1e1e1e] overflow-x-auto min-h-[400px]">
                    <table className="w-full border-collapse font-mono text-xs md:text-sm">
                        <tbody>
                            {kruskalSnippets.KRUSKAL.split('\n').map((line, i) => {
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
