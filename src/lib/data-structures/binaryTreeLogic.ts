import { TreeNodeData, DSAnimationStep } from './types';

// Hardcoded Tree for traversal visualization
export const createSampleBinaryTree = (): TreeNodeData[] => {
    return [
        { id: '1', value: 1, x: 50, y: 40, state: 'DEFAULT', isVisible: true, left: '2', right: '3' },
        { id: '2', value: 2, x: 25, y: 120, state: 'DEFAULT', isVisible: true, left: '4', right: '5' },
        { id: '3', value: 3, x: 75, y: 120, state: 'DEFAULT', isVisible: true, left: '6', right: '7' },
        { id: '4', value: 4, x: 12.5, y: 200, state: 'DEFAULT', isVisible: true },
        { id: '5', value: 5, x: 37.5, y: 200, state: 'DEFAULT', isVisible: true },
        { id: '6', value: 6, x: 62.5, y: 200, state: 'DEFAULT', isVisible: true },
        { id: '7', value: 7, x: 87.5, y: 200, state: 'DEFAULT', isVisible: true },
    ];
};

export function* generatePreOrder(
    currentTree: TreeNodeData[],
    nodeId: string | undefined | null
): Generator<DSAnimationStep> {
    if (!nodeId) return;

    let tree = JSON.parse(JSON.stringify(currentTree)) as TreeNodeData[];
    const nodeIdx = tree.findIndex(n => n.id === nodeId);
    if (nodeIdx === -1) return;

    // Visit (Print)
    tree[nodeIdx].state = 'SELECTED';
    yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Visiting Node ${tree[nodeIdx].value}`, codeLine: 3, auxiliary: { visited: tree[nodeIdx].value } };
    
    tree[nodeIdx].state = 'FOUND'; // Keep it marked as visited
    yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Node ${tree[nodeIdx].value} visited.`, codeLine: 4 };

    // Traverse Left
    if (tree[nodeIdx].left) {
        yield* generatePreOrder(tree, tree[nodeIdx].left);
        // After left subtree is done, update our local tree state
        // To simplify, we just pass down and assume they don't modify structure
        // But we need to gather the visited states
    } else {
        yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Left is null.`, codeLine: 4 };
    }

    // Traverse Right
    if (tree[nodeIdx].right) {
        // Because generators don't easily share the mutated state back up without returning it,
        // we should actually pass the tree state object reference and mutate it!
        // But for generators yielding copies, we need a flat loop or a helper.
    }
}

// A better approach for recursive generators: pass a shared state object!
export function* generateTraversal(
    type: 'PRE' | 'IN' | 'POST'
): Generator<DSAnimationStep> {
    const tree = createSampleBinaryTree();
    const visited: number[] = [];

    function* traverse(nodeId: string | undefined | null): Generator<DSAnimationStep> {
        if (!nodeId) return;
        const idx = tree.findIndex(n => n.id === nodeId);
        if (idx === -1) return;

        tree[idx].state = 'ACCESS';
        yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Arrived at Node ${tree[idx].value}`, codeLine: 2, auxiliary: { visited: [...visited] } };
        
        if (type === 'PRE') {
            tree[idx].state = 'FOUND';
            visited.push(tree[idx].value as number);
            yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Visited Node ${tree[idx].value}`, codeLine: 3, auxiliary: { visited: [...visited] } };
        } else {
            tree[idx].state = 'DEFAULT'; // Revert back temporarily if not visited yet
        }

        if (tree[idx].left) {
            yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Going Left from Node ${tree[idx].value}`, codeLine: type === 'PRE' ? 4 : (type === 'IN' ? 3 : 3), auxiliary: { visited: [...visited] } };
            yield* traverse(tree[idx].left);
        }

        if (type === 'IN') {
            tree[idx].state = 'FOUND';
            visited.push(tree[idx].value as number);
            yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Visited Node ${tree[idx].value}`, codeLine: 4, auxiliary: { visited: [...visited] } };
        }

        if (tree[idx].right) {
            yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Going Right from Node ${tree[idx].value}`, codeLine: type === 'PRE' ? 5 : (type === 'IN' ? 5 : 4), auxiliary: { visited: [...visited] } };
            yield* traverse(tree[idx].right);
        }

        if (type === 'POST') {
            tree[idx].state = 'FOUND';
            visited.push(tree[idx].value as number);
            yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Visited Node ${tree[idx].value}`, codeLine: 5, auxiliary: { visited: [...visited] } };
        }
        
        // Going up
        yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Returning to Parent of Node ${tree[idx].value}`, auxiliary: { visited: [...visited] } };
    }

    yield* traverse('1'); // start at root
    yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: "Traversal Complete!", auxiliary: { visited: [...visited] } };
}
