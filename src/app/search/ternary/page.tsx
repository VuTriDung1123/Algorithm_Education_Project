"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Square, RotateCcw } from "lucide-react";
import SearchView from "@/components/Visualization/Search/SearchView";
import { ternarySearchLogic } from "@/lib/search/ternarySearchLogic";
import { ternarySearchSnippets } from "@/lib/search/ternarySearchCode";
import { DSAnimationStep, SearchStateData } from "@/lib/data-structures/types";

export default function TernarySearchPage() {
    const [array, setArray] = useState<number[]>([]);
    const [target, setTarget] = useState<number>(0);
    const [searchState, setSearchState] = useState<SearchStateData | null>(null);
    const [message, setMessage] = useState("Nhập mảng và số cần tìm để bắt đầu");
    const [activeLine, setActiveLine] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);

    const generatorRef = useRef<Generator<DSAnimationStep> | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Init array
    useEffect(() => {
        resetArray();
    }, []);

    const resetArray = () => {
        const newArr = Array.from({ length: 15 }, () => Math.floor(Math.random() * 90) + 10).sort((a,b)=>a-b);
        setArray(newArr);
        setTarget(newArr[Math.floor(Math.random() * newArr.length)]);
        setSearchState(null);
        setMessage("Sẵn sàng");
        setActiveLine(0);
        setIsPlaying(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const startSearch = () => {
        if (isPlaying) return;
        generatorRef.current = ternarySearchLogic(array, target);
        setIsPlaying(true);
        executeNextStep();
    };

    const executeNextStep = () => {
        if (!generatorRef.current) return;
        const result = generatorRef.current.next();
        if (result.done) {
            setIsPlaying(false);
            return;
        }

        const step = result.value;
        if (step.searchState) setSearchState(step.searchState);
        if (step.message) setMessage(step.message);
        if (step.codeLine) setActiveLine(step.codeLine);

        timeoutRef.current = setTimeout(executeNextStep, speed);
    };

    const stopSearch = () => {
        setIsPlaying(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    return (
        <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-4 font-sans">
            {/* Header */}
            <div className="w-full max-w-7xl flex items-center justify-between mb-6">
                <Link href="/" className="flex items-center text-slate-400 hover:text-white gap-2">
                    <ArrowLeft size={20} /> Dashboard
                </Link>
                <h1 className="text-3xl font-bold">Ternary Search</h1>
                <div className="w-24"></div>
            </div>

            {/* Control Panel */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-wrap gap-6 items-center w-full max-w-7xl shadow-xl z-20">
                <div className="flex items-center gap-3">
                    <span className="text-slate-400">Target:</span>
                    <input 
                        type="number" 
                        value={target}
                        onChange={(e) => setTarget(Number(e.target.value))}
                        disabled={isPlaying}
                        className="w-20 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                </div>
                
                <div className="h-8 w-px bg-slate-700 mx-2"></div>

                <div className="flex gap-3">
                    <button onClick={startSearch} disabled={isPlaying} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 px-6 py-2 rounded-lg font-bold">
                        <Play size={18} /> Play
                    </button>
                    <button onClick={stopSearch} disabled={!isPlaying} className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 px-4 py-2 rounded-lg font-bold">
                        <Square size={18} /> Stop
                    </button>
                    <button onClick={resetArray} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg font-bold">
                        <RotateCcw size={18} /> Reset
                    </button>
                </div>

                <div className="ml-auto flex items-center gap-3">
                    <span className="text-slate-400">Speed:</span>
                    <input type="range" min="100" max="1500" step="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="accent-blue-500" style={{ direction: "rtl" }}/>
                </div>
            </div>

            <div className="w-full max-w-7xl mt-6 px-6 py-4 bg-blue-900/30 border border-blue-500/30 rounded-xl text-center">
                <p className="text-xl font-medium text-blue-200">{message}</p>
            </div>

            {searchState && <SearchView searchState={searchState} />}

            {/* Code View */}
            <div className="w-full max-w-7xl mt-12 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 font-mono text-sm text-slate-300">
                    Pseudocode
                </div>
                <div className="p-4 font-mono text-sm overflow-x-auto">
                    {ternarySearchSnippets.javascript.split('\n').map((line: string, i: number) => (
                        <div key={i} className={`px-2 py-1 rounded ${activeLine === i + 1 ? 'bg-yellow-500/20 text-yellow-300 border-l-2 border-yellow-500' : 'text-slate-400'}`}>
                            {line.replace(/ /g, " ")}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}