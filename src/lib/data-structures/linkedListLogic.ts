import { ArrayNode, DSAnimationStep } from './types';

// Helper: Random Address
const randomAddr = () => `0x${Math.floor(Math.random() * 0xFFF).toString(16).toUpperCase().padStart(3, '0')}`;

const createLLNode = (value: number, nextPtr: string = 'NULL'): ArrayNode => {
    return {
        id: `node-${Math.random().toString(36).substr(2, 9)}`,
        index: 0,
        value: value,
        address: randomAddr(),
        state: 'DEFAULT',
        isVisible: true,
        // Lưu trữ pointer thủ công để visual
        auxiliary: { next: nextPtr } 
    };
};

// Hàm này chỉ dùng để init mảng ban đầu cho đúng
export const initLinkedList = (values: number[]): ArrayNode[] => {
    const nodes = values.map(v => createLLNode(v));
    // Link các node với nhau ban đầu
    for(let i=0; i<nodes.length; i++) {
        nodes[i].index = i;
        const nextAddr = (i < nodes.length - 1) ? nodes[i+1].address : 'NULL';
        nodes[i].auxiliary = { next: nextAddr };
    }
    return nodes;
};

// --- 1. SEARCH (Giữ nguyên logic duyệt) ---
export function* generateLLSearch(nodes: ArrayNode[], value: number): Generator<DSAnimationStep> {
    const list = JSON.parse(JSON.stringify(nodes));
    
    for (let i = 0; i < list.length; i++) {
        list[i].state = 'ACCESS';
        yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Visiting Node at address ${list[i].address}. Value: ${list[i].value}`, codeLine: 4 };

        if (list[i].value === value) {
            list[i].state = 'FOUND';
            yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Found value ${value} at index ${i}!`, codeLine: 5 };
            return;
        }
        list[i].state = 'DEFAULT';
    }
    yield { arrayState: list, message: `Value ${value} not found.`, codeLine: 8 };
}

