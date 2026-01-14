import { ArrayNode, DSAnimationStep } from './types';

const generateId = () => Math.random().toString(36).substr(2, 9);
const START_ADDRESS = 0x1000;

// Helper tạo node
const createNode = (index: number, value: number | null, startAddr: number = START_ADDRESS) => ({
    id: `dnode-${index}-${generateId()}`,
    index,
    value,
    address: `0x${(startAddr + index * 4).toString(16).toUpperCase()}`,
    state: 'DEFAULT' as const,
    isVisible: true,
});

export const createDynamicArray = (capacity: number): ArrayNode[] => {
    return Array.from({ length: capacity }, (_, i) => createNode(i, null));
};

// --- 1. PUSH BACK (Với Logic Resize) ---
export function* generatePushBackSteps(
    currentArray: ArrayNode[],
    value: number,
    size: number,
    capacity: number
): Generator<DSAnimationStep> {
    let arr = JSON.parse(JSON.stringify(currentArray));
    
    // --- CASE 1: RESIZING NEEDED ---
    if (size === capacity) {
        yield { arrayState: arr, message: `Capacity full (${size}/${capacity}). Triggering RESIZE!`, codeLine: 2 };

        const newCapacity = capacity * 2;
        // Tạo mảng mới (Temp Array)
        let newArr = Array.from({ length: newCapacity }, (_, i) => createNode(i, null, 0x5000)); // Address khác

        yield { 
            arrayState: arr, 
            tempArrayState: JSON.parse(JSON.stringify(newArr)),
            message: `Allocating new array with double capacity (${newCapacity}).`, 
            codeLine: 7 // Line trong snippet Resize
        };

        // Copy loop
        for (let i = 0; i < size; i++) {
            arr[i].state = 'ACCESS'; // Old array being read
            newArr[i].value = arr[i].value;
            newArr[i].state = 'SELECTED'; // New array being written

            yield {
                arrayState: JSON.parse(JSON.stringify(arr)),
                tempArrayState: JSON.parse(JSON.stringify(newArr)),
                message: `Copying index ${i}: ${arr[i].value} -> New Array.`,
                codeLine: 11
            };

            arr[i].state = 'DEFAULT';
            newArr[i].state = 'DEFAULT';
        }

        // Switch
        arr = newArr; // Mảng chính giờ là mảng mới
        yield { 
            arrayState: arr, 
            message: "Reference switched to new array. Old array discarded.", 
            codeLine: 14 
        };
        
        // Cập nhật capacity tham chiếu cho bước tiếp theo (chỉ logic animation, state thực tế update ở UI)
        capacity = newCapacity; 
    }

    // --- CASE 2: NORMAL INSERT ---
    // Highlight ô sắp thêm
    arr[size].state = 'SELECTED';
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Inserting ${value} at index ${size}.`, codeLine: 5 };

    arr[size] = { ...arr[size], value, id: generateId(), state: 'ACCESS' };
    yield { arrayState: arr, message: `Inserted ${value}. Size is now ${size + 1}.`, codeLine: 6 };
    
    // Reset color
    arr[size].state = 'DEFAULT';
}

// --- 2. INSERT AT INDEX (Có Resize) ---
export function* generateInsertAtSteps(
    currentArray: ArrayNode[],
    index: number,
    value: number,
    size: number,
    capacity: number
): Generator<DSAnimationStep> {
    let arr = JSON.parse(JSON.stringify(currentArray));

    // Resize Logic (Copy y hệt PushBack)
    if (size === capacity) {
        yield { arrayState: arr, message: "Array Full! Resizing...", codeLine: 2 };
        const newCapacity = capacity * 2;
        let newArr = Array.from({ length: newCapacity }, (_, i) => createNode(i, null, 0x5000));
        
        yield { arrayState: arr, tempArrayState: JSON.parse(JSON.stringify(newArr)), message: "Creating new array...", codeLine: 2 };

        for (let i = 0; i < size; i++) {
            arr[i].state = 'ACCESS';
            newArr[i].value = arr[i].value;
            newArr[i].state = 'SELECTED';
            yield { arrayState: JSON.parse(JSON.stringify(arr)), tempArrayState: JSON.parse(JSON.stringify(newArr)), message: "Copying elements...", codeLine: 2 };
            arr[i].state = 'DEFAULT';
            newArr[i].state = 'DEFAULT';
        }
        arr = newArr;
        capacity = newCapacity;
        yield { arrayState: arr, message: "Resize done.", codeLine: 2 };
    }

    // Shift Right Logic
    if (index < size) {
        for(let i = index; i < size; i++) arr[i].state = 'SHIFTING';
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Shifting elements from ${index} right.`, codeLine: 5 };
        
        for (let i = size; i > index; i--) {
            arr[i].value = arr[i-1].value;
            arr[i].state = 'SHIFTING';
        }
        arr[index].value = null; // Clear hole
    }

    arr[index] = { ...arr[index], value, id: generateId(), state: 'ACCESS' };
    for(let i=0; i<=size; i++) if(i!==index) arr[i].state = 'DEFAULT';
    
    yield { arrayState: arr, message: `Inserted ${value} at ${index}.`, codeLine: 8 };
}

// --- 3. POP BACK (Có Shrink logic minh họa) ---
export function* generatePopBackSteps(currentArray: ArrayNode[], size: number, capacity: number): Generator<DSAnimationStep> {
    let arr = JSON.parse(JSON.stringify(currentArray));
    
    if (size === 0) {
        yield { arrayState: arr, message: "Array is empty!", codeLine: 1 };
        return;
    }

    arr[size - 1].state = 'DELETED';
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Removing last element at index ${size-1}.`, codeLine: 3 };

    arr[size - 1].value = null;
    arr[size - 1].state = 'DEFAULT';
    size--; // Giảm size ảo

    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Element removed. Size is now ${size}.`, codeLine: 4 };

    // Shrink check (Min capacity 4)
    if (size > 0 && size <= capacity / 4 && capacity > 4) {
        yield { arrayState: arr, message: `Size (${size}) is 1/4 of Capacity (${capacity}). Shrinking...`, codeLine: 7 };
        
        const newCapacity = capacity / 2;
        let newArr = Array.from({ length: newCapacity }, (_, i) => createNode(i, null, 0x6000));

        yield { arrayState: arr, tempArrayState: JSON.parse(JSON.stringify(newArr)), message: `Allocating smaller array (${newCapacity}).`, codeLine: 8 };

        for(let i=0; i<size; i++) {
            newArr[i].value = arr[i].value;
            yield { arrayState: JSON.parse(JSON.stringify(arr)), tempArrayState: JSON.parse(JSON.stringify(newArr)), message: "Copying to smaller array..." };
        }
        arr = newArr;
        yield { arrayState: arr, message: "Shrink complete.", codeLine: 13 };
    } else {
        yield { arrayState: arr, message: "Finished.", codeLine: 4 };
    }
}