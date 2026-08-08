import { ArrayNode, DSAnimationStep } from './types';

const randomAddr = () => `0x${Math.floor(Math.random() * 0xFFF).toString(16).toUpperCase().padStart(3, '0')}`;

const createDLLNode = (value: number, nextPtr: string = 'NULL', prevPtr: string = 'NULL'): ArrayNode => {
    return {
        id: `dnode-${Math.random().toString(36).substr(2, 9)}`,
        index: 0,
        value: value,
        address: randomAddr(),
        state: 'DEFAULT',
        isVisible: true,
        auxiliary: { next: nextPtr, prev: prevPtr } 
    };
};

export const initDoublyLinkedList = (values: number[]): ArrayNode[] => {
    const nodes = values.map(v => createDLLNode(v));
    for(let i=0; i<nodes.length; i++) {
        nodes[i].index = i;
        const nextAddr = (i < nodes.length - 1) ? nodes[i+1].address : 'NULL';
        const prevAddr = (i > 0) ? nodes[i-1].address : 'NULL';
        nodes[i].auxiliary = { next: nextAddr, prev: prevAddr };
    }
    return nodes;
};

// 1. SEARCH
export function* generateDLLSearch(nodes: ArrayNode[], value: number): Generator<DSAnimationStep> {
    const list = JSON.parse(JSON.stringify(nodes));
    for (let i = 0; i < list.length; i++) {
        list[i].state = 'ACCESS';
        yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Visiting Node at ${list[i].address}. Value: ${list[i].value}`, codeLine: 4 };
        if (list[i].value === value) {
            list[i].state = 'FOUND';
            yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Found value ${value} at index ${i}!`, codeLine: 5 };
            return;
        }
        list[i].state = 'DEFAULT';
    }
    yield { arrayState: list, message: `Value ${value} not found.`, codeLine: 8 };
}

