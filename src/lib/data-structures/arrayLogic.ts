import { ArrayNode, DSAnimationStep } from './types';

const generateId = () => Math.random().toString(36).substr(2, 9);
const START_ADDRESS = 0x1000;
const SECOND_ADDRESS = 0x2000;

export const createArrayFromInput = (input: number[], capacity: number): ArrayNode[] => {
    const nodes = Array.from({ length: capacity }, (_, i) => ({
      id: `node-${i}-${generateId()}`,
      index: i,
      value: i < input.length ? input[i] : null,
      address: `0x${(START_ADDRESS + i * 4).toString(16).toUpperCase()}`,
      state: 'DEFAULT' as const,
      isVisible: true,
    }));
    return nodes;
};

export const createEmptyArray = (capacity: number): ArrayNode[] => {
  return createArrayFromInput([], capacity);
};

// --- 1. INSERT OPERATION ---
export function* generateInsertSteps(currentArray: ArrayNode[], index: number, value: number, size: number, capacity: number): Generator<DSAnimationStep> {
    const arr = JSON.parse(JSON.stringify(currentArray));
    
    // Check Capacity
    if (size >= capacity) { 
        yield { arrayState: arr, message: "Error: Array is Full!", codeLine: 2 }; 
        return; 
    }

    const isTail = index === size;
    const isHead = index === 0;

    // Highlight Loop / Shift
    if (!isTail) {
        // Line 3: Start Loop (Shift)
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Prepare to shift elements from index ${index} to right.`, codeLine: 3 };
        
        for (let i = size; i > index; i--) {
            arr[i].value = arr[i-1].value;
            arr[i].id = arr[i-1].id;
            arr[i].state = 'SHIFTING';
        }
        // Line 4: Shifting done inside loop
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Shifted elements to make space at index ${index}.`, codeLine: 4 };
    }

    // Line 5: Insert (Assign Value)
    arr[index] = { ...arr[index], value, id: generateId(), state: 'ACCESS' };
    
    // Reset colors
    for(let i=0; i<=size; i++) if (i !== index) arr[i].state = 'DEFAULT';
    
    // Line 6: Size++
    yield { arrayState: arr, message: `Inserted ${value} at index ${index}.`, codeLine: isTail ? 3 : 5 };
}

// --- 2. DELETE OPERATION ---
export function* generateDeleteSteps(currentArray: ArrayNode[], index: number, size: number): Generator<DSAnimationStep> {
    const arr = JSON.parse(JSON.stringify(currentArray));
    
    // Line 2: Check Index
    if (index < 0 || index >= size) { 
        yield { arrayState: arr, message: "Index out of bounds", codeLine: 2 }; 
        return; 
    }

    arr[index].state = 'DELETED';
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Deleting value at index ${index}.`, codeLine: 3 };
    arr[index].value = null;

    // Shift Logic
    if (index < size - 1) {
        // Line 4: Loop Shift
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Shifting elements from index ${index+1} to left.`, codeLine: 4 };
        for (let i = index; i < size - 1; i++) {
            arr[i].value = arr[i+1].value;
            arr[i].id = arr[i+1].id;
            arr[i].state = 'SHIFTING';
        }
        arr[size - 1] = { ...arr[size - 1], value: null, id: generateId(), state: 'DEFAULT' };
        // Line 5: Shift inside loop
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: "Shift complete.", codeLine: 5 };
    }

    arr.forEach((n:any) => n.state = 'DEFAULT');
    // Line 6: Size--
    yield { arrayState: arr, message: `Deleted. Size is now ${size - 1}.`, codeLine: 6 };
}

// --- 3. SEARCH LINEAR ---
export function* generateSearchSteps(currentArray: ArrayNode[], target: number, size: number): Generator<DSAnimationStep> {
    const arr = JSON.parse(JSON.stringify(currentArray));
    
    for (let i = 0; i < size; i++) {
        arr[i].state = 'ACCESS';
        // Line 2: Loop check
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Checking index ${i}...`, codeLine: 2 };
        
        // Line 3: Compare
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Is ${arr[i].value} == ${target}?`, codeLine: 3 };

        if (arr[i].value === target) {
            arr[i].state = 'FOUND';
            // Line 4: Return Found
            yield { arrayState: arr, message: `Found ${target} at index ${i}!`, codeLine: 4 };
            return;
        }
        arr[i].state = 'DEFAULT';
    }
    // Line 5: Return -1
    yield { arrayState: arr, message: `Value ${target} not found.`, codeLine: 5 };
}

