import { AnimationStep } from './types';

// Biến toàn cục đếm trong phiên chạy
let comparisons = 0;
let writes = 0; // Thay cho swaps

function* merge(
  arr: number[],
  left: number,
  mid: number,
  right: number,
  sortedIndices: number[]
): Generator<AnimationStep> {
  const n1 = mid - left + 1;
  const n2 = right - mid;

  // Tạo mảng tạm
  const L = arr.slice(left, mid + 1);
  const R = arr.slice(mid + 1, right + 1);

  let i = 0, j = 0, k = left;

  yield {
    type: 'MERGE',
    indices: [left, right],
    arrayState: [...arr],
    sortedIndices: [...sortedIndices],
    message: `Merge range [${left}...${mid}] and [${mid + 1}...${right}].`,
    variables: { left, right, mid, i, j, k },
    counts: { comparisons, swaps: writes }
  };

  while (i < n1 && j < n2) {
    comparisons++;
    yield {
      type: 'COMPARE',
      indices: [left + i, mid + 1 + j], // Highlight vị trí đang so sánh
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
      message: `Compare: Left(${L[i]}) vs Right(${R[j]}).`,
      variables: { left, mid, right, i, j, k, compareVal1: L[i], compareVal2: R[j] },
      counts: { comparisons, swaps: writes }
    };

    if (L[i] <= R[j]) {
      arr[k] = L[i];
      writes++;
      yield {
        type: 'OVERWRITE',
        indices: [k],
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
        message: `Take Left(${L[i]}) -> Position ${k}.`,
        variables: { k, overwriteVal: L[i] },
        counts: { comparisons, swaps: writes }
      };
      i++;
    } else {
      arr[k] = R[j];
      writes++;
      yield {
        type: 'OVERWRITE',
        indices: [k],
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
        message: `Take Right(${R[j]}) -> Position ${k}.`,
        variables: { k, overwriteVal: R[j] },
        counts: { comparisons, swaps: writes }
      };
      j++;
    }
    k++;
  }

  // Copy phần còn lại của L
  while (i < n1) {
    arr[k] = L[i];
    writes++;
    yield {
      type: 'OVERWRITE',
      indices: [k],
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
      message: `Take remaining Left(${L[i]}) -> Position ${k}.`,
      variables: { k, overwriteVal: L[i] },
      counts: { comparisons, swaps: writes }
    };
    i++;
    k++;
  }

  // Copy phần còn lại của R
  while (j < n2) {
    arr[k] = R[j];
    writes++;
    yield {
      type: 'OVERWRITE',
      indices: [k],
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
      message: `Take remaining Right(${R[j]}) -> Position ${k}.`,
      variables: { k, overwriteVal: R[j] },
      counts: { comparisons, swaps: writes }
    };
    j++;
    k++;
  }
}

function* mergeSortHelper(
  arr: number[],
  left: number,
  right: number,
  sortedIndices: number[]
): Generator<AnimationStep> {
  if (left >= right) return;

  const mid = Math.floor((left + right) / 2);

  // DIVIDE LEFT
  yield {
    type: 'DIVIDE',
    indices: [left, mid],
    arrayState: [...arr],
    sortedIndices: [...sortedIndices],
    message: `Divide: Process left side [${left}...${mid}].`,
    variables: { left, right, mid },
    counts: { comparisons, swaps: writes }
  };
  yield* mergeSortHelper(arr, left, mid, sortedIndices);

  // DIVIDE RIGHT
  yield {
    type: 'DIVIDE',
    indices: [mid + 1, right],
    arrayState: [...arr],
    sortedIndices: [...sortedIndices],
    message: `Divide: Process right side [${mid + 1}...${right}].`,
    variables: { left, right, mid },
    counts: { comparisons, swaps: writes }
  };
  yield* mergeSortHelper(arr, mid + 1, right, sortedIndices);

  // MERGE
  yield* merge(arr, left, mid, right, sortedIndices);
}

export function generateMergeSortTimeline(initialArray: number[]): AnimationStep[] {
  const arr = [...initialArray];
  comparisons = 0;
  writes = 0;
  const generator = mergeSortHelper(arr, 0, arr.length - 1, []);
  const timeline: AnimationStep[] = [];

  timeline.push({
    type: 'DIVIDE',
    indices: [],
    arrayState: [...initialArray],
    sortedIndices: [],
    message: "Start Merge Sort...",
    variables: {},
    counts: { comparisons: 0, swaps: 0 }
  });

  for (const step of generator) {
    timeline.push(step);
  }

  // Final sorted state
  timeline.push({
    type: 'SORTED',
    indices: [],
    arrayState: [...arr],
    sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
    message: "Merge Sort Completed!",
    variables: {},
    counts: { comparisons, swaps: writes }
  });

  return timeline;
}