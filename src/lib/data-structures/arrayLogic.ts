import { ArrayNode, DSAnimationStep } from './types';

// Hàm tạo ID ngẫu nhiên
const generateId = () => Math.random().toString(36).substr(2, 9);
const START_ADDRESS = 0x1000;
const SECOND_ADDRESS = 0x2000;

// --- 0. CREATE OPERATION ---
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
export function* generateInsertSteps(
  currentArray: ArrayNode[], 
  index: number, 
  value: number, 
  size: number, 
  capacity: number
): Generator<DSAnimationStep> {
  const arr = JSON.parse(JSON.stringify(currentArray));

  if (size >= capacity) {
    yield { arrayState: arr, message: "Error: Array is Full! (Capacity reached)", codeLine: 1 };
    return;
  }

  // Highlight vị trí muốn chèn
  arr[index].state = 'SELECTED';
  const isTail = index === size;
  yield { arrayState: JSON.parse(JSON.stringify(arr)), message: isTail ? `Insert at Tail (Index ${index}). No shifting needed.` : `Target Index: ${index}. Shifting required...`, codeLine: 2 };

  // Dịch chuyển
  if (index < size) {
    for (let i = index; i < size; i++) {
        arr[i].state = 'SHIFTING';
    }
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Shift elements from ${index} to ${size - 1} to the right.`, codeLine: 3 };

    for (let i = size; i > index; i--) {
        arr[i].value = arr[i-1].value;
        arr[i].id = arr[i-1].id; 
        arr[i].state = 'SHIFTING';
    }
    
    // Reset lỗ trống
    arr[index] = { ...arr[index], value: null, id: generateId(), state: 'SELECTED' };
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: "Created space at index " + index, codeLine: 4 };
  }

  // Chèn
  arr[index].value = value;
  arr[index].id = generateId(); 
  arr[index].state = 'ACCESS'; 
  
  // Reset
  for(let i=0; i<=size; i++) { if (i !== index) arr[i].state = 'DEFAULT'; }

  yield { arrayState: arr, message: `Inserted ${value} at index ${index}. Time Complexity: ${isTail ? 'O(1)' : 'O(N)'}.`, codeLine: 5 };
}

// --- 2. DELETE OPERATION ---
export function* generateDeleteSteps(
    currentArray: ArrayNode[],
    index: number,
    size: number
): Generator<DSAnimationStep> {
    const arr = JSON.parse(JSON.stringify(currentArray));

    arr[index].state = 'DELETED';
    const isTail = index === size - 1;
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: isTail ? `Deleting Tail (Index ${index}). No shifting needed.` : `Mark index ${index} for deletion. Shifting will be required.`, codeLine: 1 };

    arr[index].value = null;
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Value cleared.`, codeLine: 2 };

    if (index < size - 1) {
        for(let i = index + 1; i < size; i++) arr[i].state = 'SHIFTING';
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Shift elements from ${index + 1} to left.`, codeLine: 3 };

        for (let i = index; i < size - 1; i++) {
            arr[i].value = arr[i+1].value;
            arr[i].id = arr[i+1].id;
            arr[i].state = 'SHIFTING';
        }
        arr[size - 1] = { ...arr[size - 1], value: null, id: generateId(), state: 'DEFAULT' };
    }

    arr.forEach((node: ArrayNode) => node.state = 'DEFAULT');
    yield { arrayState: arr, message: `Deletion complete. Time Complexity: ${isTail ? 'O(1)' : 'O(N)'}.`, codeLine: 4 };
}

// --- 3. SEARCH & MIN/MAX ---
export function* generateSearchSteps(currentArray: ArrayNode[], target: number, size: number): Generator<DSAnimationStep> {
    const arr = JSON.parse(JSON.stringify(currentArray));
    for (let i = 0; i < size; i++) {
        arr[i].state = 'ACCESS';
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Checking index ${i}: Is ${arr[i].value} == ${target}?` };
        if (arr[i].value === target) {
            arr[i].state = 'FOUND';
            yield { arrayState: arr, message: `Found ${target} at index ${i}!` };
            return;
        }
        arr[i].state = 'DEFAULT';
    }
    yield { arrayState: arr, message: `Value ${target} not found.` };
}

