import { GraphStateData, DSAnimationStep } from '../data-structures/types';

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
    
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Khởi tạo khoảng cách, ${startNodeId} = 0, các đỉnh khác = ∞`, codeLine: 3, auxiliary: { distances: { ...distances } } };
    
    for (let i = 0; i < graph.nodes.length - 1; i++) {
        yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Lặp lần ${i + 1} (Tối đa V-1 = ${graph.nodes.length - 1} lần)`, codeLine: 7, auxiliary: { distances: { ...distances } } };
        
        for (const edge of graph.edges) {
            const edgeIdx = graph.edges.findIndex(e => e.id === edge.id);
            const uIdx = graph.nodes.findIndex(n => n.id === edge.source);
            const vIdx = graph.nodes.findIndex(n => n.id === edge.target);
            
            graph.edges[edgeIdx].state = 'ACCESS';
            graph.nodes[uIdx].state = 'SELECTED';
            graph.nodes[vIdx].state = 'SELECTED';
            yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Xét cạnh ${edge.source} -> ${edge.target} (Trọng số: ${edge.weight})`, codeLine: 8, auxiliary: { distances: { ...distances } } };
            
            if (distances[edge.source] !== Infinity && distances[edge.source] + (edge.weight || 0) < distances[edge.target]) {
                distances[edge.target] = distances[edge.source] + (edge.weight || 0);
                graph.edges[edgeIdx].state = 'FOUND';
                yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Cập nhật khoảng cách tới ${edge.target} = ${distances[edge.target]}`, codeLine: 10, auxiliary: { distances: { ...distances } } };
            }
            
            graph.edges[edgeIdx].state = 'DEFAULT';
            graph.nodes[uIdx].state = 'DEFAULT';
            graph.nodes[vIdx].state = 'DEFAULT';
        }
    }
    
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Bắt đầu kiểm tra chu trình âm...`, codeLine: 16, auxiliary: { distances: { ...distances } } };
    for (const edge of graph.edges) {
        if (distances[edge.source] !== Infinity && distances[edge.source] + (edge.weight || 0) < distances[edge.target]) {
            const edgeIdx = graph.edges.findIndex(e => e.id === edge.id);
            graph.edges[edgeIdx].state = 'DELETED';
            yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Phát hiện chu trình âm qua cạnh ${edge.source} -> ${edge.target}!`, codeLine: 18, auxiliary: { distances: { ...distances } } };
            return;
        }
    }
    
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Hoàn thành Bellman-Ford, không có chu trình âm.`, codeLine: 21, auxiliary: { distances: { ...distances } } };
}