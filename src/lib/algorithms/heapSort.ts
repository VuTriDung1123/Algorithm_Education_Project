import { AnimationStep } from './types';

let comparisons = 0;
let swaps = 0;

function* heapify(
  arr: number[],
  n: number,
  i: number,
  sortedIndices: number[]
): Generator<AnimationStep> {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  // So sánh với con trái
  if (left < n) {
    comparisons++;
    yield {
      type: 'COMPARE',
      indices: [left, largest],
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
      message: `Heapify: Compare Parent(${arr[largest]}) vs Left Child(${arr[left]}).`,
      variables: { heapSize: n, parent: largest, child: left, compareVal1: arr[largest], compareVal2: arr[left] },
      counts: { comparisons, swaps }
    };

    if (arr[left] > arr[largest]) {
      largest = left;
    }
  }

  // So sánh với con phải
  if (right < n) {
    comparisons++;
    yield {
      type: 'COMPARE',
      indices: [right, largest],
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
      message: `Heapify: Compare Current Max(${arr[largest]}) vs Right Child(${arr[right]}).`,
      variables: { heapSize: n, parent: largest, child: right, compareVal1: arr[largest], compareVal2: arr[right] },
      counts: { comparisons, swaps }
    };

    if (arr[right] > arr[largest]) {
      largest = right;
    }
  }

  // Nếu Parent không phải lớn nhất -> Swap và Heapify tiếp
  if (largest !== i) {
    const temp = arr[i];
    arr[i] = arr[largest];
    arr[largest] = temp;
    swaps++;

    yield {
      type: 'SWAP',
      indices: [i, largest],
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
      message: `Swap Parent(${temp}) with larger Child(${arr[i]}).`,
      variables: { heapSize: n, parent: i, child: largest },
      counts: { comparisons, swaps }
    };

    // Đệ quy heapify cây con bị ảnh hưởng
    yield* heapify(arr, n, largest, sortedIndices);
  }
}

function* heapSortGenerator(array: number[]): Generator<AnimationStep> {
  const arr = [...array];
  const n = arr.length;
  const sortedIndices: number[] = [];
  comparisons = 0;
  swaps = 0;

  // 1. Build Max Heap
  yield {
    type: 'COMPARE',
    indices: [],
    arrayState: [...arr],
    sortedIndices: [],
    message: "Phase 1: Build Max Heap (Rearrange array).",
    variables: { heapSize: n },
    counts: { comparisons, swaps }
  };

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(arr, n, i, sortedIndices);
  }

  yield {
    type: 'COMPARE',
    indices: [],
    arrayState: [...arr],
    sortedIndices: [],
    message: "Max Heap built! The root (index 0) is now the largest element.",
    variables: { heapSize: n },
    counts: { comparisons, swaps }
  };

  // 2. Extract elements one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;
    swaps++;

    sortedIndices.push(i); // i đã vào vị trí sorted

    yield {
      type: 'SWAP',
      indices: [0, i],
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
      message: `Extract Max: Move root (${temp}) to sorted position ${i}.`,
      variables: { heapSize: i, parent: 0, child: i }, // heapSize giảm xuống i
      counts: { comparisons, swaps }
    };

    // Call max heapify on the reduced heap
    yield* heapify(arr, i, 0, sortedIndices);
  }

  sortedIndices.push(0); // Phần tử cuối cùng cũng sorted

  yield {
    type: 'SORTED',
    indices: [],
    arrayState: [...arr],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    message: "Heap Sort Completed!",
    variables: { heapSize: 0 },
    counts: { comparisons, swaps }
  };
}

export function generateHeapSortTimeline(initialArray: number[]): AnimationStep[] {
  const generator = heapSortGenerator(initialArray);
  const timeline: AnimationStep[] = [];

  timeline.push({
    type: 'COMPARE',
    indices: [],
    arrayState: [...initialArray],
    sortedIndices: [],
    message: "Ready to start Heap Sort...",
    variables: { heapSize: initialArray.length },
    counts: { comparisons: 0, swaps: 0 }
  });

  for (const step of generator) {
    timeline.push(step);
  }

  return timeline;
}