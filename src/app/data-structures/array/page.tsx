"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Maximize2, Minimize2, Edit3, ArrowLeft, BookOpen, X, 
  Volume2, VolumeX, Share2, Info, Activity,
  List, ListOrdered, BarChart3, Calculator, Code2
} from "lucide-react";
import Link from "next/link";
import ArrayBlock from "@/components/Visualization/Array/ArrayBlock";
import { ArrayNode, DSAnimationStep } from "@/lib/data-structures/types"; 
import { 
    createEmptyArray, createArrayFromInput, createPrefixArrayEmpty,
    generateInsertSteps, generateDeleteSteps, 
    generateSearchSteps, generateMinMaxSteps, generateUpdateSteps,
    generateSortedInsertSteps, generateBinarySearchSteps,
    generateBuildPrefixSumSteps, generatePrefixSumQuerySteps
} from "@/lib/data-structures/arrayLogic";
// IMPORT FILE CODE MỚI
import { arrayCodeSnippets } from "@/lib/data-structures/codeSnippets";

const MAX_CAPACITY = 12;

// --- 1. THEORY CONTENT ---
const ArrayTheory = () => (
  <div className="space-y-6 text-slate-300 leading-relaxed text-sm md:text-base">
    <section>
      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
        <List size={20} className="text-blue-400" /> 1. Mảng thường (Unsorted Array)
      </h3>
      <p className="mb-2">Là tập hợp các phần tử được lưu trữ liên tiếp trong bộ nhớ.</p>
      <ul className="list-disc pl-5 space-y-1 text-slate-400 marker:text-blue-500">
        <li><strong>Truy cập:</strong> O(1)</li>
        <li><strong>Chèn/Xóa:</strong> O(N) (trừ khi chèn/xóa cuối O(1))</li>
        <li><strong>Tìm kiếm:</strong> O(N)</li>
      </ul>
    </section>
    <div className="w-full h-px bg-slate-700/50 my-4"></div>
    <section>
      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
        <ListOrdered size={20} className="text-purple-400" /> 2. Mảng đã sắp xếp (Sorted)
      </h3>
      <ul className="list-disc pl-5 space-y-1 text-slate-400 marker:text-purple-500">
        <li><strong>Tìm kiếm:</strong> Binary Search O(log N)</li>
        <li><strong>Chèn:</strong> O(N) (vẫn phải dịch chuyển)</li>
      </ul>
    </section>
  </div>
);

// --- COMPONENTS ---
const ModeBtn = ({ name, icon: Icon, isActive, onClick }: any) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-t-lg font-bold text-xs md:text-sm transition-all border-t border-l border-r whitespace-nowrap ${isActive ? 'bg-slate-900 border-slate-700 text-blue-400 translate-y-[1px] z-10' : 'bg-slate-950 border-transparent text-slate-500 hover:text-slate-300'}`}>
        <Icon size={16} /> {name}
    </button>
);

const TabBtn = ({ name, isActive, onClick }: { name: string, isActive: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`flex-1 px-4 py-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${isActive ? 'border-blue-500 text-blue-400 bg-slate-900/50' : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/20'}`}>
        {name}
    </button>
);

export default function ArrayPage() {
    return (
        <Suspense fallback={<div className="text-white text-center p-10">Loading...</div>}>
            <ArrayVisualizer />
        </Suspense>
    );
}