export function* generateMinMaxSteps(currentArray: ArrayNode[], size: number, type: 'MIN' | 'MAX'): Generator<DSAnimationStep> {
    const arr = JSON.parse(JSON.stringify(currentArray));
    if (size === 0) { yield { arrayState: arr, message: "Array is empty." }; return; }

    let bestIdx = 0;
    arr[0].state = 'SELECTED'; 
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Assume first element ${arr[0].value} is ${type}.` };

    for (let i = 1; i < size; i++) {
        arr[i].state = 'ACCESS'; 
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Compare ${arr[i].value} with current ${type} (${arr[bestIdx].value}).` };

        const isBetter = type === 'MIN' ? (arr[i].value! < arr[bestIdx].value!) : (arr[i].value! > arr[bestIdx].value!);
        
        if (isBetter) {
            arr[bestIdx].state = 'DEFAULT'; 
            bestIdx = i;
            arr[bestIdx].state = 'SELECTED'; 
            yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `New ${type} found: ${arr[i].value} at index ${i}.` };
        } else {
            arr[i].state = 'DEFAULT';
        }
    }
    arr[bestIdx].state = 'FOUND'; 
    yield { arrayState: arr, message: `Final ${type} is ${arr[bestIdx].value} at index ${bestIdx}.` };
}

// --- 4. UPDATE OPERATION ---
export function* generateUpdateSteps(currentArray: ArrayNode[], index: number, newValue: number, size: number): Generator<DSAnimationStep> {
    const arr = JSON.parse(JSON.stringify(currentArray));
    if (index >= size) { yield { arrayState: arr, message: "Index out of bounds" }; return; }

    // Highlight
    arr[index].state = 'ACCESS';
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Accessing Index ${index}. Current value: ${arr[index].value}` };

    // Update
    arr[index].value = newValue;
    arr[index].state = 'FOUND';
    yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Updated Index ${index} to ${newValue}. O(1) Operation.` };
    
    // Reset
    arr[index].state = 'DEFAULT';
}

// 5. SORTED INSERT
export function* generateSortedInsertSteps(
    currentArray: ArrayNode[], 
    value: number, 
    size: number, 
    capacity: number
): Generator<DSAnimationStep> {
    const arr = JSON.parse(JSON.stringify(currentArray));

    if (size >= capacity) {
        yield { arrayState: arr, message: "Array is Full!", codeLine: 1 };
        return;
    }

    let insertPos = size;
    for (let i = 0; i < size; i++) {
        arr[i].state = 'ACCESS';
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Comparing ${value} with ${arr[i].value}...` };
        
        if (value < arr[i].value!) {
            insertPos = i;
            arr[i].state = 'SELECTED';
            yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Found position at index ${i} (since ${value} < ${arr[i].value})` };
            break;
        }
        arr[i].state = 'DEFAULT';
    }

    if (insertPos < size) {
        for (let i = insertPos; i < size; i++) arr[i].state = 'SHIFTING';
        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: "Shifting elements to make space..." };
        
        for (let i = size; i > insertPos; i--) {
            arr[i].value = arr[i-1].value;
            arr[i].id = arr[i-1].id;
            arr[i].state = 'SHIFTING';
        }
    }

    arr[insertPos] = { ...arr[insertPos], value, id: generateId(), state: 'ACCESS' };
    for(let i=0; i<=size; i++) if (i !== insertPos) arr[i].state = 'DEFAULT';
    
    yield { arrayState: arr, message: `Inserted ${value} at sorted position ${insertPos}.` };
}

