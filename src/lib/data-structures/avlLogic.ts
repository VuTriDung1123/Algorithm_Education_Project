import { TreeNodeData, DSAnimationStep } from './types';

const generateId = () => Math.random().toString(36).substr(2, 9);

function recalculateCoordinates(tree: TreeNodeData[], rootId: string, x: number, y: number, depth: number) {
    const rootIdx = tree.findIndex(n => n.id === rootId);
    if (rootIdx === -1) return;
    
    tree[rootIdx].x = x;
    tree[rootIdx].y = y;
    
    const offset = 25 / Math.pow(2, depth);
    
    if (tree[rootIdx].left) {
        recalculateCoordinates(tree, tree[rootIdx].left as string, x - offset, y + 70, depth + 1);
    }
    if (tree[rootIdx].right) {
        recalculateCoordinates(tree, tree[rootIdx].right as string, x + offset, y + 70, depth + 1);
    }
}

function getHeight(tree: TreeNodeData[], nodeId: string | undefined | null): number {
    if (!nodeId) return 0;
    const node = tree.find(n => n.id === nodeId);
    if (!node) return 0;
    return (node.auxiliary?.height as number) || 1;
}

function getBalance(tree: TreeNodeData[], nodeId: string | undefined | null): number {
    if (!nodeId) return 0;
    const node = tree.find(n => n.id === nodeId);
    if (!node) return 0;
    return getHeight(tree, node.left) - getHeight(tree, node.right);
}

function updateHeight(tree: TreeNodeData[], nodeId: string | undefined | null) {
    if (!nodeId) return;
    const node = tree.find(n => n.id === nodeId);
    if (!node) return;
    node.auxiliary = { ...node.auxiliary, height: 1 + Math.max(getHeight(tree, node.left), getHeight(tree, node.right)) };
}

