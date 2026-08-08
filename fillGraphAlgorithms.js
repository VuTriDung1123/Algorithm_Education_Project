const fs = require('fs');

// BELLMAN-FORD
const bellmanFordCode = `export const bellmanFordSnippets = {
  javascript: \`function bellmanFord(nodes, edges, startNode) {
  let distances = {};
  for (let n of nodes) distances[n] = Infinity;
  distances[startNode] = 0;

  for (let i = 0; i < nodes.length - 1; i++) {
    for (let {u, v, w} of edges) {
      if (distances[u] !== Infinity && distances[u] + w < distances[v]) {
        distances[v] = distances[u] + w;
      }
    }
  }

  // Check negative cycle
  for (let {u, v, w} of edges) {
    if (distances[u] !== Infinity && distances[u] + w < distances[v]) {
      return "Negative Cycle Detected";
    }
  }
  return distances;
}\`
};`;

const bellmanFordLogic = `import { GraphStateData, DSAnimationStep } from '../data-structures/types';

export const createBellmanFordGraph = (): GraphStateData => {
    return {
        nodes: [
            { id: 'S', value: 'S', x: 10, y: 50, state: 'DEFAULT' },
            { id: 'A', value: 'A', x: 40, y: 20, state: 'DEFAULT' },
            { id: 'B', value: 'B', x: 40, y: 80, state: 'DEFAULT' },
            { id: 'C', value: 'C', x: 70, y: 20, state: 'DEFAULT' },
            { id: 'D', value: 'D', x: 70, y: 80, state: 'DEFAULT' },
        ],
        edges: [
            { id: 'e1', source: 'S', target: 'A', weight: 6, state: 'DEFAULT', isDirected: true },
            { id: 'e2', source: 'S', target: 'B', weight: 7, state: 'DEFAULT', isDirected: true },
            { id: 'e3', source: 'A', target: 'C', weight: 5, state: 'DEFAULT', isDirected: true },
            { id: 'e4', source: 'A', target: 'D', weight: -4, state: 'DEFAULT', isDirected: true },
            { id: 'e5', source: 'A', target: 'B', weight: 8, state: 'DEFAULT', isDirected: true },
            { id: 'e6', source: 'B', target: 'C', weight: -3, state: 'DEFAULT', isDirected: true },
            { id: 'e7', source: 'B', target: 'D', weight: 9, state: 'DEFAULT', isDirected: true },
            { id: 'e8', source: 'C', target: 'A', weight: -2, state: 'DEFAULT', isDirected: true },
            { id: 'e9', source: 'C', target: 'D', weight: 7, state: 'DEFAULT', isDirected: true },
        ]
    };
};

export function* generateBellmanFord(startNodeId: string): Generator<DSAnimationStep> {
    const graph = createBellmanFordGraph();
    const distances: Record<string, number> = {};
    for (const node of graph.nodes) distances[node.id] = Infinity;
    
    distances[startNodeId] = 0;
    
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: \`Khởi tạo khoảng cách, \${startNodeId} = 0, các đỉnh khác = ∞\`, codeLine: 3, auxiliary: { distances: { ...distances } } };
    
    for (let i = 0; i < graph.nodes.length - 1; i++) {
        yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: \`Lặp lần \${i + 1} (Tối đa V-1 = \${graph.nodes.length - 1} lần)\`, codeLine: 7, auxiliary: { distances: { ...distances } } };
        
        for (const edge of graph.edges) {
            const edgeIdx = graph.edges.findIndex(e => e.id === edge.id);
            const uIdx = graph.nodes.findIndex(n => n.id === edge.source);
            const vIdx = graph.nodes.findIndex(n => n.id === edge.target);
            
            graph.edges[edgeIdx].state = 'ACCESS';
            graph.nodes[uIdx].state = 'SELECTED';
            graph.nodes[vIdx].state = 'SELECTED';
            yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: \`Xét cạnh \${edge.source} -> \${edge.target} (Trọng số: \${edge.weight})\`, codeLine: 8, auxiliary: { distances: { ...distances } } };
            
            if (distances[edge.source] !== Infinity && distances[edge.source] + (edge.weight || 0) < distances[edge.target]) {
                distances[edge.target] = distances[edge.source] + (edge.weight || 0);
                graph.edges[edgeIdx].state = 'FOUND';
                yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: \`Cập nhật khoảng cách tới \${edge.target} = \${distances[edge.target]}\`, codeLine: 10, auxiliary: { distances: { ...distances } } };
            }
            
            graph.edges[edgeIdx].state = 'DEFAULT';
            graph.nodes[uIdx].state = 'DEFAULT';
            graph.nodes[vIdx].state = 'DEFAULT';
        }
    }
    
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: \`Bắt đầu kiểm tra chu trình âm...\`, codeLine: 16, auxiliary: { distances: { ...distances } } };
    for (const edge of graph.edges) {
        if (distances[edge.source] !== Infinity && distances[edge.source] + (edge.weight || 0) < distances[edge.target]) {
            const edgeIdx = graph.edges.findIndex(e => e.id === edge.id);
            graph.edges[edgeIdx].state = 'DELETED';
            yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: \`Phát hiện chu trình âm qua cạnh \${edge.source} -> \${edge.target}!\`, codeLine: 18, auxiliary: { distances: { ...distances } } };
            return;
        }
    }
    
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: \`Hoàn thành Bellman-Ford, không có chu trình âm.\`, codeLine: 21, auxiliary: { distances: { ...distances } } };
}`;

