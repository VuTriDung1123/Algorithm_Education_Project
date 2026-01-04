import { AnimationStep } from './types';

// Cấu hình số lượng thùng
const BUCKET_COUNT = 5;
const MAX_VAL = 100; // Giả sử max value là 100 để chia range cho đẹp

function getBucketIndex(value: number): number {
  // Công thức: floor( 5 * value / 100 )
  // Ví dụ: value 99 -> index 4. value 5 -> index 0.
  const idx = Math.floor((BUCKET_COUNT * value) / (MAX_VAL + 1));
  return Math.min(idx, BUCKET_COUNT - 1); // Clamp
}

function* bucketSortGenerator(array: number[]): Generator<AnimationStep> {
  const arr = [...array];
  const n = arr.length;
  
  // Init buckets
  const buckets: number[][] = Array.from({ length: BUCKET_COUNT }, () => []);
  const bucketRanges = Array.from({ length: BUCKET_COUNT }, (_, i) => {
    const start = Math.floor((i * (MAX_VAL + 1)) / BUCKET_COUNT);
    const end = Math.floor(((i + 1) * (MAX_VAL + 1)) / BUCKET_COUNT) - 1;
    return `${start}-${end}`;
  });

  let moves = 0;
  let comparisons = 0; // Dùng đếm lúc sort internal

  // PHA 1: SCATTER (Phân phối)
  yield {
    type: 'BUCKET_SCATTER',
    indices: [],
    arrayState: [...arr],
    sortedIndices: [],
    message: "Phase 1: Scatter elements into buckets based on ranges.",
    variables: { buckets: JSON.parse(JSON.stringify(buckets)), bucketRanges },
    counts: { comparisons, swaps: moves }
  };

  for (let i = 0; i < n; i++) {
    const val = arr[i];
    const bIdx = getBucketIndex(val);
    
    buckets[bIdx].push(val);
    moves++;

    yield {
      type: 'BUCKET_SCATTER',
      indices: [i],
      arrayState: [...arr],
      sortedIndices: [],
      message: `Value ${val} falls into range [${bucketRanges[bIdx]}] -> Bucket ${bIdx}.`,
      variables: { val, activeBucket: bIdx, buckets: JSON.parse(JSON.stringify(buckets)), bucketRanges },
      counts: { comparisons, swaps: moves }
    };
  }

  // PHA 2: SORT INTERNAL (Sắp xếp từng thùng)
  for (let i = 0; i < BUCKET_COUNT; i++) {
    if (buckets[i].length > 1) {
      // Đơn giản hóa: Sort mảng con và update visual
      // Trong thực tế sẽ dùng Insertion Sort, ở đây ta sort nhanh và báo hiệu
      buckets[i].sort((a, b) => {
          comparisons++;
          return a - b;
      });
      
      yield {
        type: 'BUCKET_SORT_INTERNAL',
        indices: [],
        arrayState: [...arr], // Mảng chính chưa đổi
        sortedIndices: [],
        message: `Phase 2: Sort Bucket ${i} (Insertion Sort internally).`,
        variables: { activeBucket: i, buckets: JSON.parse(JSON.stringify(buckets)), bucketRanges },
        counts: { comparisons, swaps: moves }
      };
    }
  }

  // PHA 3: GATHER (Gom lại)
  let k = 0;
  for (let i = 0; i < BUCKET_COUNT; i++) {
    while (buckets[i].length > 0) {
      const val = buckets[i].shift()!; // Lấy phần tử đầu tiên (đã sort)
      arr[k] = val;
      moves++;

      yield {
        type: 'BUCKET_GATHER',
        indices: [k],
        arrayState: [...arr],
        sortedIndices: Array.from({ length: k + 1 }, (_, x) => x), // Đánh dấu sorted dần
        message: `Phase 3: Gather ${val} from Bucket ${i} back to Array index ${k}.`,
        variables: { val, activeBucket: i, buckets: JSON.parse(JSON.stringify(buckets)), bucketRanges },
        counts: { comparisons, swaps: moves }
      };
      k++;
    }
  }

  yield {
    type: 'SORTED',
    indices: [],
    arrayState: [...arr],
    sortedIndices: Array.from({ length: n }, (_, x) => x),
    message: "Bucket Sort Completed!",
    variables: { buckets: Array.from({ length: BUCKET_COUNT }, () => []), bucketRanges },
    counts: { comparisons, swaps: moves }
  };
}

export function generateBucketSortTimeline(initialArray: number[]): AnimationStep[] {
  const generator = bucketSortGenerator(initialArray);
  const timeline: AnimationStep[] = [];

  // Step init
  const bucketRanges = Array.from({ length: BUCKET_COUNT }, (_, i) => {
    const start = Math.floor((i * (MAX_VAL + 1)) / BUCKET_COUNT);
    const end = Math.floor(((i + 1) * (MAX_VAL + 1)) / BUCKET_COUNT) - 1;
    return `${start}-${end}`;
  });

  timeline.push({
    type: 'BUCKET_SCATTER',
    indices: [],
    arrayState: [...initialArray],
    sortedIndices: [],
    message: "Ready to start Bucket Sort...",
    variables: { buckets: Array.from({ length: BUCKET_COUNT }, () => []), bucketRanges },
    counts: { comparisons: 0, swaps: 0 }
  });

  for (const step of generator) {
    timeline.push(step);
  }

  return timeline;
}