import { ArrayNode, DSAnimationStep } from './types';

const generateId = () => Math.random().toString(36).substr(2, 9);
const START_ADDRESS = 0x5000;

export const createEmptyHashTable = (capacity: number): ArrayNode[] => {
    return Array.from({ length: capacity }, (_, i) => ({
        id: `hnode-${i}-${generateId()}`,
        index: i,
        value: null,
        address: `0x${(START_ADDRESS + i * 4).toString(16).toUpperCase()}`,
        state: 'DEFAULT',
        isVisible: true,
        auxiliary: { key: null }
    }));
};

export function* generateHashInsert(
    currentArray: ArrayNode[],
    key: number,
    value: number,
    capacity: number
): Generator<DSAnimationStep> {
    let arr = JSON.parse(JSON.stringify(currentArray));
    let index = key % capacity;
    let originalIndex = index;
    
    yield { arrayState: arr, message: `Hashing key ${key}: ${key} % ${capacity} = ${index}`, codeLine: 2 };

    while (arr[index].value !== null && arr[index].auxiliary?.key !== key && arr[index].state !== 'DELETED') {
        arr[index].state = 'ACCESS';
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Collision at index ${index}! Probing next...`, codeLine: 4 };
        arr[index].state = 'DEFAULT';
        
        index = (index + 1) % capacity;
        yield { arrayState: arr, message: `Checking index ${index}.`, codeLine: 5 };
        
        if (index === originalIndex) {
            yield { arrayState: arr, message: "Hash Table is Full!", codeLine: 7 };
            return;
        }
    }

    arr[index].state = 'SELECTED';
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Found slot at index ${index}.`, codeLine: 9 };

    arr[index].value = value;
    arr[index].auxiliary = { key };
    arr[index].state = 'ACCESS';
    arr[index].id = generateId(); 
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Inserted (${key}, ${value}) at index ${index}.`, codeLine: 9 };

    arr[index].state = 'DEFAULT';
    yield { arrayState: arr, message: "Done." };
}

export function* generateHashSearch(
    currentArray: ArrayNode[],
    key: number,
    capacity: number
): Generator<DSAnimationStep> {
    let arr = JSON.parse(JSON.stringify(currentArray));
    let index = key % capacity;
    let originalIndex = index;
    
    yield { arrayState: arr, message: `Hashing key ${key}: ${key} % ${capacity} = ${index}`, codeLine: 2 };

    while (arr[index].value !== null || arr[index].state === 'DELETED') {
        arr[index].state = 'ACCESS';
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Checking index ${index}...`, codeLine: 4 };
        
        if (arr[index].auxiliary?.key === key && arr[index].state !== 'DELETED') {
            arr[index].state = 'FOUND';
            yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Found key ${key} with value ${arr[index].value} at index ${index}.`, codeLine: 6 };
            arr[index].state = 'DEFAULT';
            return;
        }
        
        arr[index].state = 'DEFAULT';
        index = (index + 1) % capacity;
        yield { arrayState: arr, message: `Not matched. Probing next: index ${index}.`, codeLine: 7 };
        
        if (index === originalIndex) {
            break;
        }
    }

    yield { arrayState: arr, message: `Key ${key} not found.`, codeLine: 10 };
}

export function* generateHashDelete(
    currentArray: ArrayNode[],
    key: number,
    capacity: number
): Generator<DSAnimationStep> {
    let arr = JSON.parse(JSON.stringify(currentArray));
    let index = key % capacity;
    let originalIndex = index;
    
    yield { arrayState: arr, message: `Hashing key ${key}: ${key} % ${capacity} = ${index}`, codeLine: 2 };

    while (arr[index].value !== null || arr[index].state === 'DELETED') {
        arr[index].state = 'ACCESS';
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Checking index ${index}...`, codeLine: 4 };
        
        if (arr[index].auxiliary?.key === key && arr[index].state !== 'DELETED') {
            arr[index].state = 'DELETED';
            yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Deleting key ${key}...`, codeLine: 6 };
            
            arr[index].value = null;
            arr[index].auxiliary = { key: null };
            arr[index].id = generateId(); // refresh UI
            
            yield { arrayState: arr, message: `Deleted. Slot marked as DELETED (Tombstone).`, codeLine: 7 };
            return;
        }
        
        arr[index].state = 'DEFAULT';
        index = (index + 1) % capacity;
        yield { arrayState: arr, message: `Not matched. Probing next: index ${index}.`, codeLine: 8 };
        
        if (index === originalIndex) {
            break;
        }
    }

    yield { arrayState: arr, message: `Key ${key} not found to delete.`, codeLine: 11 };
}
