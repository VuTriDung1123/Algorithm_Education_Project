"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Maximize2, Minimize2, Edit3, ArrowLeft, BookOpen, X, 
  Volume2, VolumeX, Share2, Info, Activity 
} from "lucide-react";
import Link from "next/link";
import ArrayBlock from "@/components/Visualization/Array/ArrayBlock";
import { ArrayNode, DSAnimationStep } from "@/lib/data-structures/types"; 
import { 
    createEmptyArray, createArrayFromInput,
    generateInsertSteps, generateDeleteSteps, 
    generateSearchSteps, generateMinMaxSteps, generateUpdateSteps 
} from "@/lib/data-structures/arrayLogic";

const MAX_CAPACITY = 12;

// --- THEORY CONTENT ---
const ArrayTheory = () => (
  <div className="space-y-6 text-slate-300 leading-relaxed">
    <div>
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Info size={20} className="text-blue-400" /> 1. Mảng (Array) là gì?
        </h3>
        <p>
            Mảng là một cấu trúc dữ liệu lưu trữ một tập hợp các phần tử có cùng kiểu dữ liệu trong một khối bộ nhớ **liền kề (contiguous memory)**. Mỗi phần tử có thể được truy cập trực tiếp thông qua chỉ số (index).
        </p>
    </div>
    <div>
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Activity size={20} className="text-yellow-400" /> 2. Đặc điểm chính
        </h3>
        <ul className="list-disc pl-5 space-y-2 marker:text-yellow-500">
            <li><strong>Truy cập ngẫu nhiên (Random Access):</strong> Truy cập phần tử bất kỳ cực nhanh với độ phức tạp O(1) nhờ chỉ số.</li>
            <li><strong>Kích thước cố định (Static Size):</strong> Thông thường, kích thước mảng phải được xác định khi khởi tạo và khó thay đổi (trừ Dynamic Array).</li>
            <li><strong>Chèn/Xóa tốn kém:</strong> Chèn hoặc xóa phần tử ở giữa mảng đòi hỏi phải dịch chuyển các phần tử phía sau, tốn O(N) thời gian.</li>
        </ul>
    </div>
    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
        <h3 className="text-white font-bold mb-2">Độ phức tạp (Complexity)</h3>
        <div className="grid grid-cols-2 gap-2 text-sm font-mono">
            <div>Access (Truy cập):</div><div className="text-green-400">O(1)</div>
            <div>Update (Cập nhật):</div><div className="text-green-400">O(1)</div>
            <div>Search (Tìm kiếm):</div><div className="text-yellow-400">O(N)</div>
            <div>Insert/Delete (Tail):</div><div className="text-green-400">O(1)</div>
            <div>Insert/Delete (Middle):</div><div className="text-red-400">O(N)</div>
        </div>
    </div>
  </div>
);

// --- TAB BUTTON COMPONENT (Styled) ---
const TabBtn = ({ name, isActive, onClick }: { name: string, isActive: boolean, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`flex-1 px-4 py-3 font-bold text-sm transition-all border-b-2 whitespace-nowrap 
        ${isActive 
            ? 'border-blue-500 text-blue-400 bg-slate-900/50' 
            : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/20'
        }`}
    >
        {name}
    </button>
);

// --- MAIN PAGE COMPONENT ---
export default function ArrayPage() {
    return (
        <Suspense fallback={<div className="text-white text-center p-10">Loading...</div>}>
            <ArrayVisualizer />
        </Suspense>
    );
}

