import { ArrayNode, DSAnimationStep } from './types';

const generateId = () => Math.random().toString(36).substr(2, 9);
const START_ADDRESS = 0x6000;

export const createEmptyHeap = (capacity: number): ArrayNode[] => {
    return Array.from({ length: capacity }, (_, i) => ({
        id: `pq-${i}-${generateId()}`,
        index: i,
        value: null,
        address: `0x${(START_ADDRESS + i * 4).toString(16).toUpperCase()}`,
        state: 'DEFAULT',
        isVisible: true
    }));
};

export function* generateHeapInsert(
    currentArray: ArrayNode[],
    value: number,
    size: number,
    capacity: number
): Generator<DSAnimationStep> {
    let arr = JSON.parse(JSON.stringify(currentArray));
    
    if (size === capacity) {
        yield { arrayState: arr, message: "Heap is full!", codeLine: 2, auxiliary: { code: 'INSERT' } };
        return;
    }

    arr[size].value = value;
    arr[size].state = 'ACCESS';
    arr[size].id = generateId();
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Inserted ${value} at end (index ${size}).`, codeLine: 4, auxiliary: { code: 'INSERT', size: size + 1 } };
    arr[size].state = 'DEFAULT';

    let index = size;
    let parent = Math.floor((index - 1) / 2);
    
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Starting Heapify-Up from index ${index}.`, codeLine: 6, auxiliary: { code: 'INSERT', size: size + 1 } };

    while (index > 0 && arr[parent].value! > arr[index].value!) {
        arr[index].state = 'SELECTED';
        arr[parent].state = 'ACCESS';
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Comparing ${arr[index].value} (index ${index}) with parent ${arr[parent].value} (index ${parent}).`, codeLine: 3, auxiliary: { code: 'HEAPIFY_UP', size: size + 1 } };

        // Swap
        let temp = arr[index].value;
        arr[index].value = arr[parent].value;
        arr[parent].value = temp;
        // Swap ids for animation
        let tempId = arr[index].id;
        arr[index].id = arr[parent].id;
        arr[parent].id = tempId;

        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Swapped! ${arr[parent].value} goes up.`, codeLine: 4, auxiliary: { code: 'HEAPIFY_UP', size: size + 1 } };

        arr[index].state = 'DEFAULT';
        arr[parent].state = 'DEFAULT';

        index = parent;
        parent = Math.floor((index - 1) / 2);
    }
    
    if (index > 0) {
        arr[index].state = 'SELECTED';
        arr[parent].state = 'ACCESS';
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Parent ${arr[parent].value} is smaller. Stop Heapify-Up.`, codeLine: 3, auxiliary: { code: 'HEAPIFY_UP', size: size + 1 } };
        arr[index].state = 'DEFAULT';
        arr[parent].state = 'DEFAULT';
    }

    yield { arrayState: arr, message: "Insert Complete.", auxiliary: { size: size + 1 } };
}

export function* generateHeapExtractMin(
    currentArray: ArrayNode[],
    size: number
): Generator<DSAnimationStep> {
    let arr = JSON.parse(JSON.stringify(currentArray));
    
    if (size === 0) {
        yield { arrayState: arr, message: "Heap is empty!", codeLine: 2, auxiliary: { code: 'EXTRACT_MIN' } };
        return;
    }

    let min = arr[0].value;
    arr[0].state = 'DELETED';
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Extracting Min: ${min} at root.`, codeLine: 4, auxiliary: { code: 'EXTRACT_MIN' } };

    arr[0].value = arr[size - 1].value;
    arr[size - 1].value = null;
    arr[0].state = 'ACCESS';
    arr[size - 1].state = 'DEFAULT';
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Moved last element ${arr[0].value} to root.`, codeLine: 5, auxiliary: { code: 'EXTRACT_MIN', size: size - 1 } };
    arr[0].state = 'DEFAULT';

    let index = 0;
    let newSize = size - 1;

    if (newSize > 0) {
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Starting Heapify-Down from root.`, codeLine: 7, auxiliary: { code: 'EXTRACT_MIN', size: newSize } };
        
        while (true) {
            let largest = index;
            let left = 2 * index + 1;
            let right = 2 * index + 2;

            if (left < newSize) arr[left].state = 'ACCESS';
            if (right < newSize) arr[right].state = 'ACCESS';
            arr[index].state = 'SELECTED';

            yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Checking children of index ${index}...`, codeLine: 5, auxiliary: { code: 'HEAPIFY_DOWN', size: newSize } };

            if (left < newSize && arr[left].value! < arr[largest].value!) {
                largest = left;
            }
            if (right < newSize && arr[right].value! < arr[largest].value!) {
                largest = right;
            }

            if (left < newSize) arr[left].state = 'DEFAULT';
            if (right < newSize) arr[right].state = 'DEFAULT';
            arr[index].state = 'DEFAULT';

            if (largest === index) {
                yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Node is smaller than its children. Stop.`, codeLine: 10, auxiliary: { code: 'HEAPIFY_DOWN', size: newSize } };
                break;
            }

            arr[index].state = 'SELECTED';
            arr[largest].state = 'ACCESS';
            yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Smallest child is ${arr[largest].value} at index ${largest}. Swapping...`, codeLine: 12, auxiliary: { code: 'HEAPIFY_DOWN', size: newSize } };

            // Swap
            let temp = arr[index].value;
            arr[index].value = arr[largest].value;
            arr[largest].value = temp;
            
            let tempId = arr[index].id;
            arr[index].id = arr[largest].id;
            arr[largest].id = tempId;

            yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Swapped.`, codeLine: 13, auxiliary: { code: 'HEAPIFY_DOWN', size: newSize } };

            arr[index].state = 'DEFAULT';
            arr[largest].state = 'DEFAULT';
            index = largest;
        }
    }

    yield { arrayState: arr, message: "Extract Min Complete.", auxiliary: { size: newSize } };
}
