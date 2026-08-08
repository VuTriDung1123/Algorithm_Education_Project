import { ArrayNode, DSAnimationStep } from './types';

const generateId = () => Math.random().toString(36).substr(2, 9);
const START_ADDRESS = 0x3000;

export const createEmptyQueue = (capacity: number): ArrayNode[] => {
    return Array.from({ length: capacity }, (_, i) => ({
        id: `qnode-${i}-${generateId()}`,
        index: i,
        value: null,
        address: `0x${(START_ADDRESS + i * 4).toString(16).toUpperCase()}`,
        state: 'DEFAULT',
        isVisible: true
    }));
};

export function* generateQueueEnqueue(
    currentArray: ArrayNode[],
    value: number,
    front: number,
    rear: number,
    capacity: number
): Generator<DSAnimationStep> {
    let arr = JSON.parse(JSON.stringify(currentArray));
    
    if (rear >= capacity - 1) {
        yield { arrayState: arr, message: "Queue Overflow! Cannot enqueue.", codeLine: 3 };
        return;
    }

    yield { arrayState: arr, message: "Checking if queue is full...", codeLine: 2 };
    
    let newFront = front;
    if (front === -1) {
        newFront = 0;
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `First element, setting front to 0.`, codeLine: 5 };
    }
    
    const newRear = rear + 1;
    arr[newRear].state = 'SELECTED';
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Incrementing rear pointer to ${newRear}.`, codeLine: 6 };

    arr[newRear].value = value;
    arr[newRear].state = 'ACCESS';
    arr[newRear].id = generateId(); 
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Inserted ${value} at rear = ${newRear}.`, codeLine: 7 };

    arr[newRear].state = 'DEFAULT';
    // Mảng cuối sẽ được update
}

export function* generateQueueDequeue(
    currentArray: ArrayNode[],
    front: number,
    rear: number
): Generator<DSAnimationStep> {
    let arr = JSON.parse(JSON.stringify(currentArray));
    
    if (front === -1 || front > rear) {
        yield { arrayState: arr, message: "Queue Underflow! Cannot dequeue.", codeLine: 3 };
        return;
    }

    yield { arrayState: arr, message: "Checking if queue is empty...", codeLine: 2 };

    arr[front].state = 'SELECTED';
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Accessing value at front = ${front}: ${arr[front].value}.`, codeLine: 4 };

    arr[front].state = 'DELETED';
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Dequeueing value ${arr[front].value}...`, codeLine: 5 };

    arr[front].value = null;
    arr[front].state = 'DEFAULT';
    yield { arrayState: arr, message: `Incremented front to ${front + 1}.`, codeLine: 6 };
}