// --- 4. UPDATE ---
export function* generateUpdateSteps(currentArray: ArrayNode[], index: number, newValue: number, size: number): Generator<DSAnimationStep> {
    const arr = JSON.parse(JSON.stringify(currentArray));
    // Line 2: Check
    if(index >= size) { yield { arrayState: arr, message: "Error: Index out of bounds", codeLine: 2 }; return; }
    
    arr[index].state = 'ACCESS';
    yield {arrayState: JSON.parse(JSON.stringify(arr)), message: `Accessing index ${index}...`, codeLine: 2};
    
    // Line 3: Assign
    arr[index].value = newValue;
    arr[index].state = 'FOUND';
    yield {arrayState: JSON.parse(JSON.stringify(arr)), message: `Updated index ${index} to ${newValue}.`, codeLine: 3};
    arr[index].state = 'DEFAULT';
}

// --- 5. SEARCH BINARY ---
export function* generateBinarySearchSteps(currentArray: ArrayNode[], target: number, size: number): Generator<DSAnimationStep> {
    const arr = JSON.parse(JSON.stringify(currentArray));
    let left = 0, right = size - 1;
    
    // Line 2: Start Loop
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: "Starting Binary Search...", codeLine: 2 };

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        // Visual Range
        for (let i = 0; i < size; i++) arr[i].state = (i >= left && i <= right) ? 'SHIFTING' : 'DEFAULT';
        arr[mid].state = 'SELECTED';
        
        // Line 3: Calc Mid
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Range [${left}, ${right}]. Mid: ${mid} (${arr[mid].value})`, codeLine: 3 };

        // Line 4: Check Match
        if (arr[mid].value === target) {
            arr[mid].state = 'FOUND';
            yield { arrayState: arr, message: `Found ${target} at index ${mid}!`, codeLine: 4 };
            return;
        }

        // Line 5: Check <
        if (arr[mid].value! < target) {
            left = mid + 1;
            yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `${arr[mid].value} < ${target}. Search Right.`, codeLine: 5 };
        } else {
            // Line 6: Else (Check >)
            right = mid - 1;
            yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `${arr[mid].value} > ${target}. Search Left.`, codeLine: 6 };
        }
    }
    arr.forEach((n: any) => n.state = 'DEFAULT');
    // Line 7: Not Found
    yield { arrayState: arr, message: `${target} not found.`, codeLine: 7 };
}

// --- 6. INSERT SORTED ---
export function* generateSortedInsertSteps(currentArray: ArrayNode[], value: number, size: number, capacity: number): Generator<DSAnimationStep> {
    const arr = JSON.parse(JSON.stringify(currentArray));
    if (size >= capacity) { yield { arrayState: arr, message: "Full!", codeLine: 2 }; return; }

    // Line 3: Init i
    let i = size - 1;
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Start checking from end (index ${i}).`, codeLine: 3 };

    // Line 4: Loop check
    while (i >= 0) {
        arr[i].state = 'ACCESS';
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Comparing ${value} vs ${arr[i].value}...`, codeLine: 4 };
        
        if (arr[i].value! > value) {
            // Line 5: Shift
            arr[i+1].value = arr[i].value;
            arr[i+1].id = arr[i].id;
            arr[i].state = 'SHIFTING';
            yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `${arr[i].value} > ${value}, Shift Right.`, codeLine: 5 };
            
            // Line 6: Dec i
            i = i - 1;
        } else {
            arr[i].state = 'DEFAULT';
            break;
        }
    }

    // Line 7: Insert
    arr[i+1] = { ...arr[i+1], value, id: generateId(), state: 'ACCESS' };
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Found position. Insert ${value} at ${i+1}.`, codeLine: 7 };
    
    // Reset
    for(let k=0; k<=size; k++) if (k !== i+1) arr[k].state = 'DEFAULT';
    
    // Line 8: Size++
    yield { arrayState: arr, message: "Insertion Complete.", codeLine: 8 };
}