function ArrayVisualizer() {
  const [arrayData, setArrayData] = useState<ArrayNode[]>(() => createEmptyArray(MAX_CAPACITY));
  const [size, setSize] = useState(0); 
  const [timeline, setTimeline] = useState<DSAnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // UI States
  const [activeTab, setActiveTab] = useState<'CREATE' | 'SEARCH' | 'INSERT' | 'REMOVE' | 'UPDATE'>('INSERT');
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Placeholder cho đồng bộ UI

  // Inputs
  const [valInput, setValInput] = useState(50);
  const [idxInput, setIdxInput] = useState(0);
  const [userInputArray, setUserInputArray] = useState("10, 20, 30"); 

  // --- Helpers ---
  const resetWithData = useCallback((input: number[]) => {
      const validData = input.slice(0, MAX_CAPACITY);
      setArrayData(createArrayFromInput(validData, MAX_CAPACITY));
      setSize(validData.length);
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

  // Animation Loop
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

  // --- Handlers (Giữ nguyên logic cũ) ---
  // 1. CREATE
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
  // 2. SEARCH
  const handleSearch = () => runAnimation(generateSearchSteps(arrayData, valInput, size));
  const handleFindMin = () => runAnimation(generateMinMaxSteps(arrayData, size, 'MIN'));
  const handleFindMax = () => runAnimation(generateMinMaxSteps(arrayData, size, 'MAX'));
  // 3. INSERT
  const handleInsertHead = () => {
      if (size >= MAX_CAPACITY) return alert("Full!");
      runAnimation(generateInsertSteps(arrayData, 0, valInput, size, MAX_CAPACITY));
  };
  const handleInsertTail = () => {
      if (size >= MAX_CAPACITY) return alert("Full!");
      runAnimation(generateInsertSteps(arrayData, size, valInput, size, MAX_CAPACITY));
  };
  const handleInsertIndex = () => {
      if (size >= MAX_CAPACITY) return alert("Full!");
      if (idxInput < 0 || idxInput > size) return alert("Invalid Index");
      runAnimation(generateInsertSteps(arrayData, idxInput, valInput, size, MAX_CAPACITY));
  };
  // 4. REMOVE
  const handleRemoveHead = () => {
      if (size === 0) return alert("Empty!");
      runAnimation(generateDeleteSteps(arrayData, 0, size));
  };
  const handleRemoveTail = () => {
      if (size === 0) return alert("Empty!");
      runAnimation(generateDeleteSteps(arrayData, size - 1, size));
  };
  const handleRemoveIndex = () => {
      if (size === 0) return alert("Empty!");
      if (idxInput < 0 || idxInput >= size) return alert("Invalid Index");
      runAnimation(generateDeleteSteps(arrayData, idxInput, size));
  };
  // 5. UPDATE
  const handleUpdate = () => {
      if (idxInput < 0 || idxInput >= size) return alert("Invalid Index");
      runAnimation(generateUpdateSteps(arrayData, idxInput, valInput, size));
  };

  // State Display
  const currentData = isAnimating && timeline.length > 0 ? timeline[currentStep].arrayState : arrayData;
  const currentMessage = isAnimating && timeline.length > 0 ? timeline[currentStep].message : "Ready for operations.";

  // CSS Classes (Tailwind utilities)
  const btnPrimary = "px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 justify-center";
  const btnSecondary = "px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 rounded font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 justify-center";
  const inputField = "bg-slate-950 border border-slate-700 rounded px-3 py-2 font-mono text-white focus:outline-none focus:border-blue-500 text-center";
  const labelStyle = "text-xs text-slate-500 uppercase font-bold";

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-4 md:p-8 relative">
      
      {/* --- THEORY MODAL --- */}
      <AnimatePresence>
        {isTheoryOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setIsTheoryOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="bg-slate-900 border border-slate-700 w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-950">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="text-blue-400" /> Theory: Array
                </h2>
                <button onClick={() => setIsTheoryOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <ArrayTheory />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- TOP NAVIGATION --- */}
      <div className="w-full max-w-5xl mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white gap-2 transition-colors">
          <ArrowLeft size={20} /> Dashboard
        </Link>
        <div className="flex items-center gap-3">
          {/* Placeholder buttons for UI consistency */}
          <button onClick={() => setIsMuted(!isMuted)} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* --- HEADER & THEORY BTN --- */}
      <div className="flex justify-between items-center w-full max-w-5xl mb-8">
          <button onClick={() => setIsTheoryOpen(true)} className="group flex items-center gap-3 text-3xl font-extrabold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Array Visualization 
            <BookOpen className="text-slate-500 group-hover:text-blue-400 transition-colors" size={24} />
          </button>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="w-full max-w-5xl flex flex-col gap-6">
        
        {/* 1. VISUALIZATION BOX */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden flex flex-col items-center min-h-[280px] shadow-xl">
            <div className="w-full flex justify-between text-[10px] font-mono text-slate-500 mb-8 border-b border-slate-800 pb-2 uppercase tracking-wider">
                <span>Capacity: {MAX_CAPACITY}</span>
                <span>Size: <strong className="text-blue-400 text-sm">{size}</strong></span>
            </div>

            <div className="flex items-center justify-center gap-2 flex-wrap py-4">
                <AnimatePresence mode="popLayout">
                    {currentData.map((node) => (
                        <ArrayBlock key={node.id} node={node} isActive={node.index < size || node.state !== 'DEFAULT'} />
                    ))}
                </AnimatePresence>
            </div>

            <div className="absolute bottom-3 left-4 text-[10px] text-slate-600 italic">
                *Contiguous Memory Allocation Simulation
            </div>
        </div>

        {/* 2. STATUS BAR */}
        <div className="bg-slate-900 border-l-4 border-blue-500 p-4 rounded-r-xl shadow-lg flex items-center">
            <span className="font-mono text-blue-400 mr-3">$</span>
            <p className="font-mono text-slate-200 text-sm">{currentMessage}</p>
        </div>

        {/* 3. CONTROL PANEL (TABS) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Tab Headers */}
            <div className="flex bg-slate-950/50 border-b border-slate-800 overflow-x-auto scrollbar-hide">
                <TabBtn name="Create" isActive={activeTab === 'CREATE'} onClick={() => setActiveTab('CREATE')} />
                <TabBtn name="Search" isActive={activeTab === 'SEARCH'} onClick={() => setActiveTab('SEARCH')} />
                <TabBtn name="Insert" isActive={activeTab === 'INSERT'} onClick={() => setActiveTab('INSERT')} />
                <TabBtn name="Remove" isActive={activeTab === 'REMOVE'} onClick={() => setActiveTab('REMOVE')} />
                <TabBtn name="Update" isActive={activeTab === 'UPDATE'} onClick={() => setActiveTab('UPDATE')} />
            </div>

            {/* Tab Content */}
            <div className="p-6 min-h-[120px] flex items-center bg-slate-900/50">
                
                {activeTab === 'CREATE' && (
                    <div className="flex flex-wrap gap-4 items-center w-full">
                        <button onClick={handleCreateEmpty} className={btnSecondary}>Empty</button>
                        <button onClick={handleCreateRandom} className={btnSecondary}>Random</button>
                        <div className="h-8 w-px bg-slate-700 mx-2 hidden md:block"></div>
                        <div className="flex gap-2 items-center flex-wrap">
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
                            <button onClick={handleSearch} disabled={isAnimating} className={btnPrimary}>Go (O(N))</button>
                        </div>
                        <div className="h-8 w-px bg-slate-700 mx-2 hidden md:block"></div>
                        <button onClick={handleFindMin} disabled={isAnimating} className={btnSecondary}><Minimize2 size={16}/> Min (O(N))</button>
                        <button onClick={handleFindMax} disabled={isAnimating} className={btnSecondary}><Maximize2 size={16}/> Max (O(N))</button>
                    </div>
                )}

                {activeTab === 'INSERT' && (
                    <div className="flex flex-wrap gap-4 items-center w-full justify-center md:justify-start">
                        <div className="flex gap-2 items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                            <label className={labelStyle}>Value v =</label>
                            <input type="number" value={valInput} onChange={(e) => setValInput(Number(e.target.value))} className={`${inputField} w-20`} />
                        </div>
                        <button onClick={handleInsertHead} disabled={isAnimating} className={btnSecondary}>Head (O(N))</button>
                        <button onClick={handleInsertTail} disabled={isAnimating} className={btnSecondary}>Tail (O(1))</button>
                        <div className="h-8 w-px bg-slate-700 mx-2 hidden md:block"></div>
                        <div className="flex gap-2 items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                            <label className={labelStyle}>Index i =</label>
                            <input type="number" value={idxInput} onChange={(e) => setIdxInput(Number(e.target.value))} className={`${inputField} w-16`} />
                            <button onClick={handleInsertIndex} disabled={isAnimating} className={btnPrimary}>Insert at i</button>
                        </div>
                    </div>
                )}

                {activeTab === 'REMOVE' && (
                    <div className="flex flex-wrap gap-4 items-center w-full justify-center md:justify-start">
                        <button onClick={handleRemoveHead} disabled={isAnimating} className={`${btnSecondary} text-red-400 border-red-900/30 hover:bg-red-950/50 hover:border-red-700`}>Remove Head (O(N))</button>
                        <button onClick={handleRemoveTail} disabled={isAnimating} className={`${btnSecondary} text-red-400 border-red-900/30 hover:bg-red-950/50 hover:border-red-700`}>Remove Tail (O(1))</button>
                        <div className="h-8 w-px bg-slate-700 mx-2 hidden md:block"></div>
                        <div className="flex gap-2 items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                            <label className={labelStyle}>Index i =</label>
                            <input type="number" value={idxInput} onChange={(e) => setIdxInput(Number(e.target.value))} className={`${inputField} w-16`} />
                            <button onClick={handleRemoveIndex} disabled={isAnimating} className={`${btnPrimary} bg-red-600 hover:bg-red-500`}>Remove at i</button>
                        </div>
                    </div>
                )}

                {activeTab === 'UPDATE' && (
                    <div className="flex flex-wrap gap-4 items-center w-full justify-center md:justify-start">
                         <div className="flex gap-2 items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                            <label className={labelStyle}>Index i =</label>
                            <input type="number" value={idxInput} onChange={(e) => setIdxInput(Number(e.target.value))} className={`${inputField} w-16`} />
                        </div>
                        <div className="flex gap-2 items-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                            <label className={labelStyle}>Value v =</label>
                            <input type="number" value={valInput} onChange={(e) => setValInput(Number(e.target.value))} className={`${inputField} w-20`} />
                        </div>
                        <button onClick={handleUpdate} disabled={isAnimating} className={btnPrimary}><Edit3 size={16} /> Update (O(1))</button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </main>
  );
}