import { GraphStateData, DSAnimationStep } from '../data-structures/types';

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
    
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Bắt đầu với đỉnh ${startNodeId}`, codeLine: 2 };
    
    while (tree.size < graph.nodes.length) {
        let minEdge = null;
        let minEdgeObj = null;
        
        yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Tìm cạnh nhỏ nhất nối từ MST ra ngoài...`, codeLine: 5 };
        
        for (const edge of graph.edges) {
            if (edge.state === 'FOUND') continue;
            
            const hasU = tree.has(edge.source);
            const hasV = tree.has(edge.target);
            
            if ((hasU && !hasV) || (!hasU && hasV)) {
                const edgeIdx = graph.edges.findIndex(e => e.id === edge.id);
                graph.edges[edgeIdx].state = 'ACCESS';
                yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Kiểm tra cạnh ${edge.source}-${edge.target} (Trọng số: ${edge.weight})`, codeLine: 9 };
                graph.edges[edgeIdx].state = 'DEFAULT';
                
                if (!minEdgeObj || (edge.weight || 0) < (minEdgeObj.weight || 0)) {
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
        
        yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Thêm cạnh ${minEdgeObj.source}-${minEdgeObj.target} vào MST`, codeLine: 16 };
    }
    
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Hoàn thành thuật toán Prim!`, codeLine: 20 };
}