// --- 7. RANGE QUERY & HELPERS ---
export const createPrefixArrayEmpty = (capacity: number): ArrayNode[] => {
    return Array.from({ length: capacity }, (_, i) => ({
        id: `prefix-${i}-${generateId()}`,
        index: i,
        value: null, 
        address: `0x${(SECOND_ADDRESS + i * 4).toString(16).toUpperCase()}`,
        state: 'DEFAULT',
        isVisible: true,
    }));
};

export function* generateBuildPrefixSumSteps(currentArray: ArrayNode[], size: number, capacity: number): Generator<DSAnimationStep> {
    const arr = JSON.parse(JSON.stringify(currentArray)); 
    let prefixArr: ArrayNode[] = createPrefixArrayEmpty(capacity);
    yield { arrayState: arr, secondArrayState: JSON.parse(JSON.stringify(prefixArr)), message: "Building Prefix Sum..." };

    let runningSum = 0;
    for (let i = 0; i < size; i++) {
        arr[i].state = 'ACCESS';
        runningSum += arr[i].value!;
        prefixArr[i].value = runningSum;
        prefixArr[i].state = 'SELECTED'; 
        yield { arrayState: JSON.parse(JSON.stringify(arr)), secondArrayState: JSON.parse(JSON.stringify(prefixArr)), message: `P[${i}] = ${runningSum}` };
        arr[i].state = 'DEFAULT';
        prefixArr[i].state = 'DEFAULT'; 
    }
    yield { arrayState: arr, secondArrayState: prefixArr, message: "Prefix Sum Built." };
}

export function* generatePrefixSumQuerySteps(currentArray: ArrayNode[], prefixArray: ArrayNode[], start: number, end: number, size: number): Generator<DSAnimationStep> {
    const arr = JSON.parse(JSON.stringify(currentArray));
    const prefix = JSON.parse(JSON.stringify(prefixArray));

    if (start < 0 || end >= size || start > end) {
        yield { arrayState: arr, secondArrayState: prefix, message: "Invalid Range!", codeLine: 1 };
        return;
    }

    for(let i = start; i <= end; i++) arr[i].state = 'SHIFTING'; 
    
    // Line 3: Check L==0
    yield { arrayState: JSON.parse(JSON.stringify(arr)), secondArrayState: JSON.parse(JSON.stringify(prefix)), message: `Checking range [${start}, ${end}]...`, codeLine: 3 };

    if (start === 0) {
        // Line 4: Return P[R]
        prefix[end].state = 'FOUND';
        yield { arrayState: arr, secondArrayState: prefix, message: `L=0. Result = P[${end}] = ${prefix[end].value}`, codeLine: 4 };
    } else {
        // Line 6: Return P[R] - P[L-1]
        prefix[end].state = 'FOUND';
        prefix[start-1].state = 'DELETED';
        const res = prefix[end].value! - prefix[start-1].value!;
        yield { arrayState: arr, secondArrayState: prefix, message: `Result = P[${end}] - P[${start-1}] = ${res}`, codeLine: 6 };
    }
}

// Dummy MinMax (giữ cho không lỗi import, có thể update codeLine sau nếu cần)
export function* generateMinMaxSteps(currentArray: ArrayNode[], size: number, type: 'MIN' | 'MAX'): Generator<DSAnimationStep> {
    const arr = JSON.parse(JSON.stringify(currentArray));
    if(size===0) return;
    let best = 0;
    arr[0].state = 'SELECTED';
    yield {arrayState: JSON.parse(JSON.stringify(arr)), message: `Start at 0`};
    for(let i=1; i<size; i++) {
        arr[i].state = 'ACCESS';
        yield {arrayState: JSON.parse(JSON.stringify(arr)), message: `Compare...`};
        const better = type === 'MIN' ? arr[i].value! < arr[best].value! : arr[i].value! > arr[best].value!;
        if(better) {
            arr[best].state = 'DEFAULT'; best = i; arr[best].state = 'SELECTED';
        } else arr[i].state = 'DEFAULT';
    }
    arr[best].state = 'FOUND';
    yield {arrayState: arr, message: `Found!`};
}