export function* generateAVLInsert(
    currentTree: TreeNodeData[],
    value: number
): Generator<DSAnimationStep> {
    let tree = JSON.parse(JSON.stringify(currentTree)) as TreeNodeData[];
    
    // Tìm root hiện tại
    let rootNode = tree.find(n => n.y === 40);
    let rootId = rootNode?.id;

    if (!rootId) {
        yield { arrayState: [], treeState: tree, message: "Tree is empty. Creating root node.", codeLine: 3, auxiliary: { code: 'INSERT' } };
        const newNode: TreeNodeData = {
            id: `root-${generateId()}`,
            value,
            state: 'ACCESS',
            x: 50,
            y: 40,
            isVisible: true,
            auxiliary: { height: 1 }
        };
        tree.push(newNode);
        yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Inserted ${value} as root.`, codeLine: 3, auxiliary: { code: 'INSERT' } };
        tree[0].state = 'DEFAULT';
        return;
    }

    // Đệ quy ảo bằng generator
    let path: string[] = [];
    let currentId: string | undefined | null = rootId;
    
    yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Starting insertion of ${value}...`, codeLine: 1, auxiliary: { code: 'INSERT' } };

    // B1: BST Insert
    while (currentId) {
        const idx: number = tree.findIndex(n => n.id === currentId);
        tree[idx].state = 'SELECTED';
        yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Comparing with ${tree[idx].value}...`, codeLine: 4, auxiliary: { code: 'INSERT' } };
        
        path.push(currentId);
        
        if (value === tree[idx].value) {
            tree[idx].state = 'FOUND';
            yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Value ${value} already exists!`, codeLine: 9, auxiliary: { code: 'INSERT' } };
            tree[idx].state = 'DEFAULT';
            return;
        }

        tree[idx].state = 'DEFAULT';
        
        if (value < (tree[idx].value as number)) {
            if (!tree[idx].left) {
                const newNode: TreeNodeData = {
                    id: `node-${generateId()}`, value, state: 'ACCESS',
                    x: 0, y: 0, isVisible: true, auxiliary: { height: 1 }
                };
                tree[idx].left = newNode.id;
                tree.push(newNode);
                path.push(newNode.id);
                break;
            }
            currentId = tree[idx].left;
        } else {
            if (!tree[idx].right) {
                const newNode: TreeNodeData = {
                    id: `node-${generateId()}`, value, state: 'ACCESS',
                    x: 0, y: 0, isVisible: true, auxiliary: { height: 1 }
                };
                tree[idx].right = newNode.id;
                tree.push(newNode);
                path.push(newNode.id);
                break;
            }
            currentId = tree[idx].right;
        }
    }
    
    recalculateCoordinates(tree, rootId, 50, 40, 0);
    
    const insertedIdx = tree.findIndex(n => n.id === path[path.length - 1]);
    yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Inserted ${value}. Now rebalancing...`, codeLine: 5, auxiliary: { code: 'INSERT' } };
    tree[insertedIdx].state = 'DEFAULT';

    // B2: Backtrack and Rebalance
    for (let i = path.length - 2; i >= 0; i--) {
        const nodeId = path[i];
        let idx = tree.findIndex(n => n.id === nodeId);
        
        updateHeight(tree, nodeId);
        let balance = getBalance(tree, nodeId);
        
        tree[idx].state = 'ACCESS';
        yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Checking balance of Node ${tree[idx].value}. Balance = ${balance}`, codeLine: 12, auxiliary: { code: 'INSERT' } };
        
        if (balance > 1) { // Left Heavy
            const leftChild = tree.find(n => n.id === tree[idx].left);
            if (value < (leftChild?.value as number)) { // Left Left
                yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Left-Left case. Right Rotating...`, codeLine: 15, auxiliary: { code: 'INSERT' } };
                // Right Rotate
                const newRootId = rightRotate(tree, nodeId);
                if (i === 0) rootId = newRootId;
                else {
                    const parentIdx = tree.findIndex(n => n.id === path[i-1]);
                    if (tree[parentIdx].left === nodeId) tree[parentIdx].left = newRootId;
                    else tree[parentIdx].right = newRootId;
                }
            } else { // Left Right
                yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Left-Right case. Left-Right Rotating...`, codeLine: 19, auxiliary: { code: 'INSERT' } };
                tree[idx].left = leftRotate(tree, tree[idx].left as string);
                const newRootId = rightRotate(tree, nodeId);
                if (i === 0) rootId = newRootId;
                else {
                    const parentIdx = tree.findIndex(n => n.id === path[i-1]);
                    if (tree[parentIdx].left === nodeId) tree[parentIdx].left = newRootId;
                    else tree[parentIdx].right = newRootId;
                }
            }
            recalculateCoordinates(tree, rootId, 50, 40, 0);
            yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Rotation done.`, codeLine: 16, auxiliary: { code: 'ROTATE_RIGHT' } };
        } else if (balance < -1) { // Right Heavy
            const rightChild = tree.find(n => n.id === tree[idx].right);
            if (value > (rightChild?.value as number)) { // Right Right
                yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Right-Right case. Left Rotating...`, codeLine: 17, auxiliary: { code: 'INSERT' } };
                const newRootId = leftRotate(tree, nodeId);
                if (i === 0) rootId = newRootId;
                else {
                    const parentIdx = tree.findIndex(n => n.id === path[i-1]);
                    if (tree[parentIdx].left === nodeId) tree[parentIdx].left = newRootId;
                    else tree[parentIdx].right = newRootId;
                }
            } else { // Right Left
                yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Right-Left case. Right-Left Rotating...`, codeLine: 22, auxiliary: { code: 'INSERT' } };
                tree[idx].right = rightRotate(tree, tree[idx].right as string);
                const newRootId = leftRotate(tree, nodeId);
                if (i === 0) rootId = newRootId;
                else {
                    const parentIdx = tree.findIndex(n => n.id === path[i-1]);
                    if (tree[parentIdx].left === nodeId) tree[parentIdx].left = newRootId;
                    else tree[parentIdx].right = newRootId;
                }
            }
            recalculateCoordinates(tree, rootId, 50, 40, 0);
            yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Rotation done.`, codeLine: 23, auxiliary: { code: 'ROTATE_LEFT' } };
        }

        // Must re-find idx because positions might have changed
        idx = tree.findIndex(n => n.id === nodeId);
        if (idx !== -1) tree[idx].state = 'DEFAULT';
    }

    yield { arrayState: [], treeState: tree, message: `Done.` };
}

function rightRotate(tree: TreeNodeData[], yId: string): string {
    const yIdx = tree.findIndex(n => n.id === yId);
    const xId = tree[yIdx].left as string;
    const xIdx = tree.findIndex(n => n.id === xId);
    
    const T2Id = tree[xIdx].right;
    
    tree[xIdx].right = yId;
    tree[yIdx].left = T2Id;
    
    updateHeight(tree, yId);
    updateHeight(tree, xId);
    
    return xId;
}

function leftRotate(tree: TreeNodeData[], xId: string): string {
    const xIdx = tree.findIndex(n => n.id === xId);
    const yId = tree[xIdx].right as string;
    const yIdx = tree.findIndex(n => n.id === yId);
    
    const T2Id = tree[yIdx].left;
    
    tree[yIdx].left = xId;
    tree[xIdx].right = T2Id;
    
    updateHeight(tree, xId);
    updateHeight(tree, yId);
    
    return yId;
}