// PRIM
const primCode = `export const primSnippets = {
  javascript: \`function prim(nodes, edges, startNode) {
  let tree = new Set([startNode]);
  let mstEdges = [];
  
  while (tree.size < nodes.length) {
    let minEdge = null;
    for (let {u, v, w} of edges) {
      // Find edge that connects tree with non-tree
      if ((tree.has(u) && !tree.has(v)) || (tree.has(v) && !tree.has(u))) {
        if (!minEdge || w < minEdge.w) {
          minEdge = {u, v, w};
        }
      }
    }
    if (!minEdge) break;
    tree.add(minEdge.u);
    tree.add(minEdge.v);
    mstEdges.push(minEdge);
  }
  return mstEdges;
}\`
};`;

const primLogic = `import { GraphStateData, DSAnimationStep } from '../data-structures/types';

export const createPrimGraph = (): GraphStateData => {
    return {
        nodes: [
            { id: 'A', value: 'A', x: 20, y: 50, state: 'DEFAULT' },
            { id: 'B', value: 'B', x: 50, y: 20, state: 'DEFAULT' },
            { id: 'C', value: 'C', x: 80, y: 50, state: 'DEFAULT' },
            { id: 'D', value: 'D', x: 50, y: 80, state: 'DEFAULT' },
            { id: 'E', value: 'E', x: 80, y: 80, state: 'DEFAULT' },
        ],
        edges: [
            { id: 'e1', source: 'A', target: 'B', weight: 4, state: 'DEFAULT', isDirected: false },
            { id: 'e2', source: 'A', target: 'D', weight: 2, state: 'DEFAULT', isDirected: false },
            { id: 'e3', source: 'B', target: 'C', weight: 3, state: 'DEFAULT', isDirected: false },
            { id: 'e4', source: 'B', target: 'D', weight: 1, state: 'DEFAULT', isDirected: false },
            { id: 'e5', source: 'D', target: 'C', weight: 5, state: 'DEFAULT', isDirected: false },
            { id: 'e6', source: 'D', target: 'E', weight: 4, state: 'DEFAULT', isDirected: false },
            { id: 'e7', source: 'C', target: 'E', weight: 1, state: 'DEFAULT', isDirected: false },
        ]
    };
};

export function* generatePrim(startNodeId: string): Generator<DSAnimationStep> {
    const graph = createPrimGraph();
    const tree = new Set<string>();
    tree.add(startNodeId);
    
    const startNodeIdx = graph.nodes.findIndex(n => n.id === startNodeId);
    graph.nodes[startNodeIdx].state = 'FOUND';
    
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: \`Bắt đầu với đỉnh \${startNodeId}\`, codeLine: 2 };
    
    while (tree.size < graph.nodes.length) {
        let minEdge = null;
        let minEdgeObj = null;
        
        yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: \`Tìm cạnh nhỏ nhất nối từ MST ra ngoài...\`, codeLine: 5 };
        
        for (const edge of graph.edges) {
            if (edge.state === 'FOUND') continue;
            
            const hasU = tree.has(edge.source);
            const hasV = tree.has(edge.target);
            
            if ((hasU && !hasV) || (!hasU && hasV)) {
                const edgeIdx = graph.edges.findIndex(e => e.id === edge.id);
                graph.edges[edgeIdx].state = 'ACCESS';
                yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: \`Kiểm tra cạnh \${edge.source}-\${edge.target} (Trọng số: \${edge.weight})\`, codeLine: 9 };
                graph.edges[edgeIdx].state = 'DEFAULT';
                
                if (!minEdgeObj || (edge.weight || 0) < minEdgeObj.weight) {
                    minEdgeObj = edge;
                    minEdge = { u: edge.source, v: edge.target };
                }
            }
        }
        
        if (!minEdgeObj) break;
        
        tree.add(minEdgeObj.source);
        tree.add(minEdgeObj.target);
        
        const edgeIdx = graph.edges.findIndex(e => e.id === minEdgeObj.id);
        const uIdx = graph.nodes.findIndex(n => n.id === minEdgeObj.source);
        const vIdx = graph.nodes.findIndex(n => n.id === minEdgeObj.target);
        
        graph.edges[edgeIdx].state = 'FOUND';
        graph.nodes[uIdx].state = 'FOUND';
        graph.nodes[vIdx].state = 'FOUND';
        
        yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: \`Thêm cạnh \${minEdgeObj.source}-\${minEdgeObj.target} vào MST\`, codeLine: 16 };
    }
    
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: \`Hoàn thành thuật toán Prim!\`, codeLine: 20 };
}`;

