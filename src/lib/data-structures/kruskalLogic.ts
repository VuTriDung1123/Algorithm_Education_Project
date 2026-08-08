import { GraphStateData, DSAnimationStep } from './types';

export const createKruskalGraph = (): GraphStateData => {
    return {
        nodes: [
            { id: 'A', value: 'A', x: 20, y: 50, state: 'DEFAULT' },
            { id: 'B', value: 'B', x: 50, y: 20, state: 'DEFAULT' },
            { id: 'C', value: 'C', x: 80, y: 50, state: 'DEFAULT' },
            { id: 'D', value: 'D', x: 50, y: 80, state: 'DEFAULT' },
            { id: 'E', value: 'E', x: 50, y: 50, state: 'DEFAULT' },
        ],
        edges: [
            { id: 'e1', source: 'A', target: 'B', weight: 2, state: 'DEFAULT', isDirected: false },
            { id: 'e2', source: 'A', target: 'E', weight: 3, state: 'DEFAULT', isDirected: false },
            { id: 'e3', source: 'B', target: 'C', weight: 1, state: 'DEFAULT', isDirected: false },
            { id: 'e4', source: 'B', target: 'E', weight: 4, state: 'DEFAULT', isDirected: false },
            { id: 'e5', source: 'C', target: 'D', weight: 3, state: 'DEFAULT', isDirected: false },
            { id: 'e6', source: 'C', target: 'E', weight: 5, state: 'DEFAULT', isDirected: false },
            { id: 'e7', source: 'D', target: 'A', weight: 4, state: 'DEFAULT', isDirected: false },
            { id: 'e8', source: 'D', target: 'E', weight: 6, state: 'DEFAULT', isDirected: false },
        ]
    };
};

class DSU {
    parent: Record<string, string>;
    constructor(nodes: string[]) {
        this.parent = {};
        for (const node of nodes) this.parent[node] = node;
    }
    find(i: string): string {
        if (this.parent[i] === i) return i;
        return this.find(this.parent[i]);
    }
    union(i: string, j: string) {
        const rootI = this.find(i);
        const rootJ = this.find(j);
        if (rootI !== rootJ) {
            this.parent[rootI] = rootJ;
        }
    }
}

export function* generateKruskal(): Generator<DSAnimationStep> {
    const graph = createKruskalGraph();
    const sortedEdges = [...graph.edges].sort((a, b) => (a.weight || 0) - (b.weight || 0));
    
    const dsu = new DSU(graph.nodes.map(n => n.id));
    const mst: string[] = [];
    
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Sort edges by weight.`, codeLine: 2, auxiliary: { mst: [...mst], sortedEdges: sortedEdges.map(e => e.id) } };
    
    for (const edge of sortedEdges) {
        const edgeIdx = graph.edges.findIndex(e => e.id === edge.id);
        const u = edge.source;
        const v = edge.target;
        
        graph.edges[edgeIdx].state = 'ACCESS';
        yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Check edge ${u}-${v} (weight ${edge.weight})`, codeLine: 9, auxiliary: { mst: [...mst], sortedEdges: sortedEdges.map(e => e.id) } };
        
        const rootU = dsu.find(u);
        const rootV = dsu.find(v);
        
        if (rootU !== rootV) {
            dsu.union(u, v);
            mst.push(edge.id);
            graph.edges[edgeIdx].state = 'FOUND'; // Mark as MST edge
            graph.nodes.find(n => n.id === u)!.state = 'FOUND';
            graph.nodes.find(n => n.id === v)!.state = 'FOUND';
            yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `${u} and ${v} are in different sets. Add to MST.`, codeLine: 11, auxiliary: { mst: [...mst], sortedEdges: sortedEdges.map(e => e.id) } };
            
            if (mst.length === graph.nodes.length - 1) {
                yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `MST has V-1 edges. Early exit.`, codeLine: 15, auxiliary: { mst: [...mst], sortedEdges: sortedEdges.map(e => e.id) } };
                break;
            }
        } else {
            graph.edges[edgeIdx].state = 'DELETED'; // Forms a cycle
            yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `${u} and ${v} are in the same set (Cycle). Discard edge.`, codeLine: 9, auxiliary: { mst: [...mst], sortedEdges: sortedEdges.map(e => e.id) } };
        }
    }
    
    // Dim non-MST edges
    graph.edges.forEach(e => {
        if (e.state !== 'FOUND') e.state = 'DEFAULT';
    });
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Kruskal's Algorithm Complete!`, auxiliary: { mst: [...mst], sortedEdges: sortedEdges.map(e => e.id) } };
}
