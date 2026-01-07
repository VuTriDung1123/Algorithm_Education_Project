import { ArrayNode, DSAnimationStep } from './types';

// Hàm tạo ID ngẫu nhiên
const generateId = () => Math.random().toString(36).substr(2, 9);
const START_ADDRESS = 0x1000;

// --- 0. CREATE OPERATION ---
export const createArrayFromInput = (input: number[], capacity: number): ArrayNode[] => {
    const nodes = Array.from({ length: capacity }, (_, i) => ({
      id: `node-${i}-${generateId()}`,
      index: i,
      value: i < input.length ? input[i] : null,
      address: `0x${(START_ADDRESS + i * 4).toString(16).toUpperCase()}`,
      state: 'DEFAULT' as const, // Cast to literal type
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
    // FIX LỖI: dùng đúng tên biến currentArray thay vì arrData
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