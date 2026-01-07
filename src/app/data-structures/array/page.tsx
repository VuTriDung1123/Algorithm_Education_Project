"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Maximize2, Minimize2, Edit3, ArrowLeft, BookOpen, X, 
  Volume2, VolumeX, Share2, Info, Activity,
  List, ListOrdered, BarChart3
} from "lucide-react";
import Link from "next/link";
import ArrayBlock from "@/components/Visualization/Array/ArrayBlock";
import { ArrayNode, DSAnimationStep } from "@/lib/data-structures/types"; 
import { 
    createEmptyArray, createArrayFromInput,
    generateInsertSteps, generateDeleteSteps, 
    generateSearchSteps, generateMinMaxSteps, generateUpdateSteps,
    generateSortedInsertSteps, generateBinarySearchSteps
} from "@/lib/data-structures/arrayLogic";

const MAX_CAPACITY = 12;

// --- THEORY CONTENT (Rút gọn cho code ngắn) ---
const ArrayTheory = () => ( <div className="text-slate-300">...Nội dung lý thuyết...</div> );

// --- COMPONENTS ---
const ModeBtn = ({ name, icon: Icon, isActive, onClick }: any) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-t-lg font-bold text-sm transition-all border-t border-l border-r ${isActive ? 'bg-slate-900 border-slate-700 text-blue-400 translate-y-[1px]' : 'bg-slate-950 border-transparent text-slate-500 hover:text-slate-300'}`}>
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
  // --- STATE ---
  const [arrayData, setArrayData] = useState<ArrayNode[]>(() => createEmptyArray(MAX_CAPACITY));
  const [size, setSize] = useState(0); 
  const [timeline, setTimeline] = useState<DSAnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // New State: Mode
  const [mode, setMode] = useState<'UNSORTED' | 'SORTED' | 'RANGE'>('UNSORTED');
  const [activeTab, setActiveTab] = useState<'CREATE' | 'SEARCH' | 'INSERT' | 'REMOVE' | 'UPDATE'>('INSERT');
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);

  // Inputs
  const [valInput, setValInput] = useState(50);
  const [idxInput, setIdxInput] = useState(0);
  const [userInputArray, setUserInputArray] = useState("10, 20, 30"); 

  // --- HELPERS ---
  const resetWithData = useCallback((input: number[], forceSort = false) => {
      let validData = input.slice(0, MAX_CAPACITY);
      if (forceSort || mode === 'SORTED') {
          validData.sort((a, b) => a - b);
      }
      setArrayData(createArrayFromInput(validData, MAX_CAPACITY));
      setSize(validData.length);
      setTimeline([]);
      setCurrentStep(0);
      setIsAnimating(false);
  }, [mode]);

  // Handle Mode Switch
  const switchMode = (newMode: 'UNSORTED' | 'SORTED' | 'RANGE') => {
      setMode(newMode);
      setTimeline([]);
      setCurrentStep(0);
      setIsAnimating(false);
      
      // Nếu chuyển sang Sorted, phải sort mảng hiện tại
      if (newMode === 'SORTED') {
          const currentValues = arrayData.slice(0, size).map(n => n.value!).sort((a, b) => a - b);
          resetWithData(currentValues, true);
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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAnimating && currentStep < timeline.length - 1) {
        timer = setTimeout(() => setCurrentStep(p => p + 1), 600); 
    } else if (isAnimating && currentStep === timeline.length - 1) {
        const timeoutId = setTimeout(() => {
            setIsAnimating(false);
            const finalState = timeline[timeline.length - 1].arrayState;
            const newSize = finalState.filter((n: ArrayNode) => n.value !== null).length;
            setArrayData(finalState);
            setSize(newSize);
        }, 500);
        return () => clearTimeout(timeoutId);
    }
    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, timeline]);

  // --- HANDLERS ---
  const handleCreateEmpty = () => resetWithData([]);
  const handleCreateRandom = () => {
      const len = Math.floor(Math.random() * (MAX_CAPACITY - 3)) + 3;
      const arr = Array.from({length: len}, () => Math.floor(Math.random() * 99) + 1);
      resetWithData(arr);
  };
  const handleCreateUser = () => {
      const arr = userInputArray.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      resetWithData(arr);
  };

  const handleSearch = () => {
      if (mode === 'SORTED') {
          runAnimation(generateBinarySearchSteps(arrayData, valInput, size));
      } else {
          runAnimation(generateSearchSteps(arrayData, valInput, size));
      }
  };
  const handleFindMin = () => runAnimation(generateMinMaxSteps(arrayData, size, 'MIN'));
  const handleFindMax = () => runAnimation(generateMinMaxSteps(arrayData, size, 'MAX'));

  const handleInsert = (position: 'HEAD' | 'TAIL' | 'INDEX') => {
      if (size >= MAX_CAPACITY) return alert("Full!");
      
      if (mode === 'SORTED') {
          // Sorted Mode: Luôn tự tìm vị trí (không quan tâm Index input)
          runAnimation(generateSortedInsertSteps(arrayData, valInput, size, MAX_CAPACITY));
      } else {
          // Unsorted Mode
          let idx = position === 'HEAD' ? 0 : position === 'TAIL' ? size : idxInput;
          if (idx < 0 || idx > size) return alert("Invalid Index");
          runAnimation(generateInsertSteps(arrayData, idx, valInput, size, MAX_CAPACITY));
      }
  };

  const handleRemove = (position: 'HEAD' | 'TAIL' | 'INDEX') => {
      if (size === 0) return alert("Empty!");
      let idx = position === 'HEAD' ? 0 : position === 'TAIL' ? size - 1 : idxInput;
      if (idx < 0 || idx >= size) return alert("Invalid Index");
      runAnimation(generateDeleteSteps(arrayData, idx, size));
  };

  const handleUpdate = () => {
      if (idxInput < 0 || idxInput >= size) return alert("Invalid Index");
      runAnimation(generateUpdateSteps(arrayData, idxInput, valInput, size));
      // Note: Update in Sorted Array might break sorting order. VisuAlgo usually disables update in Sorted mode or re-sorts.
      // For simplicity here, we allow it but it might break Binary Search. Ideally, disable it.
  };

  const currentData = isAnimating && timeline.length > 0 ? timeline[currentStep].arrayState : arrayData;
  const currentMessage = isAnimating && timeline.length > 0 ? timeline[currentStep].message : "Ready.";

  // Styles
  const btnPrimary = "px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 justify-center";
  const btnSecondary = "px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 rounded font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 justify-center";
  const inputField = "bg-slate-950 border border-slate-700 rounded px-3 py-2 font-mono text-white focus:outline-none focus:border-blue-500 text-center";
  const labelStyle = "text-xs text-slate-500 uppercase font-bold";

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-4 md:p-8 relative">
      
      {/* THEORY MODAL (Giữ nguyên) */}
      <AnimatePresence>{isTheoryOpen && (<motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={()=>setIsTheoryOpen(false)}><div className="bg-slate-900 p-6 rounded-2xl w-full max-w-2xl"><ArrayTheory/></div></motion.div>)}</AnimatePresence>

      {/* TOP NAV */}
      <div className="w-full max-w-5xl mb-6 flex justify-between items-center">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white gap-2"><ArrowLeft size={20} /> Dashboard</Link>
        <div className="flex gap-3">
            <button onClick={() => setIsTheoryOpen(true)} className="p-2 bg-slate-800 rounded-full text-blue-400 hover:text-white"><BookOpen size={20}/></button>
        </div>
      </div>

      {/* --- MODE SWITCHER (NEW) --- */}
      <div className="w-full max-w-5xl flex gap-1 border-b border-slate-800 mb-0">
          <ModeBtn name="Array (Unsorted)" icon={List} isActive={mode === 'UNSORTED'} onClick={() => switchMode('UNSORTED')} />
          <ModeBtn name="Sorted Array" icon={ListOrdered} isActive={mode === 'SORTED'} onClick={() => switchMode('SORTED')} />
          {/* <ModeBtn name="Range Queries" icon={BarChart3} isActive={mode === 'RANGE'} onClick={() => switchMode('RANGE')} /> */}
      </div>

      {/* VISUALIZATION BOX */}
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 border-t-0 rounded-b-xl rounded-tr-xl p-8 mb-6 relative overflow-hidden flex flex-col items-center min-h-[280px] shadow-xl">
         <div className="w-full flex justify-between text-[10px] font-mono text-slate-500 mb-8 border-b border-slate-800 pb-2 uppercase tracking-wider">
             <span>Mode: <strong className="text-yellow-400">{mode}</strong></span>
             <span>Size: <strong className="text-blue-400">{size}</strong>/{MAX_CAPACITY}</span>
         </div>
         <div className="flex items-center justify-center gap-2 flex-wrap py-4">
             <AnimatePresence mode="popLayout">
                {currentData.map((node) => (
                    <ArrayBlock key={node.id} node={node} isActive={node.index < size || node.state !== 'DEFAULT'} />
                ))}
             </AnimatePresence>
         </div>
      </div>

      {/* STATUS BAR */}
      <div className="w-full max-w-5xl bg-slate-900 border-l-4 border-blue-500 p-4 mb-6 rounded-r-xl shadow-lg flex items-center">
          <span className="font-mono text-blue-400 mr-3">$</span>
          <p className="font-mono text-slate-200 text-sm">{currentMessage}</p>
      </div>

      {/* CONTROL PANEL */}
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex bg-slate-950/50 border-b border-slate-800 overflow-x-auto scrollbar-hide">
              {['CREATE', 'SEARCH', 'INSERT', 'REMOVE', 'UPDATE'].map(t => (
                  <TabBtn key={t} name={t} isActive={activeTab === t} onClick={() => setActiveTab(t as any)} />
              ))}
          </div>

          <div className="p-6 min-h-[120px] flex items-center bg-slate-900/50">
              
              {activeTab === 'CREATE' && (
                  <div className="flex flex-wrap gap-4 items-center w-full">
                      <button onClick={handleCreateEmpty} className={btnSecondary}>Empty</button>
                      <button onClick={handleCreateRandom} className={btnSecondary}>Random {mode === 'SORTED' && '(Sorted)'}</button>
                      <div className="flex gap-2 items-center border-l border-slate-700 pl-4">
                          <input type="text" value={userInputArray} onChange={(e) => setUserInputArray(e.target.value)} className={`${inputField} w-48`} placeholder="10, 20, 30" />
                          <button onClick={handleCreateUser} className={btnPrimary}>User Defined</button>
                      </div>
                  </div>
              )}

              {activeTab === 'SEARCH' && (
                  <div className="flex flex-wrap gap-4 items-center w-full justify-center md:justify-start">
                      <div className="flex gap-2 items-center">
                          <label className={labelStyle}>Value v =</label>
                          <input type="number" value={valInput} onChange={(e) => setValInput(Number(e.target.value))} className={`${inputField} w-20`} />
                          <button onClick={handleSearch} disabled={isAnimating} className={btnPrimary}>
                              {mode === 'SORTED' ? 'Binary Search (O(log N))' : 'Linear Search (O(N))'}
                          </button>
                      </div>
                      <div className="h-8 w-px bg-slate-700 mx-2 hidden md:block"></div>
                      <button onClick={handleFindMin} disabled={isAnimating} className={btnSecondary}><Minimize2 size={16}/> Min</button>
                      <button onClick={handleFindMax} disabled={isAnimating} className={btnSecondary}><Maximize2 size={16}/> Max</button>
                  </div>
              )}

              {activeTab === 'INSERT' && (
                  <div className="flex flex-wrap gap-4 items-center w-full justify-center md:justify-start">
                      <div className="flex gap-2 items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                          <label className={labelStyle}>Value v =</label>
                          <input type="number" value={valInput} onChange={(e) => setValInput(Number(e.target.value))} className={`${inputField} w-20`} />
                      </div>
                      {mode === 'UNSORTED' ? (
                          <>
                            <button onClick={() => handleInsert('HEAD')} disabled={isAnimating} className={btnSecondary}>Head</button>
                            <button onClick={() => handleInsert('TAIL')} disabled={isAnimating} className={btnSecondary}>Tail</button>
                            <div className="flex gap-2 items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                                <label className={labelStyle}>Index i =</label>
                                <input type="number" value={idxInput} onChange={(e) => setIdxInput(Number(e.target.value))} className={`${inputField} w-16`} />
                                <button onClick={() => handleInsert('INDEX')} disabled={isAnimating} className={btnPrimary}>Insert at i</button>
                            </div>
                          </>
                      ) : (
                          <button onClick={() => handleInsert('HEAD')} disabled={isAnimating} className={btnPrimary}>
                              Sorted Insert (Auto-find position)
                          </button>
                      )}
                  </div>
              )}

              {activeTab === 'REMOVE' && (
                  <div className="flex flex-wrap gap-4 items-center w-full justify-center md:justify-start">
                      <button onClick={() => handleRemove('HEAD')} disabled={isAnimating} className={`${btnSecondary} text-red-400 border-red-900/30`}>Remove Head</button>
                      <button onClick={() => handleRemove('TAIL')} disabled={isAnimating} className={`${btnSecondary} text-red-400 border-red-900/30`}>Remove Tail</button>
                      <div className="flex gap-2 items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                          <label className={labelStyle}>Index i =</label>
                          <input type="number" value={idxInput} onChange={(e) => setIdxInput(Number(e.target.value))} className={`${inputField} w-16`} />
                          <button onClick={() => handleRemove('INDEX')} disabled={isAnimating} className={`${btnPrimary} bg-red-600 hover:bg-red-500`}>Remove at i</button>
                      </div>
                  </div>
              )}

              {activeTab === 'UPDATE' && (
                  <div className="flex flex-wrap gap-4 items-center w-full justify-center md:justify-start">
                      {mode === 'SORTED' ? (
                          <p className="text-yellow-500 italic">Update is restricted in Sorted Mode to maintain order.</p>
                      ) : (
                          <>
                            <div className="flex gap-2 items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                                <label className={labelStyle}>Index i =</label>
                                <input type="number" value={idxInput} onChange={(e) => setIdxInput(Number(e.target.value))} className={`${inputField} w-16`} />
                            </div>
                            <div className="flex gap-2 items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                                <label className={labelStyle}>Value v =</label>
                                <input type="number" value={valInput} onChange={(e) => setValInput(Number(e.target.value))} className={`${inputField} w-20`} />
                            </div>
                            <button onClick={handleUpdate} disabled={isAnimating} className={btnPrimary}><Edit3 size={16} /> Update (O(1))</button>
                          </>
                      )}
                  </div>
              )}
          </div>
      </div>
    </main>
  );
}