function ArrayVisualizer() {
  const [arrayData, setArrayData] = useState<ArrayNode[]>(() => createEmptyArray(MAX_CAPACITY));
  const [prefixData, setPrefixData] = useState<ArrayNode[]>(() => createPrefixArrayEmpty(MAX_CAPACITY));
  
  const [size, setSize] = useState(0); 
  const [timeline, setTimeline] = useState<DSAnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [mode, setMode] = useState<'UNSORTED' | 'SORTED' | 'RANGE'>('UNSORTED');
  const [activeTab, setActiveTab] = useState<'CREATE' | 'SEARCH' | 'INSERT' | 'REMOVE' | 'UPDATE' | 'QUERY'>('INSERT');
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [activeCode, setActiveCode] = useState(""); // State mới để lưu code đang hiển thị

  const [valInput, setValInput] = useState(50);
  const [idxInput, setIdxInput] = useState(0);
  const [userInputArray, setUserInputArray] = useState("3, 1, 4, 1, 5, 9"); 
  const [rangeStart, setRangeStart] = useState(0);
  const [rangeEnd, setRangeEnd] = useState(2);

  // --- HELPERS ---
  const resetWithData = useCallback((input: number[], forceSort = false) => {
      let validData = input.slice(0, MAX_CAPACITY);
      if (forceSort || mode === 'SORTED') validData.sort((a, b) => a - b);
      
      const newArray = createArrayFromInput(validData, MAX_CAPACITY);
      setArrayData(newArray);
      setPrefixData(createPrefixArrayEmpty(MAX_CAPACITY));
      setSize(validData.length);
      setTimeline([]);
      setCurrentStep(0);
      setIsAnimating(false);

      if (mode === 'RANGE' && validData.length > 0) {
          setTimeout(() => runAnimation(generateBuildPrefixSumSteps(newArray, validData.length, MAX_CAPACITY)), 100);
      }
  }, [mode]);

  const switchMode = (newMode: 'UNSORTED' | 'SORTED' | 'RANGE') => {
      setMode(newMode);
      setTimeline([]);
      setCurrentStep(0);
      setIsAnimating(false);
      setPrefixData(createPrefixArrayEmpty(MAX_CAPACITY)); 
      
      // Default tabs & Code
      if (newMode === 'RANGE') {
          setActiveTab('QUERY');
          setActiveCode(arrayCodeSnippets.RANGE_QUERY);
      } else {
          setActiveTab('INSERT');
          setActiveCode(newMode === 'SORTED' ? arrayCodeSnippets.INSERT_SORTED : arrayCodeSnippets.INSERT_TAIL);
      }

      if (newMode === 'SORTED') {
          const currentValues = arrayData.slice(0, size).map(n => n.value!).sort((a, b) => a - b);
          resetWithData(currentValues, true);
      } else if (newMode === 'RANGE') {
          const currentValues = arrayData.slice(0, size).map(n => n.value!);
          resetWithData(currentValues, false);
      }
  };

  const runAnimation = (generator: Generator<DSAnimationStep>) => {
    const steps: DSAnimationStep[] = [];
    for (const step of generator) steps.push(step);
    if (steps.length === 0) return;
    setTimeline(steps);
    setCurrentStep(0);
    setIsAnimating(true);
  };

  // Auto set code snippet when tab changes
  useEffect(() => {
      if (mode === 'RANGE') {
          setActiveCode(arrayCodeSnippets.RANGE_QUERY);
          return;
      }
      switch(activeTab) {
          case 'SEARCH': setActiveCode(mode === 'SORTED' ? arrayCodeSnippets.SEARCH_BINARY : arrayCodeSnippets.SEARCH_LINEAR); break;
          case 'INSERT': setActiveCode(mode === 'SORTED' ? arrayCodeSnippets.INSERT_SORTED : arrayCodeSnippets.INSERT_INDEX); break;
          case 'REMOVE': setActiveCode(arrayCodeSnippets.DELETE_INDEX); break;
          case 'UPDATE': setActiveCode(arrayCodeSnippets.UPDATE); break;
          default: setActiveCode("");
      }
  }, [activeTab, mode]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAnimating && currentStep < timeline.length - 1) {
        timer = setTimeout(() => setCurrentStep(p => p + 1), 600); 
    } else if (isAnimating && currentStep === timeline.length - 1) {
        const timeoutId = setTimeout(() => {
            setIsAnimating(false);
            const lastStep = timeline[timeline.length - 1];
            setArrayData(lastStep.arrayState);
            if (lastStep.secondArrayState) setPrefixData(lastStep.secondArrayState);
            const newSize = lastStep.arrayState.filter((n: ArrayNode) => n.value !== null).length;
            setSize(newSize);
        }, 500);
        return () => clearTimeout(timeoutId);
    }
    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, timeline]);

  // --- Handlers ---
  const handleCreateEmpty = () => resetWithData([]);
  const handleCreateRandom = () => {
      const len = Math.floor(Math.random() * (MAX_CAPACITY - 3)) + 3;
      const arr = Array.from({length: len}, () => Math.floor(Math.random() * 20)); 
      resetWithData(arr);
  };
  const handleCreateUser = () => {
      const arr = userInputArray.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      resetWithData(arr);
  };

  const handleSearch = () => {
      if (mode === 'SORTED') {
          setActiveCode(arrayCodeSnippets.SEARCH_BINARY);
          runAnimation(generateBinarySearchSteps(arrayData, valInput, size));
      } else {
          setActiveCode(arrayCodeSnippets.SEARCH_LINEAR);
          runAnimation(generateSearchSteps(arrayData, valInput, size));
      }
  };
  const handleFindMin = () => runAnimation(generateMinMaxSteps(arrayData, size, 'MIN'));
  const handleFindMax = () => runAnimation(generateMinMaxSteps(arrayData, size, 'MAX'));

  const handleInsert = (position: 'HEAD' | 'TAIL' | 'INDEX') => {
      if (size >= MAX_CAPACITY) return alert("Full!");
      
      if (mode === 'SORTED') {
          setActiveCode(arrayCodeSnippets.INSERT_SORTED);
          runAnimation(generateSortedInsertSteps(arrayData, valInput, size, MAX_CAPACITY));
      } else {
          let idx = position === 'HEAD' ? 0 : position === 'TAIL' ? size : idxInput;
          if (idx < 0 || idx > size) return alert("Invalid Index");
          
          if (position === 'HEAD') setActiveCode(arrayCodeSnippets.INSERT_HEAD);
          else if (position === 'TAIL') setActiveCode(arrayCodeSnippets.INSERT_TAIL);
          else setActiveCode(arrayCodeSnippets.INSERT_INDEX);

          runAnimation(generateInsertSteps(arrayData, idx, valInput, size, MAX_CAPACITY));
      }
  };

  const handleRemove = (position: 'HEAD' | 'TAIL' | 'INDEX') => {
      if (size === 0) return alert("Empty!");
      let idx = position === 'HEAD' ? 0 : position === 'TAIL' ? size - 1 : idxInput;
      if (idx < 0 || idx >= size) return alert("Invalid Index");

      if (position === 'TAIL') setActiveCode(arrayCodeSnippets.DELETE_TAIL);
      else setActiveCode(arrayCodeSnippets.DELETE_INDEX);

      runAnimation(generateDeleteSteps(arrayData, idx, size));
  };

  const handleUpdate = () => {
      if (idxInput < 0 || idxInput >= size) return alert("Invalid Index");
      setActiveCode(arrayCodeSnippets.UPDATE);
      runAnimation(generateUpdateSteps(arrayData, idxInput, valInput, size));
  };

  const handleRangeSum = () => {
      if (rangeStart < 0 || rangeEnd >= size || rangeStart > rangeEnd) return alert("Invalid Range");
      setActiveCode(arrayCodeSnippets.RANGE_QUERY);
      runAnimation(generatePrefixSumQuerySteps(arrayData, prefixData, rangeStart, rangeEnd, size));
  };

  const currentMainArr = isAnimating && timeline.length > 0 ? timeline[currentStep].arrayState : arrayData;
  const currentPrefixArr = isAnimating && timeline.length > 0 && timeline[currentStep].secondArrayState 
        ? timeline[currentStep].secondArrayState 
        : prefixData;
  const currentMessage = isAnimating && timeline.length > 0 ? timeline[currentStep].message : "Ready.";

  // Styles
  const btnPrimary = "px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 justify-center";
  const btnSecondary = "px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 rounded font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 justify-center";
  const inputField = "bg-slate-950 border border-slate-700 rounded px-3 py-2 font-mono text-white focus:outline-none focus:border-blue-500 text-center";
  const labelStyle = "text-xs text-slate-500 uppercase font-bold";

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-4 md:p-8 relative font-sans">
      
      <AnimatePresence>{isTheoryOpen && (<motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={()=>setIsTheoryOpen(false)}><motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} className="bg-slate-900 border border-slate-700 p-0 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col" onClick={(e)=>e.stopPropagation()}>
          <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-950"><h2 className="text-2xl font-bold text-white flex items-center gap-2"><BookOpen className="text-blue-400" /> Theory</h2><button onClick={() => setIsTheoryOpen(false)}><X size={24} className="text-slate-400 hover:text-white"/></button></div>
          <div className="p-6 overflow-y-auto custom-scrollbar"><ArrayTheory/></div>
      </motion.div></motion.div>)}</AnimatePresence>

      <div className="w-full max-w-7xl mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white gap-2"><ArrowLeft size={20} /> Dashboard</Link>
        <div className="flex gap-3">
            <button onClick={() => setIsTheoryOpen(true)} className="p-2 bg-slate-800 rounded-full text-blue-400 hover:text-white"><BookOpen size={20}/></button>
        </div>
      </div>

      <div className="w-full max-w-7xl flex overflow-x-auto border-b border-slate-800 mb-0 scrollbar-hide">
          <ModeBtn name="Array (Unsorted)" icon={List} isActive={mode === 'UNSORTED'} onClick={() => switchMode('UNSORTED')} />
          <ModeBtn name="Sorted Array" icon={ListOrdered} isActive={mode === 'SORTED'} onClick={() => switchMode('SORTED')} />
          <ModeBtn name="Range Query" icon={BarChart3} isActive={mode === 'RANGE'} onClick={() => switchMode('RANGE')} />
      </div>

      {/* --- MAIN LAYOUT GRID --- */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* LEFT COLUMN: VISUAL + CONTROL */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            {/* VISUALIZATION BOX */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 relative overflow-hidden flex flex-col items-center min-h-[320px] shadow-xl">
                <div className="w-full flex justify-between text-[10px] font-mono text-slate-500 mb-4 border-b border-slate-800 pb-2 uppercase tracking-wider">
                    <span>Mode: <strong className="text-yellow-400">{mode}</strong></span>
                    <span>Size: <strong className="text-blue-400">{size}</strong>/{MAX_CAPACITY}</span>
                </div>

                <div className="mb-2 text-xs text-slate-400 font-bold uppercase tracking-widest w-full text-center">Original Array A</div>
                <div className="flex items-center justify-center gap-2 flex-wrap py-2">
                    <AnimatePresence mode="popLayout">
                        {currentMainArr.map((node) => (
                            <ArrayBlock key={node.id} node={node} isActive={node.index < size || node.state !== 'DEFAULT'} />
                        ))}
                    </AnimatePresence>
                </div>

                {mode === 'RANGE' && (
                    <>
                        <div className="my-4 w-full border-t border-slate-800/50"></div>
                        <div className="mb-2 text-xs text-blue-400 font-bold uppercase tracking-widest w-full text-center">Prefix Sum Array P</div>
                        <div className="flex items-center justify-center gap-2 flex-wrap py-2">
                            <AnimatePresence mode="popLayout">
                                {currentPrefixArr.map((node: ArrayNode) => (
                                    <ArrayBlock key={node.id} node={node} isActive={node.value !== null} />
                                ))}
                            </AnimatePresence>
                        </div>
                    </>
                )}
            </div>

            {/* STATUS & CONTROL */}
            <div className="flex flex-col gap-4">
                <div className="bg-slate-900 border-l-4 border-blue-500 p-4 rounded-r-xl shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Activity size={18} className="text-blue-400" />
                        <p className="font-mono text-slate-200 text-sm">{currentMessage}</p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="flex bg-slate-950/50 border-b border-slate-800 overflow-x-auto scrollbar-hide">
                        {mode !== 'RANGE' ? (
                            <>
                                <TabBtn name="Create" isActive={activeTab === 'CREATE'} onClick={() => setActiveTab('CREATE')} />
                                <TabBtn name="Search" isActive={activeTab === 'SEARCH'} onClick={() => setActiveTab('SEARCH')} />
                                <TabBtn name="Insert" isActive={activeTab === 'INSERT'} onClick={() => setActiveTab('INSERT')} />
                                <TabBtn name="Remove" isActive={activeTab === 'REMOVE'} onClick={() => setActiveTab('REMOVE')} />
                                <TabBtn name="Update" isActive={activeTab === 'UPDATE'} onClick={() => setActiveTab('UPDATE')} />
                            </>
                        ) : (
                            <>
                                <TabBtn name="Create" isActive={activeTab === 'CREATE'} onClick={() => setActiveTab('CREATE')} />
                                <TabBtn name="Range Sum Query" isActive={activeTab === 'QUERY'} onClick={() => setActiveTab('QUERY')} />
                            </>
                        )}
                    </div>

                    <div className="p-6 min-h-[120px] flex items-center bg-slate-900/50">
                        {/* TAB CONTENTS (Giữ nguyên logic controls) */}
                        {activeTab === 'CREATE' && (
                            <div className="flex flex-wrap gap-4 items-center w-full">
                                <button onClick={handleCreateEmpty} className={btnSecondary}>Empty</button>
                                <button onClick={handleCreateRandom} className={btnSecondary}>Random</button>
                                <div className="h-8 w-px bg-slate-700 mx-2 hidden md:block"></div>
                                <div className="flex gap-2 items-center flex-wrap">
                                    <input type="text" value={userInputArray} onChange={(e) => setUserInputArray(e.target.value)} className={`${inputField} w-48`} placeholder="3, 1, 4..." />
                                    <button onClick={handleCreateUser} className={btnPrimary}>User Defined</button>
                                </div>
                            </div>
                        )}
                        {/* Các tabs Search, Insert, Remove, Update, Query giữ nguyên code cũ... */}
                        {activeTab === 'QUERY' && mode === 'RANGE' && (
                            <div className="flex flex-wrap gap-4 items-center w-full justify-center md:justify-start">
                                <div className="flex gap-2 items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                                    <label className={labelStyle}>Start i =</label>
                                    <input type="number" value={rangeStart} onChange={(e) => setRangeStart(Number(e.target.value))} className={`${inputField} w-16`} />
                                </div>
                                <div className="flex gap-2 items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                                    <label className={labelStyle}>End j =</label>
                                    <input type="number" value={rangeEnd} onChange={(e) => setRangeEnd(Number(e.target.value))} className={`${inputField} w-16`} />
                                </div>
                                <button onClick={handleRangeSum} disabled={isAnimating} className={btnPrimary}>
                                    <Calculator size={16} /> Range Sum O(1)
                                </button>
                            </div>
                        )}
                        {activeTab === 'SEARCH' && mode !== 'RANGE' && (
                            <div className="flex flex-wrap gap-4 items-center w-full justify-center md:justify-start">
                                <div className="flex gap-2 items-center">
                                    <label className={labelStyle}>Value v =</label>
                                    <input type="number" value={valInput} onChange={(e) => setValInput(Number(e.target.value))} className={`${inputField} w-20`} />
                                    <button onClick={handleSearch} disabled={isAnimating} className={btnPrimary}>Go</button>
                                </div>
                                <div className="h-8 w-px bg-slate-700 mx-2 hidden md:block"></div>
                                <button onClick={handleFindMin} disabled={isAnimating} className={btnSecondary}><Minimize2 size={16}/> Min</button>
                                <button onClick={handleFindMax} disabled={isAnimating} className={btnSecondary}><Maximize2 size={16}/> Max</button>
                            </div>
                        )}
                        {activeTab === 'INSERT' && mode !== 'RANGE' && (
                            <div className="flex flex-wrap gap-4 items-center w-full justify-center md:justify-start">
                                <div className="flex gap-2 items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                                    <label className={labelStyle}>Value v =</label>
                                    <input type="number" value={valInput} onChange={(e) => setValInput(Number(e.target.value))} className={`${inputField} w-20`} />
                                </div>
                                {mode === 'UNSORTED' ? (<><button onClick={() => handleInsert('HEAD')} disabled={isAnimating} className={btnSecondary}>Head</button><button onClick={() => handleInsert('TAIL')} disabled={isAnimating} className={btnSecondary}>Tail</button><div className="flex gap-2 items-center p-2 bg-slate-950 rounded-lg border border-slate-800"><label className={labelStyle}>Index i =</label><input type="number" value={idxInput} onChange={(e) => setIdxInput(Number(e.target.value))} className={`${inputField} w-16`} /><button onClick={() => handleInsert('INDEX')} disabled={isAnimating} className={btnPrimary}>Insert at i</button></div></>) : (<button onClick={() => handleInsert('HEAD')} disabled={isAnimating} className={btnPrimary}>Sorted Insert (Auto)</button>)}
                            </div>
                        )}
                        {activeTab === 'REMOVE' && mode !== 'RANGE' && (
                            <div className="flex flex-wrap gap-4 items-center w-full justify-center md:justify-start">
                                <button onClick={() => handleRemove('HEAD')} disabled={isAnimating} className={`${btnSecondary} text-red-400 border-red-900/30`}>Head</button>
                                <button onClick={() => handleRemove('TAIL')} disabled={isAnimating} className={`${btnSecondary} text-red-400 border-red-900/30`}>Tail</button>
                                <div className="flex gap-2 items-center p-2 bg-slate-950 rounded-lg border border-slate-800"><label className={labelStyle}>Index i =</label><input type="number" value={idxInput} onChange={(e) => setIdxInput(Number(e.target.value))} className={`${inputField} w-16`} /><button onClick={() => handleRemove('INDEX')} disabled={isAnimating} className={`${btnPrimary} bg-red-600 hover:bg-red-500`}>Remove at i</button></div>
                            </div>
                        )}
                        {activeTab === 'UPDATE' && mode !== 'RANGE' && (
                            <div className="flex flex-wrap gap-4 items-center w-full justify-center md:justify-start">
                                {mode === 'SORTED' ? (<p className="text-yellow-500 italic">Update restricted in Sorted Mode.</p>) : (<><div className="flex gap-2 items-center p-2 bg-slate-950 rounded-lg border border-slate-800"><label className={labelStyle}>Index i =</label><input type="number" value={idxInput} onChange={(e) => setIdxInput(Number(e.target.value))} className={`${inputField} w-16`} /></div><div className="flex gap-2 items-center p-2 bg-slate-950 rounded-lg border border-slate-800"><label className={labelStyle}>Value v =</label><input type="number" value={valInput} onChange={(e) => setValInput(Number(e.target.value))} className={`${inputField} w-20`} /></div><button onClick={handleUpdate} disabled={isAnimating} className={btnPrimary}><Edit3 size={16} /> Update (O(1))</button></>)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: CODE SNIPPET */}
        <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl sticky top-6">
                <div className="flex items-center gap-2 p-4 border-b border-slate-800 bg-slate-950">
                    <Code2 size={18} className="text-purple-400" />
                    <span className="font-bold text-slate-200">Pseudocode</span>
                </div>
                <div className="p-4 bg-[#1e1e1e] overflow-x-auto min-h-[400px] font-mono text-xs md:text-sm">
                    {/* LOGIC HIGHLIGHTING */}
                    {activeCode ? (
                        <table className="w-full border-collapse">
                            <tbody>
                                {activeCode.split('\n').map((line, i) => {
                                    // Lấy dòng code hiện tại từ timeline
                                    const currentLineNumber = timeline[currentStep]?.codeLine;
                                    // So sánh (i + 1 vì codeLine mình tính từ 1)
                                    const isActive = currentLineNumber === i + 1;
                                    
                                    return (
                                        <tr key={i} className={`${isActive ? 'bg-yellow-500/20' : ''} transition-colors duration-200`}>
                                            <td className="w-8 text-right pr-3 text-slate-600 select-none border-r border-slate-700/50 align-top">
                                                {i + 1}
                                            </td>
                                            <td className={`pl-3 align-top whitespace-pre-wrap ${isActive ? 'text-yellow-100 font-bold' : 'text-green-400'}`}>
                                                {line}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-slate-500 italic p-2">// Select an action to see code...</div>
                    )}
                </div>
            </div>
        </div>

      </div>
    </main>
  );
}