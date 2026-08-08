import { GraphStateData, DSAnimationStep } from '../data-structures/types';

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
    
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Tính In-Degree (bậc vào) cho từng đỉnh`, codeLine: 4, auxiliary: { inDegree: { ...inDegree }, queue: [], result: [] } };
    
    const queue: string[] = [];
    for (const node of graph.nodes) {
        if (inDegree[node.id] === 0) queue.push(node.id);
    }
    
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Thêm các đỉnh có In-Degree = 0 vào hàng đợi (Queue)`, codeLine: 6, auxiliary: { inDegree: { ...inDegree }, queue: [...queue], result: [] } };
    
    const result: string[] = [];
    
    while (queue.length > 0) {
        const curr = queue.shift()!;
        result.push(curr);
        
        const currIdx = graph.nodes.findIndex(n => n.id === curr);
        graph.nodes[currIdx].state = 'SELECTED';
        
        yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Lấy đỉnh ${curr} ra khỏi Queue và thêm vào mảng kết quả`, codeLine: 10, auxiliary: { inDegree: { ...inDegree }, queue: [...queue], result: [...result] } };
        
        for (const edge of graph.edges) {
            if (edge.source === curr && edge.state !== 'DELETED') {
                const edgeIdx = graph.edges.findIndex(e => e.id === edge.id);
                graph.edges[edgeIdx].state = 'DELETED';
                inDegree[edge.target]--;
                
                yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Xóa cạnh ${curr} -> ${edge.target}, giảm In-Degree của ${edge.target} xuống ${inDegree[edge.target]}`, codeLine: 15, auxiliary: { inDegree: { ...inDegree }, queue: [...queue], result: [...result] } };
                
                if (inDegree[edge.target] === 0) {
                    queue.push(edge.target);
                    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `In-Degree của ${edge.target} = 0, thêm vào Queue`, codeLine: 16, auxiliary: { inDegree: { ...inDegree }, queue: [...queue], result: [...result] } };
                }
            }
        }
        
        graph.nodes[currIdx].state = 'DELETED';
    }
    
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Sắp xếp Topo hoàn tất!`, codeLine: 20, auxiliary: { inDegree: { ...inDegree }, queue: [...queue], result: [...result] } };
}