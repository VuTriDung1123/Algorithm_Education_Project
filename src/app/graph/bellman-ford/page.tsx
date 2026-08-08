"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Code2, Activity, Play, RotateCcw } from "lucide-react";
import GraphView from "@/components/Visualization/Graph/GraphView";
import { GraphStateData, DSAnimationStep } from "@/lib/data-structures/types"; 
import { createBellmanFordGraph, generateBellmanFord } from "@/lib/search/bellmanFordLogic";
import { bellmanFordSnippets } from "@/lib/search/bellmanFordCode";

export default function Page() {
  const [graphData, setGraphData] = useState<GraphStateData>(() => createBellmanFordGraph());
  const [timeline, setTimeline] = useState<DSAnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [auxiliary, setAuxiliary] = useState<any>({});

  const reset = useCallback(() => {
      setGraphData(createBellmanFordGraph());
      setTimeline([]);
      setCurrentStep(0);
      setIsAnimating(false);
      setAuxiliary({});
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
        setIsAnimating(false);
        const lastStep = timeline[timeline.length - 1];
        if (lastStep.graphState) setGraphData(lastStep.graphState);
        if (lastStep.auxiliary) setAuxiliary(lastStep.auxiliary);
    }
    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, timeline]);

  const currentMainGraph = isAnimating && timeline.length > 0 && timeline[currentStep].graphState ? timeline[currentStep].graphState! : graphData;
  const currentMessage = isAnimating && timeline.length > 0 ? timeline[currentStep].message : "Sẵn sàng.";
  const currentAux = isAnimating && timeline.length > 0 && timeline[currentStep].auxiliary ? timeline[currentStep].auxiliary : auxiliary;

  const handleRun = () => {
      runAnimation(generateBellmanFord('S'));
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-4 md:p-8 relative font-sans">
      <div className="w-full max-w-7xl mb-6 flex justify-between items-center">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white gap-2"><ArrowLeft size={20} /> Dashboard</Link>
      </div>

      <h1 className="text-3xl font-extrabold mb-2 bg-linear-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">Bellman-Ford Algorithm</h1>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden flex flex-col items-center shadow-xl min-h-[400px]">
                {/* Custom overlay based on algorithm */}
                {currentAux && currentAux.distances && (
                   <div className="w-full mb-4 flex justify-around">
                       {currentMainGraph.nodes.map(n => (
                           <div key={n.id} className="text-center">
                               <span className="text-xs text-slate-500">{n.id}</span>
                               <div className="text-sm font-bold text-pink-400">{currentAux.distances[n.id] === Infinity ? '∞' : currentAux.distances[n.id]}</div>
                           </div>
                       ))}
                   </div>
                )}
                {currentAux && currentAux.inDegree && (
                   <div className="w-full mb-4 flex justify-around border-b border-slate-800 pb-2">
                       {currentMainGraph.nodes.map(n => (
                           <div key={n.id} className="text-center">
                               <span className="text-xs text-slate-500">In({n.id})</span>
                               <div className="text-sm font-bold text-yellow-400">{currentAux.inDegree[n.id]}</div>
                           </div>
                       ))}
                   </div>
                )}

                <GraphView graph={currentMainGraph} containerHeight={300} />
                
                {currentAux && currentAux.result && (
                  <div className="w-full mt-4 p-4 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-xs text-slate-500 uppercase">Topo Sort Result</span>
                    <div className="text-lg font-bold text-green-400 tracking-widest mt-2">{currentAux.result.join(' → ')}</div>
                  </div>
                )}
            </div>

            <div className="bg-slate-900 border-l-4 border-pink-500 p-4 rounded-r-xl shadow-lg flex items-center gap-3">
                <Activity size={18} className="text-pink-400" />
                <p className="font-mono text-slate-200 text-sm">{currentMessage}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-6 flex flex-wrap items-center justify-center gap-4">
                <button onClick={handleRun} disabled={isAnimating} className="px-6 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded font-bold flex items-center gap-2"><Play size={18}/> Bắt đầu</button>
                <div className="h-8 w-px bg-slate-700 mx-4 hidden md:block"></div>
                <button onClick={reset} className="text-slate-500 hover:text-white text-sm flex items-center gap-2"><RotateCcw size={16}/> Reset</button>
            </div>
        </div>

        <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl sticky top-6">
                <div className="flex items-center gap-2 p-4 border-b border-slate-800 bg-slate-950">
                    <Code2 size={18} className="text-pink-400" />
                    <span className="font-bold text-slate-200">Pseudocode</span>
                </div>
                <div className="p-4 bg-[#1e1e1e] overflow-x-auto min-h-[400px]">
                    <table className="w-full border-collapse font-mono text-xs md:text-sm">
                        <tbody>
                            {bellmanFordSnippets.javascript.split('\n').map((line: string, i: number) => {
                                const isActive = timeline[currentStep]?.codeLine === i + 1;
                                return (
                                    <tr key={i} className={`${isActive ? 'bg-yellow-500/20' : ''} transition-colors`}>
                                        <td className="w-6 text-right pr-3 text-slate-600 border-r border-slate-700/50">{i + 1}</td>
                                        <td className={`pl-3 whitespace-pre-wrap ${isActive ? 'text-yellow-100 font-bold' : 'text-pink-200'}`}>{line}</td>
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