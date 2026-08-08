import { TreeNodeData, DSAnimationStep } from './types';

const generateId = () => Math.random().toString(36).substr(2, 9);

export function* generateBSTInsert(
    currentTree: TreeNodeData[],
    value: number
): Generator<DSAnimationStep> {
    let tree = JSON.parse(JSON.stringify(currentTree)) as TreeNodeData[];
    
    if (tree.length === 0) {
        yield { arrayState: [], treeState: tree, message: "Tree is empty. Creating root node.", codeLine: 2 };
        const newNode: TreeNodeData = {
            id: `root-${generateId()}`,
            value,
            state: 'ACCESS',
            x: 50,
            y: 40,
            isVisible: true
        };
        tree.push(newNode);
        yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Inserted ${value} as root.`, codeLine: 3 };
        tree[0].state = 'DEFAULT';
        return;
    }

    let currentIdx = tree.findIndex(n => !n.isVisible === false && n.y === 40); // Root is at y=40, or we can track root id
    if (currentIdx === -1) currentIdx = 0; // fallback

    let depth = 0;
    let parentIdx = -1;
    let isLeft = false;

    yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Starting insertion of ${value}...`, codeLine: 1 };

    while (currentIdx !== -1) {
        tree[currentIdx].state = 'SELECTED';
        yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Comparing ${value} with ${tree[currentIdx].value}...`, codeLine: 4 };
        
        if (value === tree[currentIdx].value) {
            tree[currentIdx].state = 'FOUND';
            yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Value ${value} already exists in BST!`, codeLine: 4 };
            tree[currentIdx].state = 'DEFAULT';
            return;
        }

        parentIdx = currentIdx;
        let nextId = undefined;
        
        if (value < (tree[currentIdx].value as number)) {
            nextId = tree[currentIdx].left;
            isLeft = true;
            yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `${value} < ${tree[currentIdx].value}. Going left.`, codeLine: 5 };
        } else {
            nextId = tree[currentIdx].right;
            isLeft = false;
            yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `${value} > ${tree[currentIdx].value}. Going right.`, codeLine: 7 };
        }

        tree[currentIdx].state = 'DEFAULT';
        
        if (nextId) {
            currentIdx = tree.findIndex(n => n.id === nextId);
            depth++;
        } else {
            currentIdx = -1; // Found insertion point
        }
    }

    // Insert new node
    const parentNode = tree[parentIdx];
    const offset = 25 / Math.pow(2, depth);
    const newNode: TreeNodeData = {
        id: `node-${generateId()}`,
        value,
        state: 'ACCESS',
        x: isLeft ? parentNode.x - offset : parentNode.x + offset,
        y: parentNode.y + 70,
        isVisible: true
    };
    
    if (isLeft) {
        parentNode.left = newNode.id;
    } else {
        parentNode.right = newNode.id;
    }
    
    tree.push(newNode);
    yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Inserted ${value}.`, codeLine: 8 };
    
    tree[tree.length - 1].state = 'DEFAULT';
    yield { arrayState: [], treeState: tree, message: `Done.` };
}

export function* generateBSTSearch(
    currentTree: TreeNodeData[],
    value: number
): Generator<DSAnimationStep> {
    let tree = JSON.parse(JSON.stringify(currentTree)) as TreeNodeData[];
    
    if (tree.length === 0) {
        yield { arrayState: [], treeState: tree, message: "Tree is empty.", codeLine: 2 };
        return;
    }

    let currentIdx = tree.findIndex(n => n.y === 40); 
    if (currentIdx === -1) currentIdx = 0; 

    yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Starting search for ${value}...`, codeLine: 1 };

    while (currentIdx !== -1) {
        tree[currentIdx].state = 'ACCESS';
        yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Checking node ${tree[currentIdx].value}...`, codeLine: 2 };
        
        if (value === tree[currentIdx].value) {
            tree[currentIdx].state = 'FOUND';
            yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Found ${value}!`, codeLine: 3 };
            tree[currentIdx].state = 'DEFAULT';
            return;
        }

        tree[currentIdx].state = 'SELECTED';
        let nextId = undefined;
        
        if (value < (tree[currentIdx].value as number)) {
            nextId = tree[currentIdx].left;
            yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `${value} < ${tree[currentIdx].value}. Going left.`, codeLine: 4 };
        } else {
            nextId = tree[currentIdx].right;
            yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `${value} > ${tree[currentIdx].value}. Going right.`, codeLine: 5 };
        }

        tree[currentIdx].state = 'DEFAULT';
        
        if (nextId) {
            currentIdx = tree.findIndex(n => n.id === nextId);
        } else {
            break;
        }
    }

    yield { arrayState: [], treeState: tree, message: `Value ${value} not found.`, codeLine: 6 };
}
