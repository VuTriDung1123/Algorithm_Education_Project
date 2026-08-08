import { TreeNodeData, DSAnimationStep } from './types';

const generateId = () => Math.random().toString(36).substr(2, 9);

function recalculateTrie(tree: TreeNodeData[], rootId: string, leftBound: number, rightBound: number, depth: number) {
    const rootIdx = tree.findIndex(n => n.id === rootId);
    if (rootIdx === -1) return;
    
    tree[rootIdx].x = (leftBound + rightBound) / 2;
    tree[rootIdx].y = 40 + depth * 70;
    
    const children = tree[rootIdx].children || [];
    if (children.length > 0) {
        // Sort children alphabetically by their value for standard Trie look
        children.sort((a, b) => {
            const valA = tree.find(n => n.id === a)?.value as string || '';
            const valB = tree.find(n => n.id === b)?.value as string || '';
            return valA.localeCompare(valB);
        });
        tree[rootIdx].children = children; // save sorted back
        
        const segment = (rightBound - leftBound) / children.length;
        children.forEach((childId, i) => {
            recalculateTrie(tree, childId, leftBound + i * segment, leftBound + (i + 1) * segment, depth + 1);
        });
    }
}

export function* generateTrieInsert(
    currentTree: TreeNodeData[],
    word: string
): Generator<DSAnimationStep> {
    let tree = JSON.parse(JSON.stringify(currentTree)) as TreeNodeData[];
    
    if (tree.length === 0) {
        tree.push({
            id: `root`,
            value: `*`,
            state: 'DEFAULT',
            x: 50,
            y: 40,
            children: [],
            isVisible: true
        });
    }

    yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Inserting word: "${word}"`, codeLine: 1 };
    
    let currentId = 'root';
    tree.find(n => n.id === currentId)!.state = 'SELECTED';

    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Checking character '${char}'...`, codeLine: 3 };
        
        const currIdx = tree.findIndex(n => n.id === currentId);
        const childrenIds = tree[currIdx].children || [];
        
        let foundChildId: string | null = null;
        for (const childId of childrenIds) {
            if (tree.find(n => n.id === childId)?.value === char) {
                foundChildId = childId;
                break;
            }
        }
        
        tree[currIdx].state = 'DEFAULT';

        if (foundChildId) {
            yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `'${char}' exists. Moving to next node.`, codeLine: 6 };
            currentId = foundChildId;
            tree.find(n => n.id === currentId)!.state = 'SELECTED';
        } else {
            yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `'${char}' not found. Creating new node.`, codeLine: 4 };
            const newNode: TreeNodeData = {
                id: `node-${generateId()}`,
                value: char,
                state: 'ACCESS',
                x: 0, y: 0,
                children: [],
                isVisible: true
            };
            tree.push(newNode);
            tree[currIdx].children!.push(newNode.id);
            
            recalculateTrie(tree, 'root', 0, 100, 0);
            yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Node '${char}' created.`, codeLine: 5 };
            
            newNode.state = 'DEFAULT';
            currentId = newNode.id;
            tree.find(n => n.id === currentId)!.state = 'SELECTED';
        }
    }
    
    const finalIdx = tree.findIndex(n => n.id === currentId);
    tree[finalIdx].auxiliary = { ...tree[finalIdx].auxiliary, isEnd: true };
    tree[finalIdx].state = 'FOUND';
    
    yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Finished inserting "${word}". Marked as EndOfWord.`, codeLine: 7 };
    tree[finalIdx].state = 'DEFAULT';
    yield { arrayState: [], treeState: tree, message: "Done." };
}

export function* generateTrieSearch(
    currentTree: TreeNodeData[],
    word: string
): Generator<DSAnimationStep> {
    let tree = JSON.parse(JSON.stringify(currentTree)) as TreeNodeData[];
    
    if (tree.length === 0) {
        yield { arrayState: [], treeState: tree, message: "Trie is empty.", codeLine: 2 };
        return;
    }

    yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Searching for word: "${word}"`, codeLine: 1 };
    
    let currentId = 'root';
    tree.find(n => n.id === currentId)!.state = 'SELECTED';

    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Checking character '${char}'...`, codeLine: 3 };
        
        const currIdx = tree.findIndex(n => n.id === currentId);
        const childrenIds = tree[currIdx].children || [];
        
        let foundChildId: string | null = null;
        for (const childId of childrenIds) {
            if (tree.find(n => n.id === childId)?.value === char) {
                foundChildId = childId;
                break;
            }
        }
        
        tree[currIdx].state = 'DEFAULT';

        if (foundChildId) {
            yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `'${char}' found. Moving down.`, codeLine: 6 };
            currentId = foundChildId;
            tree.find(n => n.id === currentId)!.state = 'SELECTED';
        } else {
            tree.find(n => n.id === currentId)!.state = 'DELETED';
            yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `'${char}' not found. Word does not exist.`, codeLine: 5 };
            tree.find(n => n.id === currentId)!.state = 'DEFAULT';
            return;
        }
    }
    
    const finalIdx = tree.findIndex(n => n.id === currentId);
    if (tree[finalIdx].auxiliary?.isEnd) {
        tree[finalIdx].state = 'FOUND';
        yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Found end of word marker! Word "${word}" exists.`, codeLine: 7 };
    } else {
        tree[finalIdx].state = 'DELETED';
        yield { arrayState: [], treeState: JSON.parse(JSON.stringify(tree)), message: `Reached end of search, but no EndOfWord marker. "${word}" is just a prefix.`, codeLine: 7 };
    }
    
    tree[finalIdx].state = 'DEFAULT';
    yield { arrayState: [], treeState: tree, message: "Done." };
}
