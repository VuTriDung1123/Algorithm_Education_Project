import { GraphStateData, DSAnimationStep } from './types';

export const createWeightedGraph = (): GraphStateData => {
    return {
        nodes: [
            { id: 'A', value: 'A', x: 20, y: 50, state: 'DEFAULT', auxiliary: { dist: '∞' } },
            { id: 'B', value: 'B', x: 50, y: 20, state: 'DEFAULT', auxiliary: { dist: '∞' } },
            { id: 'C', value: 'C', x: 80, y: 50, state: 'DEFAULT', auxiliary: { dist: '∞' } },
            { id: 'D', value: 'D', x: 50, y: 80, state: 'DEFAULT', auxiliary: { dist: '∞' } },
            { id: 'E', value: 'E', x: 80, y: 80, state: 'DEFAULT', auxiliary: { dist: '∞' } },
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

function getNeighbors(graph: GraphStateData, nodeId: string): { nodeId: string, edgeId: string, weight: number }[] {
    const neighbors: { nodeId: string, edgeId: string, weight: number }[] = [];
    for (const edge of graph.edges) {
        if (edge.source === nodeId) neighbors.push({ nodeId: edge.target, edgeId: edge.id, weight: edge.weight || 1 });
        else if (!edge.isDirected && edge.target === nodeId) neighbors.push({ nodeId: edge.source, edgeId: edge.id, weight: edge.weight || 1 });
    }
    return neighbors.sort((a, b) => a.weight - b.weight); // heuristic
}

export function* generateDijkstra(
    startNodeId: string
): Generator<DSAnimationStep> {
    const graph = createWeightedGraph();
    const distances: Record<string, number> = {};
    for (const node of graph.nodes) distances[node.id] = Infinity;
    
    distances[startNodeId] = 0;
    const pq: { node: string, dist: number }[] = [{ node: startNodeId, dist: 0 }];
    const visited = new Set<string>();
    
    // Update visual dist
    graph.nodes.find(n => n.id === startNodeId)!.auxiliary = { dist: 0 };
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Set distance of start node ${startNodeId} to 0.`, codeLine: 3, auxiliary: { pq: [...pq], distances: { ...distances } } };
    
    while (pq.length > 0) {
        // Sort to simulate Priority Queue
        pq.sort((a, b) => a.dist - b.dist);
        const { node: current, dist: currentDist } = pq.shift()!;
        
        if (visited.has(current)) continue;
        visited.add(current);
        
        const currNodeIdx = graph.nodes.findIndex(n => n.id === current);
        graph.nodes[currNodeIdx].state = 'SELECTED';
        yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Dequeue ${current} (Dist: ${currentDist})`, codeLine: 8, auxiliary: { pq: [...pq], distances: { ...distances } } };
        
        const neighbors = getNeighbors(graph, current);
        
        for (const { nodeId: neighbor, edgeId, weight } of neighbors) {
            if (visited.has(neighbor)) continue;
            
            const edgeIdx = graph.edges.findIndex(e => e.id === edgeId);
            const neighborIdx = graph.nodes.findIndex(n => n.id === neighbor);
            
            graph.edges[edgeIdx].state = 'ACCESS';
            yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Check neighbor ${neighbor}, edge weight ${weight}`, codeLine: 13, auxiliary: { pq: [...pq], distances: { ...distances } } };
            
            const newDist = currentDist + weight;
            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist;
                graph.nodes[neighborIdx].auxiliary = { dist: newDist };
                graph.nodes[neighborIdx].state = 'FOUND';
                graph.edges[edgeIdx].state = 'FOUND';
                
                pq.push({ node: neighbor, dist: newDist });
                
                yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Found shorter path to ${neighbor}: ${newDist}`, codeLine: 17, auxiliary: { pq: [...pq], distances: { ...distances } } };
                
                graph.nodes[neighborIdx].state = 'DEFAULT';
                graph.edges[edgeIdx].state = 'DEFAULT';
            } else {
                graph.edges[edgeIdx].state = 'DEFAULT';
                yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Path to ${neighbor} is not shorter (${newDist} >= ${distances[neighbor]})`, codeLine: 16, auxiliary: { pq: [...pq], distances: { ...distances } } };
            }
        }
        
        graph.nodes[currNodeIdx].state = 'DELETED'; // Mark as permanently processed
        yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Finished processing ${current}. Distance is permanent.`, auxiliary: { pq: [...pq], distances: { ...distances } } };
    }
    
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Dijkstra Complete!`, auxiliary: { pq: [...pq], distances: { ...distances } } };
}
