import { ArrayNode, DSAnimationStep } from './types';

const generateId = () => Math.random().toString(36).substr(2, 9);
const START_ADDRESS = 0x2000;

export const createEmptyStack = (capacity: number): ArrayNode[] => {
    return Array.from({ length: capacity }, (_, i) => ({
        id: `snode-${i}-${generateId()}`,
        index: i,
        value: null,
        address: `0x${(START_ADDRESS + i * 4).toString(16).toUpperCase()}`,
        state: 'DEFAULT',
        isVisible: true
    }));
};

export function* generateStackPush(
    currentArray: ArrayNode[],
    value: number,
    top: number,
    capacity: number
): Generator<DSAnimationStep> {
    let arr = JSON.parse(JSON.stringify(currentArray));
    
    if (top >= capacity - 1) {
        yield { arrayState: arr, message: "Stack Overflow! Cannot push.", codeLine: 3 };
        return;
    }

    yield { arrayState: arr, message: "Checking if stack is full...", codeLine: 2 };
    
    const newTop = top + 1;
    arr[newTop].state = 'SELECTED';
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Incrementing top pointer to ${newTop}.`, codeLine: 4 };

    arr[newTop].value = value;
    arr[newTop].state = 'ACCESS';
    arr[newTop].id = generateId(); // Trigger animation
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Inserted ${value} at top = ${newTop}.`, codeLine: 5 };

    arr[newTop].state = 'DEFAULT';
}

export function* generateStackPop(
    currentArray: ArrayNode[],
    top: number
): Generator<DSAnimationStep> {
    let arr = JSON.parse(JSON.stringify(currentArray));
    
    if (top === -1) {
        yield { arrayState: arr, message: "Stack Underflow! Cannot pop.", codeLine: 3 };
        return;
    }

    yield { arrayState: arr, message: "Checking if stack is empty...", codeLine: 2 };

    arr[top].state = 'SELECTED';
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Accessing value at top = ${top}: ${arr[top].value}.`, codeLine: 4 };

    arr[top].state = 'DELETED';
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Popping value ${arr[top].value}...`, codeLine: 5 };

    arr[top].value = null;
    arr[top].state = 'DEFAULT';
    yield { arrayState: arr, message: `Decremented top to ${top - 1}.`, codeLine: 6 };
}

export function* generateStackPeek(
    currentArray: ArrayNode[],
    top: number
): Generator<DSAnimationStep> {
    let arr = JSON.parse(JSON.stringify(currentArray));

    if (top === -1) {
        yield { arrayState: arr, message: "Stack is empty. Nothing to peek.", codeLine: 3 };
        return;
    }

    yield { arrayState: arr, message: "Checking if stack is empty...", codeLine: 2 };

    arr[top].state = 'FOUND';
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Top element is ${arr[top].value}.`, codeLine: 4 };

    arr[top].state = 'DEFAULT';
}
