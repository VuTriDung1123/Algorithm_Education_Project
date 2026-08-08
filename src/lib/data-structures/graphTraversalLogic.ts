import { GraphStateData, DSAnimationStep } from './types';

export const createSampleGraph = (): GraphStateData => {
    return {
        nodes: [
            { id: 'A', value: 'A', x: 20, y: 20, state: 'DEFAULT' },
            { id: 'B', value: 'B', x: 50, y: 20, state: 'DEFAULT' },
            { id: 'C', value: 'C', x: 80, y: 50, state: 'DEFAULT' },
            { id: 'D', value: 'D', x: 50, y: 80, state: 'DEFAULT' },
            { id: 'E', value: 'E', x: 20, y: 80, state: 'DEFAULT' },
            { id: 'F', value: 'F', x: 50, y: 50, state: 'DEFAULT' },
        ],
        edges: [
            { id: 'e1', source: 'A', target: 'B', state: 'DEFAULT', isDirected: false },
            { id: 'e2', source: 'A', target: 'E', state: 'DEFAULT', isDirected: false },
            { id: 'e3', source: 'B', target: 'F', state: 'DEFAULT', isDirected: false },
            { id: 'e4', source: 'B', target: 'C', state: 'DEFAULT', isDirected: false },
            { id: 'e5', source: 'F', target: 'E', state: 'DEFAULT', isDirected: false },
            { id: 'e6', source: 'F', target: 'D', state: 'DEFAULT', isDirected: false },
            { id: 'e7', source: 'C', target: 'D', state: 'DEFAULT', isDirected: false },
            { id: 'e8', source: 'E', target: 'D', state: 'DEFAULT', isDirected: false },
        ]
    };
};

function getNeighbors(graph: GraphStateData, nodeId: string): { nodeId: string, edgeId: string }[] {
    const neighbors: { nodeId: string, edgeId: string }[] = [];
    for (const edge of graph.edges) {
        if (edge.source === nodeId) neighbors.push({ nodeId: edge.target, edgeId: edge.id });
        else if (!edge.isDirected && edge.target === nodeId) neighbors.push({ nodeId: edge.source, edgeId: edge.id });
    }
    // Sort alphabetically by node value for predictable traversal
    return neighbors.sort((a, b) => {
        const valA = graph.nodes.find(n => n.id === a.nodeId)?.value as string;
        const valB = graph.nodes.find(n => n.id === b.nodeId)?.value as string;
        return valA.localeCompare(valB);
    });
}

export function* generateBFS(
    startNodeId: string
): Generator<DSAnimationStep> {
    const graph = createSampleGraph();
    const visited = new Set<string>();
    const queue = [startNodeId];
    visited.add(startNodeId);
    
    const visitedOrder: string[] = [];
    
    // Mark start node
    graph.nodes.find(n => n.id === startNodeId)!.state = 'SELECTED';
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Start BFS from ${startNodeId}`, codeLine: 3, auxiliary: { queue: [...queue], visitedOrder: [...visitedOrder] } };
    
    while (queue.length > 0) {
        const current = queue.shift()!;
        const currNodeIdx = graph.nodes.findIndex(n => n.id === current);
        
        graph.nodes[currNodeIdx].state = 'FOUND'; // processing
        visitedOrder.push(current);
        
        yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Dequeue ${current}`, codeLine: 6, auxiliary: { queue: [...queue], visitedOrder: [...visitedOrder] } };
        
        const neighbors = getNeighbors(graph, current);
        
        for (const { nodeId: neighbor, edgeId } of neighbors) {
            const edgeIdx = graph.edges.findIndex(e => e.id === edgeId);
            const neighborIdx = graph.nodes.findIndex(n => n.id === neighbor);
            
            // Check edge
            graph.edges[edgeIdx].state = 'SELECTED';
            yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Check neighbor ${neighbor}`, codeLine: 9, auxiliary: { queue: [...queue], visitedOrder: [...visitedOrder] } };
            
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
                graph.nodes[neighborIdx].state = 'SELECTED';
                graph.edges[edgeIdx].state = 'FOUND'; // Mark edge as traversed
                yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `${neighbor} not visited. Enqueue it.`, codeLine: 12, auxiliary: { queue: [...queue], visitedOrder: [...visitedOrder] } };
            } else {
                graph.edges[edgeIdx].state = 'DEFAULT'; // Revert edge color
                yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `${neighbor} already visited.`, codeLine: 10, auxiliary: { queue: [...queue], visitedOrder: [...visitedOrder] } };
            }
        }
        
        // Mark as fully processed
        graph.nodes[currNodeIdx].state = 'DELETED'; // visually mark as done
        yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Finished processing ${current}`, auxiliary: { queue: [...queue], visitedOrder: [...visitedOrder] } };
    }
    
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `BFS Complete!`, auxiliary: { queue: [...queue], visitedOrder: [...visitedOrder] } };
}

export function* generateDFS(
    startNodeId: string
): Generator<DSAnimationStep> {
    const graph = createSampleGraph();
    const visited = new Set<string>();
    const stack = [startNodeId];
    visited.add(startNodeId);
    
    const visitedOrder: string[] = [];
    
    graph.nodes.find(n => n.id === startNodeId)!.state = 'SELECTED';
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Start DFS from ${startNodeId}`, codeLine: 3, auxiliary: { stack: [...stack], visitedOrder: [...visitedOrder] } };
    
    while (stack.length > 0) {
        const current = stack.pop()!;
        const currNodeIdx = graph.nodes.findIndex(n => n.id === current);
        
        graph.nodes[currNodeIdx].state = 'FOUND'; 
        visitedOrder.push(current);
        
        yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Pop ${current}`, codeLine: 6, auxiliary: { stack: [...stack], visitedOrder: [...visitedOrder] } };
        
        // Reverse neighbors for standard DFS left-to-right behavior
        const neighbors = getNeighbors(graph, current).reverse();
        
        for (const { nodeId: neighbor, edgeId } of neighbors) {
            const edgeIdx = graph.edges.findIndex(e => e.id === edgeId);
            const neighborIdx = graph.nodes.findIndex(n => n.id === neighbor);
            
            graph.edges[edgeIdx].state = 'SELECTED';
            yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Check neighbor ${neighbor}`, codeLine: 9, auxiliary: { stack: [...stack], visitedOrder: [...visitedOrder] } };
            
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                stack.push(neighbor);
                graph.nodes[neighborIdx].state = 'SELECTED';
                graph.edges[edgeIdx].state = 'FOUND';
                yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `${neighbor} not visited. Push to stack.`, codeLine: 12, auxiliary: { stack: [...stack], visitedOrder: [...visitedOrder] } };
            } else {
                graph.edges[edgeIdx].state = 'DEFAULT';
                yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `${neighbor} already visited.`, codeLine: 10, auxiliary: { stack: [...stack], visitedOrder: [...visitedOrder] } };
            }
        }
        
        graph.nodes[currNodeIdx].state = 'DELETED'; 
        yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Finished processing ${current}`, auxiliary: { stack: [...stack], visitedOrder: [...visitedOrder] } };
    }
    
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `DFS Complete!`, auxiliary: { stack: [...stack], visitedOrder: [...visitedOrder] } };
}