// 2. INSERT HEAD
export function* generateDLLInsertHead(nodes: ArrayNode[], value: number): Generator<DSAnimationStep> {
    const list = JSON.parse(JSON.stringify(nodes));
    const oldHead = list.length > 0 ? list[0] : null;
    
    const newNode = createDLLNode(value, oldHead ? oldHead.address : 'NULL', 'NULL'); 
    newNode.state = 'SELECTED';
    
    list.unshift(newNode);
    list.forEach((n: any, i: number) => n.index = i);

    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Create NewNode(${value}). next -> Old Head (${oldHead?.address || 'NULL'})`, codeLine: 3 };

    if (oldHead) {
        oldHead.state = 'SHIFTING';
        oldHead.auxiliary = { ...oldHead.auxiliary, prev: newNode.address };
        yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Update Old Head's prev pointer -> NewNode (${newNode.address}).`, codeLine: 5 };
        oldHead.state = 'DEFAULT';
    }

    newNode.state = 'ACCESS';
    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Update Head to NewNode.`, codeLine: 6 };

    newNode.state = 'DEFAULT';
    yield { arrayState: list, message: "Insertion Complete." };
}

// 3. INSERT TAIL
export function* generateDLLInsertTail(nodes: ArrayNode[], value: number): Generator<DSAnimationStep> {
    const list = JSON.parse(JSON.stringify(nodes));
    if (list.length === 0) { yield* generateDLLInsertHead(nodes, value); return; }

    for (let i = 0; i < list.length; i++) {
        list[i].state = 'ACCESS';
        yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Traversing... Current: ${list[i].address}`, codeLine: 8 };
        if (i < list.length - 1) list[i].state = 'DEFAULT';
    }

    const lastNode = list[list.length - 1];
    const newNode = createDLLNode(value, 'NULL', lastNode.address);
    newNode.state = 'SELECTED';
    list.push(newNode);
    list.forEach((n: any, i: number) => n.index = i);

    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Created NewNode(${value}). Prev -> ${lastNode.address}`, codeLine: 11 };

    lastNode.state = 'SHIFTING';
    lastNode.auxiliary = { ...lastNode.auxiliary, next: newNode.address };
    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `LastNode.next -> NewNode (${newNode.address}).`, codeLine: 10 };

    lastNode.state = 'DEFAULT'; newNode.state = 'DEFAULT';
    yield { arrayState: list, message: "Insertion Complete." };
}

// 4. INSERT INDEX
export function* generateDLLInsertIndex(nodes: ArrayNode[], index: number, value: number): Generator<DSAnimationStep> {
    const list = JSON.parse(JSON.stringify(nodes));
    if (index <= 0) { yield* generateDLLInsertHead(nodes, value); return; }
    if (index >= list.length) { yield* generateDLLInsertTail(nodes, value); return; }

    for (let i = 0; i < index - 1; i++) {
        list[i].state = 'ACCESS';
        yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Traversing to index ${index-1}...`, codeLine: 6 };
        list[i].state = 'DEFAULT';
    }

    const current = list[index - 1];
    const nextNode = list[index]; 
    current.state = 'SELECTED';
    
    const newNode = createDLLNode(value, nextNode.address, current.address); 
    newNode.state = 'SHIFTING';
    list.splice(index, 0, newNode);
    list.forEach((n: any, i: number) => n.index = i);

    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `NewNode points: next->${nextNode.address}, prev->${current.address}`, codeLine: 10 };

    if (nextNode) {
        nextNode.state = 'SHIFTING';
        nextNode.auxiliary = { ...nextNode.auxiliary, prev: newNode.address };
        yield { arrayState: JSON.parse(JSON.stringify(list)), message: `NextNode.prev -> NewNode`, codeLine: 12 };
        nextNode.state = 'DEFAULT';
    }

    current.state = 'SHIFTING';
    current.auxiliary = { ...current.auxiliary, next: newNode.address };
    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Current.next -> NewNode`, codeLine: 13 };

    list.forEach((n:any) => n.state = 'DEFAULT');
    yield { arrayState: list, message: "Insertion Complete." };
}

// 5. DELETE INDEX
export function* generateDLLDeleteIndex(nodes: ArrayNode[], index: number): Generator<DSAnimationStep> {
    const list = JSON.parse(JSON.stringify(nodes));
    if (index < 0 || index >= list.length) return;

    if (index === 0) {
        const head = list[0];
        const next = list[1];
        head.state = 'DELETED';
        yield { arrayState: JSON.parse(JSON.stringify(list)), message: "Mark Head for deletion.", codeLine: 3 };
        
        if (next) {
            next.state = 'SHIFTING';
            next.auxiliary = { ...next.auxiliary, prev: 'NULL' };
            yield { arrayState: JSON.parse(JSON.stringify(list)), message: "New Head's prev -> NULL", codeLine: 6 };
            next.state = 'DEFAULT';
        }
        list.shift();
        list.forEach((n: any, i: number) => n.index = i);
        yield { arrayState: list, message: "Old Head deleted.", codeLine: 7 };
        return;
    }

    for (let i = 0; i <= index; i++) {
        list[i].state = 'ACCESS';
        yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Traversing...`, codeLine: 5 };
        if(i < index) list[i].state = 'DEFAULT';
    }

    const current = list[index];
    const prevNode = list[index - 1];
    const nextNode = list[index + 1];

    current.state = 'DELETED';
    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Node to delete found at index ${index}.`, codeLine: 8 };

    prevNode.state = 'SHIFTING';
    prevNode.auxiliary = { ...prevNode.auxiliary, next: nextNode ? nextNode.address : 'NULL' };
    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `PrevNode.next -> ${nextNode ? nextNode.address : 'NULL'}`, codeLine: 8 };
    prevNode.state = 'DEFAULT';

    if (nextNode) {
        nextNode.state = 'SHIFTING';
        nextNode.auxiliary = { ...nextNode.auxiliary, prev: prevNode.address };
        yield { arrayState: JSON.parse(JSON.stringify(list)), message: `NextNode.prev -> ${prevNode.address}`, codeLine: 10 };
        nextNode.state = 'DEFAULT';
    }

    list.splice(index, 1);
    list.forEach((n: any, i: number) => n.index = i);
    yield { arrayState: list, message: "Node deleted.", codeLine: 11 };
}