// TOPO SORT
const topoCode = `export const topoSortSnippets = {
  javascript: \`function topologicalSort(nodes, edges) {
  let inDegree = {};
  for (let n of nodes) inDegree[n] = 0;
  for (let {u, v} of edges) inDegree[v]++;
  
  let queue = nodes.filter(n => inDegree[n] === 0);
  let result = [];
  
  while (queue.length > 0) {
    let curr = queue.shift();
    result.push(curr);
    
    for (let {u, v} of edges) {
      if (u === curr) {
        inDegree[v]--;
        if (inDegree[v] === 0) queue.push(v);
      }
    }
  }
  return result;
}\`
};`;

const topoLogic = `import { GraphStateData, DSAnimationStep } from '../data-structures/types';

export const createTopoGraph = (): GraphStateData => {
    return {
        nodes: [
            { id: '1', value: '1', x: 20, y: 30, state: 'DEFAULT' },
            { id: '2', value: '2', x: 20, y: 70, state: 'DEFAULT' },
            { id: '3', value: '3', x: 50, y: 30, state: 'DEFAULT' },
            { id: '4', value: '4', x: 50, y: 70, state: 'DEFAULT' },
            { id: '5', value: '5', x: 80, y: 30, state: 'DEFAULT' },
            { id: '6', value: '6', x: 80, y: 70, state: 'DEFAULT' },
        ],
        edges: [
            { id: 'e1', source: '1', target: '3', state: 'DEFAULT', isDirected: true },
            { id: 'e2', source: '2', target: '3', state: 'DEFAULT', isDirected: true },
            { id: 'e3', source: '3', target: '4', state: 'DEFAULT', isDirected: true },
            { id: 'e4', source: '3', target: '5', state: 'DEFAULT', isDirected: true },
            { id: 'e5', source: '4', target: '6', state: 'DEFAULT', isDirected: true },
            { id: 'e6', source: '5', target: '6', state: 'DEFAULT', isDirected: true },
        ]
    };
};

export function* generateTopoSort(): Generator<DSAnimationStep> {
    const graph = createTopoGraph();
    const inDegree: Record<string, number> = {};
    for (const node of graph.nodes) inDegree[node.id] = 0;
    
    for (const edge of graph.edges) {
        inDegree[edge.target]++;
    }
    
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: \`Tính In-Degree (bậc vào) cho từng đỉnh\`, codeLine: 4, auxiliary: { inDegree: { ...inDegree }, queue: [], result: [] } };
    
    const queue: string[] = [];
    for (const node of graph.nodes) {
        if (inDegree[node.id] === 0) queue.push(node.id);
    }
    
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: \`Thêm các đỉnh có In-Degree = 0 vào hàng đợi (Queue)\`, codeLine: 6, auxiliary: { inDegree: { ...inDegree }, queue: [...queue], result: [] } };
    
    const result: string[] = [];
    
    while (queue.length > 0) {
        const curr = queue.shift()!;
        result.push(curr);
        
        const currIdx = graph.nodes.findIndex(n => n.id === curr);
        graph.nodes[currIdx].state = 'SELECTED';
        
        yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: \`Lấy đỉnh \${curr} ra khỏi Queue và thêm vào mảng kết quả\`, codeLine: 10, auxiliary: { inDegree: { ...inDegree }, queue: [...queue], result: [...result] } };
        
        for (const edge of graph.edges) {
            if (edge.source === curr && edge.state !== 'DELETED') {
                const edgeIdx = graph.edges.findIndex(e => e.id === edge.id);
                graph.edges[edgeIdx].state = 'DELETED';
                inDegree[edge.target]--;
                
                yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: \`Xóa cạnh \${curr} -> \${edge.target}, giảm In-Degree của \${edge.target} xuống \${inDegree[edge.target]}\`, codeLine: 15, auxiliary: { inDegree: { ...inDegree }, queue: [...queue], result: [...result] } };
                
                if (inDegree[edge.target] === 0) {
                    queue.push(edge.target);
                    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: \`In-Degree của \${edge.target} = 0, thêm vào Queue\`, codeLine: 16, auxiliary: { inDegree: { ...inDegree }, queue: [...queue], result: [...result] } };
                }
            }
        }
        
        graph.nodes[currIdx].state = 'DELETED';
    }
    
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: \`Sắp xếp Topo hoàn tất!\`, codeLine: 20, auxiliary: { inDegree: { ...inDegree }, queue: [...queue], result: [...result] } };
}`;

