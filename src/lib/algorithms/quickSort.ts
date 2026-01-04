import { AnimationStep } from './types';

let comparisons = 0;
let swaps = 0;

function* partition(
  arr: number[],
  low: number,
  high: number,
  sortedIndices: number[]
): Generator<AnimationStep> {
  // Chọn phần tử cuối cùng làm Pivot
  const pivot = arr[high];
  let i = low - 1; // Index của phần tử nhỏ hơn pivot

  yield {
    type: 'PIVOT',
    indices: [high],
    arrayState: [...arr],
    sortedIndices: [...sortedIndices],
    message: `Partition [${low}...${high}]: Pick ${pivot} (at index ${high}) as PIVOT.`,
    variables: { left: low, right: high, pivotIdx: high, i, j: low },
    counts: { comparisons, swaps }
  };

  for (let j = low; j < high; j++) {
    comparisons++;
    
    yield {
      type: 'COMPARE',
      indices: [j, high], // So sánh phần tử J với Pivot
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
      message: `Compare: Is ${arr[j]} < Pivot (${pivot})?`,
      variables: { left: low, right: high, pivotIdx: high, i, j, compareVal1: arr[j], compareVal2: pivot },
      counts: { comparisons, swaps }
    };

    if (arr[j] < pivot) {
      i++;
      // Swap arr[i] và arr[j]
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
      swaps++;

      yield {
        type: 'SWAP',
        indices: [i, j],
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
        message: `Yes! ${temp} < ${pivot}. Move it to left partition (Swap index ${i} & ${j}).`,
        variables: { left: low, right: high, pivotIdx: high, i, j },
        counts: { comparisons, swaps }
      };
    }
  }

  // Đưa Pivot về đúng vị trí (i + 1)
  const temp = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = temp;
  swaps++;

  yield {
    type: 'SWAP',
    indices: [i + 1, high],
    arrayState: [...arr],
    sortedIndices: [...sortedIndices],
    message: `Partition done. Move Pivot (${pivot}) to correct position ${i + 1}.`,
    variables: { left: low, right: high, pivotIdx: i + 1, i: i + 1 },
    counts: { comparisons, swaps }
  };

  return i + 1; // Trả về vị trí pivot mới
}

function* quickSortHelper(
  arr: number[],
  low: number,
  high: number,
  sortedIndices: number[]
): Generator<AnimationStep> {
  if (low < high) {
    // Partitioning Index
    const piIterator = partition(arr, low, high, sortedIndices);
    let piResult: IteratorResult<AnimationStep, number>;
    
    // Chạy generator con (partition) và yield từng bước
    while (true) {
        piResult = piIterator.next();
        if (piResult.done) break;
        yield piResult.value;
    }
    
    const pi = piResult.value;

    // Đệ quy sắp xếp 2 bên
    // Lưu ý: Sau khi partition xong, phần tử tại pi đã đứng đúng chỗ -> Có thể coi là sorted tạm thời
    sortedIndices.push(pi); 
    
    yield* quickSortHelper(arr, low, pi - 1, sortedIndices);
    yield* quickSortHelper(arr, pi + 1, high, sortedIndices);
  } else if (low === high) {
      // Trường hợp mảng con có 1 phần tử -> Đã sort
      sortedIndices.push(low);
      yield {
        type: 'SORTED',
        indices: [low],
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
        message: `Element at ${low} is sorted (single element).`,
        variables: { left: low, right: high },
        counts: { comparisons, swaps }
      };
  }
}

export function generateQuickSortTimeline(initialArray: number[]): AnimationStep[] {
  const arr = [...initialArray];
  comparisons = 0;
  swaps = 0;
  const generator = quickSortHelper(arr, 0, arr.length - 1, []);
  const timeline: AnimationStep[] = [];

  timeline.push({
    type: 'PIVOT', // Dùng type này để init
    indices: [],
    arrayState: [...initialArray],
    sortedIndices: [],
    message: "Ready to start Quick Sort...",
    variables: { left: 0, right: arr.length - 1 },
    counts: { comparisons: 0, swaps: 0 }
  });

  for (const step of generator) {
    timeline.push(step);
  }

  // Final step
  timeline.push({
    type: 'SORTED',
    indices: [],
    arrayState: [...arr],
    sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
    message: "Quick Sort Completed!",
    variables: {},
    counts: { comparisons, swaps }
  });

  return timeline;
}