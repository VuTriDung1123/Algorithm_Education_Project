"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BookOpen, X, Code2, Activity, Play } from "lucide-react";
import Link from "next/link";
import GraphView from "@/components/Visualization/Graph/GraphView";
import { GraphStateData, DSAnimationStep } from "@/lib/data-structures/types"; 
import { createWeightedGraph, generateDijkstra } from "@/lib/data-structures/dijkstraLogic";
import { dijkstraSnippets } from "@/lib/data-structures/dijkstraCode";

const DijkstraTheory = () => (
  <div className="space-y-4 text-slate-300 text-sm">
    <p><strong>Dijkstra</strong> là thuật toán tìm đường đi ngắn nhất từ một đỉnh nguồn đến tất cả các đỉnh còn lại trên đồ thị có trọng số không âm.</p>
    <ul className="list-disc pl-5 mt-2 space-y-1">
        <li><strong>Cơ chế:</strong> Sử dụng Hàng đợi ưu tiên (Priority Queue) để luôn chọn đỉnh có khoảng cách nhỏ nhất chưa được xử lý.</li>
        <li><strong>Greedy (Tham lam):</strong> Thuật toán luôn tin rằng đỉnh có khoảng cách ngắn nhất hiện tại là khoảng cách ngắn nhất vĩnh viễn. (Đó là lý do không hoạt động với trọng số âm).</li>
        <li><strong>Độ phức tạp:</strong> <span className="text-emerald-400">O((V + E) log V)</span> với V là số đỉnh, E là số cạnh (nếu dùng Min-Heap).</li>
    </ul>
  </div>
);

export default function DijkstraPage() {
    return (
        <Suspense fallback={<div className="text-white text-center p-10">Loading...</div>}>
            <DijkstraVisualizer />
        </Suspense>
    );
}

function DijkstraVisualizer() {
  const [graphData, setGraphData] = useState<GraphStateData>(() => createWeightedGraph());
  const [pqState, setPqState] = useState<{node: string, dist: number}[]>([]);
  const [distances, setDistances] = useState<Record<string, number>>({});
  
  const [timeline, setTimeline] = useState<DSAnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);

  const reset = useCallback(() => {
      setGraphData(createWeightedGraph());
      setPqState([]);
      setDistances({});
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
        timer = setTimeout(() => setCurrentStep(p => p + 1), 800); 
    } else if (isAnimating && currentStep === timeline.length - 1) {
        const timeoutId = setTimeout(() => {
            setIsAnimating(false);
            const lastStep = timeline[timeline.length - 1];
            if (lastStep.graphState) setGraphData(lastStep.graphState);
            if (lastStep.auxiliary?.pq) setPqState(lastStep.auxiliary.pq as any);
            if (lastStep.auxiliary?.distances) setDistances(lastStep.auxiliary.distances as any);
        }, 500);
        return () => clearTimeout(timeoutId);
    }
    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, timeline]);

  const currentMainGraph = isAnimating && timeline.length > 0 && timeline[currentStep].graphState ? timeline[currentStep].graphState! : graphData;
  const currentMessage = isAnimating && timeline.length > 0 ? timeline[currentStep].message : "Ready.";
  
  const currentPQ = isAnimating && timeline.length > 0 && timeline[currentStep].auxiliary?.pq ? timeline[currentStep].auxiliary!.pq as {node:string, dist:number}[] : pqState;
  const currentDist = isAnimating && timeline.length > 0 && timeline[currentStep].auxiliary?.distances ? timeline[currentStep].auxiliary!.distances as Record<string, number> : distances;

  const handleRun = () => {
      runAnimation(generateDijkstra('A'));
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-4 md:p-8 relative font-sans">
      
      <AnimatePresence>{isTheoryOpen && (<motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={()=>setIsTheoryOpen(false)}><motion.div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-2xl" onClick={(e)=>e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-white">Dijkstra Theory</h2><button onClick={()=>setIsTheoryOpen(false)}><X/></button></div><DijkstraTheory/></motion.div></motion.div>)}</AnimatePresence>

      <div className="w-full max-w-7xl mb-6 flex justify-between items-center">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white gap-2"><ArrowLeft size={20} /> Dashboard</Link>
        <button onClick={() => setIsTheoryOpen(true)} className="p-2 bg-slate-800 rounded-full text-emerald-400 hover:text-white"><BookOpen size={20}/></button>
      </div>

      <h1 className="text-3xl font-extrabold mb-2 bg-linear-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">Dijkstra's Algorithm</h1>
      <p className="text-slate-500 mb-6 text-sm">Tìm đường đi ngắn nhất (Shortest Path)</p>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: VISUAL + CONTROL */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden flex flex-col items-center shadow-xl">
                
                {/* Node Distances floating label */}
                <div className="w-full mb-4 flex justify-around">
                    {currentMainGraph.nodes.map(n => (
                        <div key={`dist-${n.id}`} className="text-center">
                            <span className="text-xs text-slate-500">{n.id}</span>
                            <div className="text-sm font-bold text-emerald-400">{currentDist[n.id] === undefined ? '∞' : (currentDist[n.id] === Infinity ? '∞' : currentDist[n.id])}</div>
                        </div>
                    ))}
                </div>

                <GraphView graph={currentMainGraph} containerHeight={300} />
                
                {/* Result Bar */}
                <div className="w-full mt-4 p-4 bg-slate-950 rounded-lg border border-slate-800 flex flex-col">
                    <span className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Priority Queue (Min-Heap)</span>
                    <div className="flex gap-2 flex-wrap">
                        {currentPQ.map((item, idx) => (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} key={idx} className={`px-3 py-1 rounded border-2 border-emerald-500 text-emerald-400 flex items-center justify-center font-bold text-sm shadow-lg`}>
                                {item.node}: {item.dist}
                            </motion.div>
                        ))}
                        {currentPQ.length === 0 && <span className="text-slate-700 italic">Empty</span>}
                    </div>
                </div>
            </div>

            {/* STATUS */}
            <div className="bg-slate-900 border-l-4 border-emerald-500 p-4 rounded-r-xl shadow-lg flex items-center gap-3">
                <Activity size={18} className="text-emerald-400" />
                <p className="font-mono text-slate-200 text-sm">{currentMessage}</p>
            </div>

            {/* CONTROLS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 bg-slate-900/50 flex flex-wrap items-center justify-center gap-4 min-h-[100px]">
                    <button onClick={handleRun} disabled={isAnimating} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold flex items-center gap-2"><Play size={18}/> Start Dijkstra (Source: A)</button>
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
                            {dijkstraSnippets.DIJKSTRA.split('\n').map((line, i) => {
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