function getPageContent(name, title, logicFn, snippetsVar, libFile) {
    return `"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Code2, Activity, Play, RotateCcw } from "lucide-react";
import GraphView from "@/components/Visualization/Graph/GraphView";
import { GraphStateData, DSAnimationStep } from "@/lib/data-structures/types"; 
import { create${name}Graph, ${logicFn} } from "@/lib/search/${libFile}Logic";
import { ${snippetsVar} } from "@/lib/search/${libFile}Code";

export default function Page() {
  const [graphData, setGraphData] = useState<GraphStateData>(() => create${name}Graph());
  const [timeline, setTimeline] = useState<DSAnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [auxiliary, setAuxiliary] = useState<any>({});

  const reset = useCallback(() => {
      setGraphData(create${name}Graph());
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
      runAnimation(${logicFn}(${title === 'Topo' ? '' : "'S'"}));
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-4 md:p-8 relative font-sans">
      <div className="w-full max-w-7xl mb-6 flex justify-between items-center">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white gap-2"><ArrowLeft size={20} /> Dashboard</Link>
      </div>

      <h1 className="text-3xl font-extrabold mb-2 bg-linear-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">${title} Algorithm</h1>

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
                            {${snippetsVar}.javascript.split('\\n').map((line: string, i: number) => {
                                const isActive = timeline[currentStep]?.codeLine === i + 1;
                                return (
                                    <tr key={i} className={\`\${isActive ? 'bg-yellow-500/20' : ''} transition-colors\`}>
                                        <td className="w-6 text-right pr-3 text-slate-600 border-r border-slate-700/50">{i + 1}</td>
                                        <td className={\`pl-3 whitespace-pre-wrap \${isActive ? 'text-yellow-100 font-bold' : 'text-pink-200'}\`}>{line}</td>
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
}`;
}

fs.writeFileSync('src/lib/search/bellmanFordCode.ts', bellmanFordCode);
fs.writeFileSync('src/lib/search/bellmanFordLogic.ts', bellmanFordLogic);
fs.writeFileSync('src/app/graph/bellman-ford/page.tsx', getPageContent('BellmanFord', 'Bellman-Ford', 'generateBellmanFord', 'bellmanFordSnippets', 'bellmanFord'));

fs.writeFileSync('src/lib/search/primCode.ts', primCode);
fs.writeFileSync('src/lib/search/primLogic.ts', primLogic);
fs.writeFileSync('src/app/graph/prim/page.tsx', getPageContent('Prim', 'Prim', 'generatePrim', 'primSnippets', 'prim').replace(/'S'/g, "'A'"));

fs.writeFileSync('src/lib/search/topoCode.ts', topoCode);
fs.writeFileSync('src/lib/search/topoLogic.ts', topoLogic);
fs.writeFileSync('src/app/graph/topo/page.tsx', getPageContent('Topo', 'Topo', 'generateTopoSort', 'topoSortSnippets', 'topo'));

