import { GraphStateData, DSAnimationStep } from './types';

export const createDSUGraph = (): GraphStateData => {
    return {
        nodes: [
            { id: '0', value: '0', x: 50, y: 20, state: 'DEFAULT' },
            { id: '1', value: '1', x: 80, y: 40, state: 'DEFAULT' },
            { id: '2', value: '2', x: 70, y: 80, state: 'DEFAULT' },
            { id: '3', value: '3', x: 30, y: 80, state: 'DEFAULT' },
            { id: '4', value: '4', x: 20, y: 40, state: 'DEFAULT' },
        ],
        edges: []
    };
};

const parent: Record<string, string> = { '0': '0', '1': '1', '2': '2', '3': '3', '4': '4' };

export function* generateDSUFind(
    currentGraph: GraphStateData,
    i: string
): Generator<DSAnimationStep> {
    const graph = JSON.parse(JSON.stringify(currentGraph)) as GraphStateData;
    
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Finding root of ${i}...`, codeLine: 1 };
    
    let current = i;
    const path: string[] = [];
    
    while (true) {
        graph.nodes.find(n => n.id === current)!.state = 'SELECTED';
        path.push(current);
        
        yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Visiting ${current}...`, codeLine: 2 };
        
        const edge = graph.edges.find(e => e.source === current); // Directed edge goes from child to parent
        if (edge) {
            edge.state = 'SELECTED';
            current = edge.target;
        } else {
            break; // No parent means it's the root
        }
    }
    
    graph.nodes.find(n => n.id === current)!.state = 'FOUND';
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Root is ${current}.`, codeLine: 3 };
    
    // Path Compression
    if (path.length > 2) {
        yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Performing Path Compression...`, codeLine: 6 };
        
        for (let idx = 0; idx < path.length - 1; idx++) {
            const child = path[idx];
            if (child === current) continue; // Root
            
            // Find existing edge and remove
            const edgeIdx = graph.edges.findIndex(e => e.source === child);
            if (edgeIdx !== -1 && graph.edges[edgeIdx].target !== current) {
                // Redirect edge to point directly to root
                graph.edges[edgeIdx].target = current;
                yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Redirecting ${child} directly to root ${current}`, codeLine: 7 };
            }
        }
    }
    
    // Reset colors
    graph.nodes.forEach(n => n.state = 'DEFAULT');
    graph.edges.forEach(e => e.state = 'DEFAULT');
    
    yield { arrayState: [], graphState: graph, message: `Find complete. Root: ${current}`, codeLine: 8, auxiliary: { root: current, graphState: graph } };
}

export function* generateDSUUnion(
    currentGraph: GraphStateData,
    i: string,
    j: string
): Generator<DSAnimationStep> {
    const graph = JSON.parse(JSON.stringify(currentGraph)) as GraphStateData;
    
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Union(${i}, ${j})`, codeLine: 1 };
    
    // Manual inline of Find for i to capture steps
    let rootI = i;
    let pathI: string[] = [];
    while (true) {
        pathI.push(rootI);
        graph.nodes.find(n => n.id === rootI)!.state = 'SELECTED';
        const edge = graph.edges.find(e => e.source === rootI);
        if (edge) rootI = edge.target; else break;
    }
    graph.nodes.find(n => n.id === rootI)!.state = 'FOUND';
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Root of ${i} is ${rootI}`, codeLine: 2 };
    
    // Manual inline of Find for j
    let rootJ = j;
    let pathJ: string[] = [];
    while (true) {
        pathJ.push(rootJ);
        graph.nodes.find(n => n.id === rootJ)!.state = 'SELECTED';
        const edge = graph.edges.find(e => e.source === rootJ);
        if (edge) rootJ = edge.target; else break;
    }
    graph.nodes.find(n => n.id === rootJ)!.state = 'FOUND';
    yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Root of ${j} is ${rootJ}`, codeLine: 3 };
    
    if (rootI !== rootJ) {
        yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `Roots are different. Merging...`, codeLine: 5 };
        
        // Make rootI the parent of rootJ
        graph.edges.push({
            id: `e-${rootJ}-${rootI}`,
            source: rootJ,
            target: rootI,
            isDirected: true,
            state: 'ACCESS'
        });
        
        yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `${rootJ} now points to ${rootI}`, codeLine: 7 };
    } else {
        yield { arrayState: [], graphState: JSON.parse(JSON.stringify(graph)), message: `They are already in the same set!`, codeLine: 5 };
    }
    
    // Reset colors
    graph.nodes.forEach(n => n.state = 'DEFAULT');
    graph.edges.forEach(e => e.state = 'DEFAULT');
    
    yield { arrayState: [], graphState: graph, message: `Union complete.`, auxiliary: { graphState: graph } };
}
