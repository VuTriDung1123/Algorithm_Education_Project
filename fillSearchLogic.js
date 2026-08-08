const fs = require('fs');

const algos = {
    linear: {
        code: `export const linearSearchSnippets = {
  javascript: \`function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}\`
};`,
        logic: `import { DSAnimationStep, SearchStateData } from "@/lib/data-structures/types";
export function* linearSearchLogic(arr: number[], target: number): Generator<DSAnimationStep> {
    const searchState: SearchStateData = { array: [...arr], target };
    for (let i = 0; i < arr.length; i++) {
        searchState.current = i;
        yield { searchState: { ...searchState }, message: \`Kiểm tra arr[\${i}] = \${arr[i]}\`, codeLine: 2 };
        if (arr[i] === target) {
            searchState.found = true;
            searchState.foundIndex = i;
            yield { searchState: { ...searchState }, message: \`Tìm thấy \${target} tại vị trí \${i}!\`, codeLine: 3 };
            return;
        }
    }
    searchState.found = false; searchState.current = undefined;
    yield { searchState: { ...searchState }, message: \`Không tìm thấy \${target}\`, codeLine: 5 };
}`
    },
    binary: {
        code: `export const binarySearchSnippets = {
  javascript: \`function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}\`
};`,
        logic: `import { DSAnimationStep, SearchStateData } from "@/lib/data-structures/types";
export function* binarySearchLogic(arr: number[], target: number): Generator<DSAnimationStep> {
    const searchState: SearchStateData = { array: [...arr], target, left: 0, right: arr.length - 1 };
    yield { searchState: { ...searchState }, message: 'Khởi tạo left = 0, right = ' + (arr.length-1), codeLine: 2 };
    
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        searchState.left = left; searchState.right = right;
        yield { searchState: { ...searchState }, message: \`Khoảng tìm kiếm: [\${left}, \${right}]\`, codeLine: 4 };
        
        let mid = Math.floor((left + right) / 2);
        searchState.mid = mid; searchState.current = mid;
        yield { searchState: { ...searchState }, message: \`mid = \${mid}. Kiểm tra arr[\${mid}] = \${arr[mid]}\`, codeLine: 5 };
        
        if (arr[mid] === target) {
            searchState.found = true; searchState.foundIndex = mid;
            yield { searchState: { ...searchState }, message: \`Tìm thấy \${target} tại vị trí \${mid}!\`, codeLine: 6 };
            return;
        }
        
        if (arr[mid] < target) {
            left = mid + 1;
            yield { searchState: { ...searchState }, message: \`\${arr[mid]} < \${target}, tìm nửa phải (left = \${left})\`, codeLine: 7 };
        } else {
            right = mid - 1;
            yield { searchState: { ...searchState }, message: \`\${arr[mid]} > \${target}, tìm nửa trái (right = \${right})\`, codeLine: 8 };
        }
    }
    searchState.found = false; searchState.left = undefined; searchState.right = undefined; searchState.mid = undefined; searchState.current = undefined;
    yield { searchState: { ...searchState }, message: \`Không tìm thấy \${target}\`, codeLine: 10 };
}`
    },
    ternary: {
        code: `export const ternarySearchSnippets = {
  javascript: \`function ternarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    let mid1 = left + Math.floor((right - left) / 3);
    let mid2 = right - Math.floor((right - left) / 3);
    if (arr[mid1] === target) return mid1;
    if (arr[mid2] === target) return mid2;
    if (target < arr[mid1]) right = mid1 - 1;
    else if (target > arr[mid2]) left = mid2 + 1;
    else { left = mid1 + 1; right = mid2 - 1; }
  }
  return -1;
}\`
};`,
        logic: `import { DSAnimationStep, SearchStateData } from "@/lib/data-structures/types";
export function* ternarySearchLogic(arr: number[], target: number): Generator<DSAnimationStep> {
    const searchState: SearchStateData = { array: [...arr], target, left: 0, right: arr.length - 1 };
    yield { searchState: { ...searchState }, message: 'Ternary Search chia khoảng làm 3 phần', codeLine: 2 };
    
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        searchState.left = left; searchState.right = right;
        let mid1 = left + Math.floor((right - left) / 3);
        let mid2 = right - Math.floor((right - left) / 3);
        searchState.mid = mid1; searchState.current = mid2; // Dùng mid cho mid1, current cho mid2 tạm thời
        
        yield { searchState: { ...searchState }, message: \`Tìm khoảng [\${left}, \${right}]. mid1=\${mid1}, mid2=\${mid2}\`, codeLine: 4 };
        
        if (arr[mid1] === target) {
            searchState.found = true; searchState.foundIndex = mid1; searchState.current = undefined;
            yield { searchState: { ...searchState }, message: \`Tìm thấy \${target} tại \${mid1}!\`, codeLine: 6 }; return;
        }
        if (arr[mid2] === target) {
            searchState.found = true; searchState.foundIndex = mid2; searchState.mid = undefined;
            yield { searchState: { ...searchState }, message: \`Tìm thấy \${target} tại \${mid2}!\`, codeLine: 7 }; return;
        }
        
        if (target < arr[mid1]) {
            right = mid1 - 1;
            yield { searchState: { ...searchState }, message: \`\${target} < \${arr[mid1]}, tìm phần trái (right = \${right})\`, codeLine: 8 };
        } else if (target > arr[mid2]) {
            left = mid2 + 1;
            yield { searchState: { ...searchState }, message: \`\${target} > \${arr[mid2]}, tìm phần phải (left = \${left})\`, codeLine: 9 };
        } else {
            left = mid1 + 1; right = mid2 - 1;
            yield { searchState: { ...searchState }, message: \`Tìm phần giữa [\${left}, \${right}]\`, codeLine: 10 };
        }
    }
    searchState.found = false;
    yield { searchState: { ...searchState }, message: \`Không tìm thấy \${target}\`, codeLine: 12 };
}`
    },
    interpolation: {
        code: `export const interpolationSearchSnippets = {
  javascript: \`function interpolationSearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right && target >= arr[left] && target <= arr[right]) {
    if (left === right) {
      if (arr[left] === target) return left;
      return -1;
    }
    let pos = left + Math.floor(((target - arr[left]) * (right - left)) / (arr[right] - arr[left]));
    if (arr[pos] === target) return pos;
    if (arr[pos] < target) left = pos + 1;
    else right = pos - 1;
  }
  return -1;
}\`
};`,
        logic: `import { DSAnimationStep, SearchStateData } from "@/lib/data-structures/types";
export function* interpolationSearchLogic(arr: number[], target: number): Generator<DSAnimationStep> {
    const searchState: SearchStateData = { array: [...arr], target, left: 0, right: arr.length - 1 };
    yield { searchState: { ...searchState }, message: 'Interpolation Search: Dự đoán vị trí', codeLine: 2 };
    
    let left = 0, right = arr.length - 1;
    while (left <= right && target >= arr[left] && target <= arr[right]) {
        searchState.left = left; searchState.right = right;
        if (left === right) {
            if (arr[left] === target) {
                searchState.found = true; searchState.foundIndex = left;
                yield { searchState: { ...searchState }, message: \`Tìm thấy tại \${left}!\`, codeLine: 5 }; return;
            }
            break;
        }
        
        let pos = left + Math.floor(((target - arr[left]) * (right - left)) / (arr[right] - arr[left]));
        searchState.mid = pos; searchState.current = pos;
        yield { searchState: { ...searchState }, message: \`Dự đoán vị trí (pos) = \${pos}, arr[\${pos}] = \${arr[pos]}\`, codeLine: 9 };
        
        if (arr[pos] === target) {
            searchState.found = true; searchState.foundIndex = pos;
            yield { searchState: { ...searchState }, message: \`Tìm thấy tại \${pos}!\`, codeLine: 10 }; return;
        }
        if (arr[pos] < target) {
            left = pos + 1;
            yield { searchState: { ...searchState }, message: \`\${arr[pos]} < \${target}, tìm bên phải (left = \${left})\`, codeLine: 11 };
        } else {
            right = pos - 1;
            yield { searchState: { ...searchState }, message: \`\${arr[pos]} > \${target}, tìm bên trái (right = \${right})\`, codeLine: 12 };
        }
    }
    searchState.found = false;
    yield { searchState: { ...searchState }, message: \`Không tìm thấy \${target}\`, codeLine: 14 };
}`
    },
    jump: {
        code: `export const jumpSearchSnippets = {
  javascript: \`function jumpSearch(arr, target) {
  let n = arr.length;
  let step = Math.floor(Math.sqrt(n));
  let prev = 0;
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, n)) return -1;
  }
  if (arr[prev] === target) return prev;
  return -1;
}\`
};`,
        logic: `import { DSAnimationStep, SearchStateData } from "@/lib/data-structures/types";
export function* jumpSearchLogic(arr: number[], target: number): Generator<DSAnimationStep> {
    const searchState: SearchStateData = { array: [...arr], target };
    let n = arr.length;
    let step = Math.floor(Math.sqrt(n));
    let prev = 0;
    
    yield { searchState: { ...searchState }, message: \`Bước nhảy (step) = √\${n} ≈ \${step}\`, codeLine: 3 };
    
    while (arr[Math.min(step, n) - 1] < target) {
        searchState.left = prev; searchState.right = Math.min(step, n) - 1;
        yield { searchState: { ...searchState }, message: \`arr[\${searchState.right}] = \${arr[searchState.right]} < \${target}, nhảy tiếp!\`, codeLine: 5 };
        prev = step;
        step += Math.floor(Math.sqrt(n));
        if (prev >= n) break;
    }
    
    searchState.left = prev; searchState.right = Math.min(step, n) - 1;
    yield { searchState: { ...searchState }, message: \`Dừng nhảy. Khoảng tìm kiếm: [\${searchState.left}, \${searchState.right}]\`, codeLine: 10 };
    
    while (prev < Math.min(step, n) && arr[prev] < target) {
        searchState.current = prev;
        yield { searchState: { ...searchState }, message: \`Linear search tại \${prev} (arr[\${prev}] = \${arr[prev]})\`, codeLine: 11 };
        prev++;
    }
    
    searchState.current = prev;
    if (prev < n && arr[prev] === target) {
        searchState.found = true; searchState.foundIndex = prev;
        yield { searchState: { ...searchState }, message: \`Tìm thấy tại \${prev}!\`, codeLine: 15 };
    } else {
        searchState.found = false;
        yield { searchState: { ...searchState }, message: \`Không tìm thấy!\`, codeLine: 16 };
    }
}`
    },
    exponential: {
        code: `export const exponentialSearchSnippets = {
  javascript: \`function exponentialSearch(arr, target) {
  if (arr[0] === target) return 0;
  let i = 1;
  while (i < arr.length && arr[i] <= target) {
    i = i * 2;
  }
  // Binary Search on arr[i/2 ... min(i, arr.length - 1)]
  let left = i / 2, right = Math.min(i, arr.length - 1);
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}\`
};`,
        logic: `import { DSAnimationStep, SearchStateData } from "@/lib/data-structures/types";
export function* exponentialSearchLogic(arr: number[], target: number): Generator<DSAnimationStep> {
    const searchState: SearchStateData = { array: [...arr], target };
    
    searchState.current = 0;
    yield { searchState: { ...searchState }, message: 'Kiểm tra arr[0]', codeLine: 2 };
    if (arr[0] === target) {
        searchState.found = true; searchState.foundIndex = 0;
        yield { searchState: { ...searchState }, message: 'Tìm thấy tại 0!', codeLine: 2 }; return;
    }
    
    let i = 1;
    while (i < arr.length && arr[i] <= target) {
        searchState.current = i;
        yield { searchState: { ...searchState }, message: \`arr[\${i}] = \${arr[i]} <= \${target}. Nhân đôi i = \${i*2}\`, codeLine: 4 };
        i = i * 2;
    }
    
    let left = i / 2, right = Math.min(i, arr.length - 1);
    searchState.current = undefined; searchState.left = left; searchState.right = right;
    yield { searchState: { ...searchState }, message: \`Phạm vi Binary Search: [\${left}, \${right}]\`, codeLine: 8 };
    
    while (left <= right) {
        searchState.left = left; searchState.right = right;
        let mid = Math.floor((left + right) / 2);
        searchState.mid = mid; searchState.current = mid;
        yield { searchState: { ...searchState }, message: \`Binary Search: mid=\${mid}, arr[\${mid}]=\${arr[mid]}\`, codeLine: 10 };
        
        if (arr[mid] === target) {
            searchState.found = true; searchState.foundIndex = mid;
            yield { searchState: { ...searchState }, message: \`Tìm thấy tại \${mid}!\`, codeLine: 12 }; return;
        }
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    searchState.found = false;
    yield { searchState: { ...searchState }, message: 'Không tìm thấy!', codeLine: 16 };
}`
    }
};

for (const [key, val] of Object.entries(algos)) {
    fs.writeFileSync(`src/lib/search/${key}SearchCode.ts`, val.code);
    fs.writeFileSync(`src/lib/search/${key}SearchLogic.ts`, val.logic);
}
