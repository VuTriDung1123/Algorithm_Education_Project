import { ArrayNode, DSAnimationStep } from './types';

const generateId = () => Math.random().toString(36).substr(2, 9);
const START_ADDRESS = 0x4000;

export const createEmptyDeque = (capacity: number): ArrayNode[] => {
    return Array.from({ length: capacity }, (_, i) => ({
        id: `dnode-${i}-${generateId()}`,
        index: i,
        value: null,
        address: `0x${(START_ADDRESS + i * 4).toString(16).toUpperCase()}`,
        state: 'DEFAULT',
        isVisible: true
    }));
};

const isFull = (front: number, rear: number, capacity: number) => {
    return (front === 0 && rear === capacity - 1) || (front === rear + 1);
};

export function* generateDequeInsertFront(
    currentArray: ArrayNode[],
    value: number,
    front: number,
    rear: number,
    capacity: number
): Generator<DSAnimationStep> {
    let arr = JSON.parse(JSON.stringify(currentArray));
    
    if (isFull(front, rear, capacity)) {
        yield { arrayState: arr, message: "Deque Overflow! Cannot insert.", codeLine: 3 };
        return;
    }

    yield { arrayState: arr, message: "Checking if deque is full...", codeLine: 2 };
    
    let newFront = front;
    let newRear = rear;
    
    if (front === -1) {
        newFront = 0;
        newRear = 0;
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `First element, setting front=0, rear=0.`, codeLine: 7 };
    } else if (front === 0) {
        newFront = capacity - 1;
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Wrap around, setting front=${newFront}.`, codeLine: 9 };
    } else {
        newFront = front - 1;
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Decrementing front to ${newFront}.`, codeLine: 11 };
    }

    arr[newFront].state = 'SELECTED';
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Accessing index ${newFront}.`, codeLine: 12 };

    arr[newFront].value = value;
    arr[newFront].state = 'ACCESS';
    arr[newFront].id = generateId(); 
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Inserted ${value} at front = ${newFront}.`, codeLine: 12 };

    arr[newFront].state = 'DEFAULT';
    // State will be updated externally with returned front, rear in auxiliary
    yield { arrayState: arr, message: `Done.`, auxiliary: { front: newFront, rear: newRear } };
}

export function* generateDequeInsertRear(
    currentArray: ArrayNode[],
    value: number,
    front: number,
    rear: number,
    capacity: number
): Generator<DSAnimationStep> {
    let arr = JSON.parse(JSON.stringify(currentArray));
    
    if (isFull(front, rear, capacity)) {
        yield { arrayState: arr, message: "Deque Overflow! Cannot insert.", codeLine: 3 };
        return;
    }

    yield { arrayState: arr, message: "Checking if deque is full...", codeLine: 2 };
    
    let newFront = front;
    let newRear = rear;
    
    if (front === -1) {
        newFront = 0;
        newRear = 0;
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `First element, setting front=0, rear=0.`, codeLine: 7 };
    } else if (rear === capacity - 1) {
        newRear = 0;
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Wrap around, setting rear=0.`, codeLine: 9 };
    } else {
        newRear = rear + 1;
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Incrementing rear to ${newRear}.`, codeLine: 11 };
    }

    arr[newRear].state = 'SELECTED';
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Accessing index ${newRear}.`, codeLine: 12 };

    arr[newRear].value = value;
    arr[newRear].state = 'ACCESS';
    arr[newRear].id = generateId(); 
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Inserted ${value} at rear = ${newRear}.`, codeLine: 12 };

    arr[newRear].state = 'DEFAULT';
    yield { arrayState: arr, message: `Done.`, auxiliary: { front: newFront, rear: newRear } };
}

export function* generateDequeDeleteFront(
    currentArray: ArrayNode[],
    front: number,
    rear: number,
    capacity: number
): Generator<DSAnimationStep> {
    let arr = JSON.parse(JSON.stringify(currentArray));
    
    if (front === -1) {
        yield { arrayState: arr, message: "Deque Underflow! Cannot delete.", codeLine: 3 };
        return;
    }

    yield { arrayState: arr, message: "Checking if deque is empty...", codeLine: 2 };

    arr[front].state = 'SELECTED';
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Accessing value at front = ${front}: ${arr[front].value}.`, codeLine: 4 };

    arr[front].state = 'DELETED';
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Deleting value ${arr[front].value}...`, codeLine: 5 };

    arr[front].value = null;
    arr[front].state = 'DEFAULT';
    
    let newFront = front;
    let newRear = rear;

    if (front === rear) {
        newFront = -1;
        newRear = -1;
        yield { arrayState: arr, message: `Only one element was left. Deque is now empty.`, codeLine: 7 };
    } else if (front === capacity - 1) {
        newFront = 0;
        yield { arrayState: arr, message: `Wrap around, setting front to 0.`, codeLine: 9 };
    } else {
        newFront = front + 1;
        yield { arrayState: arr, message: `Incrementing front to ${newFront}.`, codeLine: 11 };
    }

    yield { arrayState: arr, message: `Done.`, auxiliary: { front: newFront, rear: newRear } };
}

export function* generateDequeDeleteRear(
    currentArray: ArrayNode[],
    front: number,
    rear: number,
    capacity: number
): Generator<DSAnimationStep> {
    let arr = JSON.parse(JSON.stringify(currentArray));
    
    if (front === -1) {
        yield { arrayState: arr, message: "Deque Underflow! Cannot delete.", codeLine: 3 };
        return;
    }

    yield { arrayState: arr, message: "Checking if deque is empty...", codeLine: 2 };

    arr[rear].state = 'SELECTED';
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Accessing value at rear = ${rear}: ${arr[rear].value}.`, codeLine: 4 };

    arr[rear].state = 'DELETED';
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Deleting value ${arr[rear].value}...`, codeLine: 5 };

    arr[rear].value = null;
    arr[rear].state = 'DEFAULT';
    
    let newFront = front;
    let newRear = rear;

    if (front === rear) {
        newFront = -1;
        newRear = -1;
        yield { arrayState: arr, message: `Only one element was left. Deque is now empty.`, codeLine: 7 };
    } else if (rear === 0) {
        newRear = capacity - 1;
        yield { arrayState: arr, message: `Wrap around, setting rear to ${newRear}.`, codeLine: 9 };
    } else {
        newRear = rear - 1;
        yield { arrayState: arr, message: `Decrementing rear to ${newRear}.`, codeLine: 11 };
    }

    yield { arrayState: arr, message: `Done.`, auxiliary: { front: newFront, rear: newRear } };
}
