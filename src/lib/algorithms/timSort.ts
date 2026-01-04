import { AnimationStep } from './types';

// Cấu hình Run nhỏ để visualizer hiển thị được nhiều bước
const MIN_MERGE = 4;

let comparisons = 0;
let writes = 0;

// 1. Insertion Sort cho từng Run
function* insertionSort(
  arr: number[], 
  left: number, 
  right: number, 
  sortedIndices: number[]
): Generator<AnimationStep> {
  
  for (let i = left + 1; i <= right; i++) {
    const key = arr[i];
    let j = i - 1;

    yield {
      type: 'COMPARE', // Dùng type này để highlight Key
      indices: [i],
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
      message: `Run [${left}-${right}]: Pick ${key} as Key for Insertion.`,
      variables: { i, j, keyVal: key, runStart: left, runEnd: right },
      counts: { comparisons, swaps: writes }
    };

    while (j >= left) {
      comparisons++;
      yield {
        type: 'COMPARE',
        indices: [j, j + 1], 
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
        message: `Compare: ${arr[j]} > Key (${key})?`,
        variables: { i, j, keyVal: key, compareVal1: arr[j], compareVal2: key, runStart: left, runEnd: right },
        counts: { comparisons, swaps: writes }
      };

      if (arr[j] > key) {
        arr[j + 1] = arr[j];
        writes++;
        yield {
          type: 'SHIFT',
          indices: [j, j + 1],
          arrayState: [...arr],
          sortedIndices: [...sortedIndices],
          message: `Yes. Shift ${arr[j]} to right.`,
          variables: { i, j, keyVal: key, compareVal1: arr[j], compareVal2: key, runStart: left, runEnd: right },
          counts: { comparisons, swaps: writes }
        };
        j--;
      } else {
        break;
      }
    }
    arr[j + 1] = key;
    writes++;
    yield {
      type: 'INSERT',
      indices: [j + 1],
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
      message: `Insert Key (${key}) at position ${j + 1}.`,
      variables: { i, j: -1, keyVal: key, runStart: left, runEnd: right },
      counts: { comparisons, swaps: writes }
    };
  }
}

// 2. Merge hai Runs
function* merge(
  arr: number[], 
  l: number, 
  m: number, 
  r: number, 
  sortedIndices: number[]
): Generator<AnimationStep> {
  const len1 = m - l + 1;
  const len2 = r - m;
  const leftArr = new Array(len1);
  const rightArr = new Array(len2);

  for (let x = 0; x < len1; x++) leftArr[x] = arr[l + x];
  for (let x = 0; x < len2; x++) rightArr[x] = arr[m + 1 + x];

  let i = 0, j = 0, k = l;

  yield {
    type: 'TIM_MERGE_START',
    indices: [l, r],
    arrayState: [...arr],
    sortedIndices: [...sortedIndices],
    message: `Merge Phase: Merging run [${l}-${m}] and [${m+1}-${r}].`,
    variables: { left: l, mid: m, right: r },
    counts: { comparisons, swaps: writes }
  };

  while (i < len1 && j < len2) {
    comparisons++;
    yield {
      type: 'COMPARE', // Tái sử dụng type COMPARE để Practice Mode dễ bắt
      indices: [l + i, m + 1 + j], 
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
      message: `Compare L(${leftArr[i]}) vs R(${rightArr[j]}).`,
      variables: { left: l, mid: m, right: r, compareVal1: leftArr[i], compareVal2: rightArr[j], i, j, k }, // i, j ở đây là local index
      counts: { comparisons, swaps: writes }
    };

    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i];
      writes++;
      yield {
        type: 'OVERWRITE',
        indices: [k],
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
        message: `Take L(${leftArr[i]}) -> Position ${k}.`,
        variables: { left: l, mid: m, right: r, overwriteVal: leftArr[i], k },
        counts: { comparisons, swaps: writes }
      };
      i++;
    } else {
      arr[k] = rightArr[j];
      writes++;
      yield {
        type: 'OVERWRITE',
        indices: [k],
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
        message: `Take R(${rightArr[j]}) -> Position ${k}.`,
        variables: { left: l, mid: m, right: r, overwriteVal: rightArr[j], k },
        counts: { comparisons, swaps: writes }
      };
      j++;
    }
    k++;
  }

  while (i < len1) {
    arr[k] = leftArr[i];
    writes++;
    yield {
        type: 'OVERWRITE',
        indices: [k],
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
        message: `Take remaining L(${leftArr[i]}) -> Position ${k}.`,
        variables: { left: l, mid: m, right: r, overwriteVal: leftArr[i], k },
        counts: { comparisons, swaps: writes }
    };
    i++; k++;
  }

  while (j < len2) {
    arr[k] = rightArr[j];
    writes++;
    yield {
        type: 'OVERWRITE',
        indices: [k],
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
        message: `Take remaining R(${rightArr[j]}) -> Position ${k}.`,
        variables: { left: l, mid: m, right: r, overwriteVal: rightArr[j], k },
        counts: { comparisons, swaps: writes }
    };
    j++; k++;
  }
}

function* timSortGenerator(array: number[]): Generator<AnimationStep> {
  const arr = [...array];
  const n = arr.length;
  comparisons = 0;
  writes = 0;

  // 1. Insertion Sort từng Run nhỏ
  for (let i = 0; i < n; i += MIN_MERGE) {
    const end = Math.min(i + MIN_MERGE - 1, n - 1);
    yield {
        type: 'TIM_RUN_START',
        indices: [i, end],
        arrayState: [...arr],
        sortedIndices: [],
        message: `Processing Run from index ${i} to ${end}. Applying Insertion Sort.`,
        variables: { runStart: i, runEnd: end },
        counts: { comparisons, swaps: writes }
    };
    yield* insertionSort(arr, i, end, []);
  }

  // 2. Merge các Run
  for (let size = MIN_MERGE; size < n; size = 2 * size) {
    for (let left = 0; left < n; left += 2 * size) {
      const mid = left + size - 1;
      const right = Math.min(left + 2 * size - 1, n - 1);

      if (mid < right) {
        yield* merge(arr, left, mid, right, []);
      }
    }
  }

  yield {
    type: 'SORTED',
    indices: [],
    arrayState: [...arr],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    message: "Tim Sort Completed!",
    variables: {},
    counts: { comparisons, swaps: writes }
  };
}

export function generateTimSortTimeline(initialArray: number[]): AnimationStep[] {
  const generator = timSortGenerator(initialArray);
  const timeline: AnimationStep[] = [];

  timeline.push({
    type: 'TIM_RUN_START',
    indices: [],
    arrayState: [...initialArray],
    sortedIndices: [],
    message: "Ready to start Tim Sort (Min Run = 4)...",
    variables: {},
    counts: { comparisons: 0, swaps: 0 }
  });

  for (const step of generator) {
    timeline.push(step);
  }

  return timeline;
}