// --- 2. INSERT HEAD ---
export function* generateLLInsertHead(nodes: ArrayNode[], value: number): Generator<DSAnimationStep> {
    let list = JSON.parse(JSON.stringify(nodes));
    const oldHead = list[0];
    
    // B1: Tạo node mới
    const newNode = createLLNode(value, 'NULL'); 
    newNode.state = 'SELECTED';
    
    // Visual: Đưa vào đầu mảng nhưng chưa nối
    list.unshift(newNode);
    // Cập nhật lại index cho đẹp
    list.forEach((n: any, i: number) => n.index = i);

    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Created NewNode(${value}) at ${newNode.address}.`, codeLine: 2 };

    // B2: newNode.next = head
    newNode.auxiliary = { next: oldHead ? oldHead.address : 'NULL' }; // Trỏ vào Head cũ
    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Step 1: Link NewNode.next -> Old Head (${oldHead?.address}).`, codeLine: 3 };

    // B3: head = newNode (Visual highlight)
    newNode.state = 'ACCESS'; // New Head
    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Step 2: Update Head pointer to NewNode.`, codeLine: 4 };

    newNode.state = 'DEFAULT';
    yield { arrayState: list, message: "Insertion Complete." };
}

// --- 3. INSERT TAIL ---
export function* generateLLInsertTail(nodes: ArrayNode[], value: number): Generator<DSAnimationStep> {
    let list = JSON.parse(JSON.stringify(nodes));
    
    if (list.length === 0) {
        yield* generateLLInsertHead(nodes, value);
        return;
    }

    // B1: Traverse
    for (let i = 0; i < list.length; i++) {
        list[i].state = 'ACCESS';
        yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Traversing... Current: ${list[i].address}`, codeLine: 6 };
        if (i < list.length - 1) list[i].state = 'DEFAULT';
    }

    // B2: Create Node
    const lastNode = list[list.length - 1];
    const newNode = createLLNode(value, 'NULL');
    newNode.state = 'SELECTED';
    newNode.index = list.length;
    
    // Đưa vào mảng visual
    list.push(newNode);

    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Reached Tail. Created NewNode(${value}) at ${newNode.address}.`, codeLine: 7 };

    // B3: Link current.next = newNode
    lastNode.state = 'SHIFTING'; // Đang thay đổi pointer
    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Preparing to link LastNode -> NewNode...`, codeLine: 8 };

    // Thực hiện nối dây
    lastNode.auxiliary = { next: newNode.address };
    lastNode.state = 'ACCESS'; // Link xong
    
    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Linked: LastNode(${lastNode.address}).next is now ${newNode.address}.`, codeLine: 8 };

    list.forEach((n:any) => n.state = 'DEFAULT');
    yield { arrayState: list, message: "Insertion Complete." };
}

// --- 4. INSERT INDEX (CHI TIẾT NHẤT) ---
export function* generateLLInsertIndex(nodes: ArrayNode[], index: number, value: number): Generator<DSAnimationStep> {
    let list = JSON.parse(JSON.stringify(nodes));

    if (index <= 0) { yield* generateLLInsertHead(nodes, value); return; }
    if (index >= list.length) { yield* generateLLInsertTail(nodes, value); return; }

    // B1: Traverse đến node trước vị trí chèn (prevNode)
    for (let i = 0; i < index - 1; i++) {
        list[i].state = 'ACCESS';
        yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Traversing to find index ${index-1}...`, codeLine: 4 };
        list[i].state = 'DEFAULT';
    }

    const prevNode = list[index - 1];
    const nextNode = list[index]; // Node hiện tại đang ở vị trí đó
    prevNode.state = 'SELECTED'; // Node đứng trước (Prev)
    
    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Stopped at PrevNode (Addr: ${prevNode.address}).`, codeLine: 5 };

    // B2: Tạo Node mới
    const newNode = createLLNode(value, 'NULL'); 
    newNode.state = 'SHIFTING'; // Màu tím để nổi bật node mới
    
    // Visual trick: Chèn vào mảng để hiển thị vị trí, nhưng chưa nối dây
    list.splice(index, 0, newNode);
    // Re-index visually
    list.forEach((n: any, i: number) => n.index = i);

    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Create NewNode(${value}) at ${newNode.address}.`, codeLine: 6 };

    // B3: GẮN DÂY 1: NewNode.next = PrevNode.next (tức là NextNode)
    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Step 1: Set NewNode.next = ${nextNode.address} (The node after).`, codeLine: 7 };
    
    newNode.auxiliary = { next: nextNode.address }; // Cập nhật text pointer
    
    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `NewNode now points to ${nextNode.address}.`, codeLine: 7 };

    // B4: GẮN DÂY 2: PrevNode.next = NewNode
    prevNode.state = 'SHIFTING'; // Prev đổi màu chuẩn bị đổi dây
    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Step 2: Break link from PrevNode. Point PrevNode to NewNode (${newNode.address}).`, codeLine: 8 };

    prevNode.auxiliary = { next: newNode.address }; // Cập nhật text pointer của Prev
    prevNode.state = 'ACCESS'; // Xong
    newNode.state = 'ACCESS'; // Xong

    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Link established: ${prevNode.address} -> ${newNode.address} -> ${nextNode.address}.`, codeLine: 8 };

    list.forEach((n:any) => n.state = 'DEFAULT');
    yield { arrayState: list, message: "Insertion Complete." };
}

// --- 5. DELETE INDEX ---
export function* generateLLDeleteIndex(nodes: ArrayNode[], index: number): Generator<DSAnimationStep> {
    let list = JSON.parse(JSON.stringify(nodes));

    if (index < 0 || index >= list.length) return;

    if (index === 0) {
        // Delete Head
        const head = list[0];
        const next = list[1];
        head.state = 'DELETED';
        yield { arrayState: JSON.parse(JSON.stringify(list)), message: "Mark Head node for deletion.", codeLine: 2 };
        
        yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Head pointer moved to ${next ? next.address : 'NULL'}.`, codeLine: 3 };
        
        list.shift(); // Xóa khỏi mảng visual
        list.forEach((n: any, i: number) => n.index = i);
        
        yield { arrayState: list, message: "Old Head deleted.", codeLine: 4 };
        return;
    }

    // Traverse
    for (let i = 0; i < index - 1; i++) {
        list[i].state = 'ACCESS';
        yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Traversing...`, codeLine: 4 };
        list[i].state = 'DEFAULT';
    }

    const prevNode = list[index - 1];
    const nodeToDelete = list[index];
    const nodeAfter = list[index + 1];

    prevNode.state = 'SELECTED'; // Node đứng trước
    nodeToDelete.state = 'DELETED'; // Node cần xóa
    
    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Found Node to delete at ${nodeToDelete.address}. PrevNode is ${prevNode.address}.`, codeLine: 6 };

    // NGẮT DÂY: PrevNode.next = NodeToDelete.next
    prevNode.state = 'SHIFTING'; // Đang thao tác
    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `Bypassing: Change PrevNode.next to skip ${nodeToDelete.address}.`, codeLine: 8 };

    // Cập nhật pointer visual của Prev trỏ thẳng tới nodeAfter
    prevNode.auxiliary = { next: nodeAfter ? nodeAfter.address : 'NULL' };

    yield { arrayState: JSON.parse(JSON.stringify(list)), message: `PrevNode now points to ${nodeAfter ? nodeAfter.address : 'NULL'}. Link broken.`, codeLine: 8 };

    // Xóa node
    list.splice(index, 1);
    list.forEach((n: any, i: number) => n.index = i); // Re-index visual
    prevNode.state = 'ACCESS';

    yield { arrayState: list, message: `Node removed from memory.`, codeLine: 9 };
    
    list.forEach((n:any) => n.state = 'DEFAULT');
}