// 6. BINARY SEARCH
export function* generateBinarySearchSteps(
    currentArray: ArrayNode[],
    target: number,
    size: number
): Generator<DSAnimationStep> {
    const arr = JSON.parse(JSON.stringify(currentArray));
    let left = 0;
    let right = size - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        for (let i = 0; i < size; i++) {
            if (i >= left && i <= right) arr[i].state = 'SHIFTING'; 
            else arr[i].state = 'DEFAULT'; 
        }
        arr[mid].state = 'SELECTED'; 

        yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `Range [${left}, ${right}]. Mid index ${mid} (${arr[mid].value}).` };

        if (arr[mid].value === target) {
            arr[mid].state = 'FOUND';
            yield { arrayState: arr, message: `Found ${target} at index ${mid}!` };
            return;
        }

        if (arr[mid].value! < target) {
            left = mid + 1;
            yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `${arr[mid].value} < ${target}. Ignore left half.` };
        } else {
            right = mid - 1;
            yield { arrayState: JSON.parse(JSON.stringify(arr)), message: `${arr[mid].value} > ${target}. Ignore right half.` };
        }
    }

    arr.forEach((n: any) => n.state = 'DEFAULT');
    yield { arrayState: arr, message: `${target} not found.` };
}

// Helper: Tạo mảng rỗng cho Prefix Sum
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

// 7. BUILD PREFIX SUM
export function* generateBuildPrefixSumSteps(
    currentArray: ArrayNode[],
    size: number,
    capacity: number
): Generator<DSAnimationStep> {
    const arr = JSON.parse(JSON.stringify(currentArray)); 
    let prefixArr: ArrayNode[] = createPrefixArrayEmpty(capacity);
    
    yield { 
        arrayState: arr, 
        secondArrayState: JSON.parse(JSON.stringify(prefixArr)),
        message: "Preprocessing: Build Prefix Sum Array P[i] = A[0] + ... + A[i]."
    };

    let runningSum = 0;
    for (let i = 0; i < size; i++) {
        arr[i].state = 'ACCESS';
        runningSum += arr[i].value!;
        
        prefixArr[i].value = runningSum;
        prefixArr[i].state = 'SELECTED'; 

        yield {
            arrayState: JSON.parse(JSON.stringify(arr)),
            secondArrayState: JSON.parse(JSON.stringify(prefixArr)),
            message: `P[${i}] = P[${i-1} ?? 0] + A[${i}] = ${runningSum}`
        };

        arr[i].state = 'DEFAULT';
        prefixArr[i].state = 'DEFAULT'; 
    }

    yield {
        arrayState: arr,
        secondArrayState: prefixArr,
        message: "Prefix Sum Array built! Ready for O(1) queries."
    };
}

// 8. RANGE SUM QUERY
export function* generatePrefixSumQuerySteps(
    currentArray: ArrayNode[],
    prefixArray: ArrayNode[], 
    start: number,
    end: number,
    size: number
): Generator<DSAnimationStep> {
    const arr = JSON.parse(JSON.stringify(currentArray));
    const prefix = JSON.parse(JSON.stringify(prefixArray));

    if (start < 0 || end >= size || start > end) {
        yield { arrayState: arr, secondArrayState: prefix, message: "Invalid Range!" };
        return;
    }

    for(let i = start; i <= end; i++) arr[i].state = 'SHIFTING'; 

    prefix[end].state = 'FOUND'; 

    let result = prefix[end].value!;
    let formula = `Sum(${start}, ${end}) = P[${end}]`;

    if (start > 0) {
        prefix[start - 1].state = 'DELETED'; 
        result -= prefix[start - 1].value!;
        formula += ` - P[${start - 1}]`;
    } else {
        formula += ` (L=0, take P[R])`;
    }

    yield {
        arrayState: arr,
        secondArrayState: prefix,
        message: `${formula} = ${result}. Time: O(1).`
    };
}