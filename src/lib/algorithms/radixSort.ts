import { AnimationStep } from './types';

function getMax(arr: number[]) {
  let max = arr[0];
  for (const item of arr) if (item > max) max = item;
  return max;
}

function* radixSortGenerator(array: number[]): Generator<AnimationStep> {
  const arr = [...array];
  const max = getMax(arr);
  
  // Khởi tạo 10 thùng rỗng
  const buckets: number[][] = Array.from({ length: 10 }, () => []);
  
  let operations = 0;
  let moves = 0;

  // Chạy qua từng hàng: 1s, 10s, 100s...
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    
    // PHA 1: SCATTER (Phân phối vào thùng)
    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      const digit = Math.floor(val / exp) % 10;
      operations++;

      yield {
        type: 'GET_DIGIT',
        indices: [i],
        arrayState: [...arr],
        sortedIndices: [],
        message: `Check number ${val} at place ${exp}. Digit is ${digit}.`,
        variables: { digitPlace: exp, digitVal: digit, buckets: JSON.parse(JSON.stringify(buckets)) },
        counts: { comparisons: operations, swaps: moves }
      };

      buckets[digit].push(val);
      moves++;

      yield {
        type: 'BUCKET_PUSH',
        indices: [i],
        arrayState: [...arr], // Mảng chính vẫn giữ nguyên trong lúc phân phối (logic visual)
        sortedIndices: [],
        message: `Push ${val} into Bucket ${digit}.`,
        variables: { digitPlace: exp, digitVal: digit, buckets: JSON.parse(JSON.stringify(buckets)), activeBucket: digit },
        counts: { comparisons: operations, swaps: moves }
      };
    }

    // PHA 2: GATHER (Gom lại về mảng)
    let idx = 0;
    for (let b = 0; b < 10; b++) {
      while (buckets[b].length > 0) {
        const val = buckets[b].shift()!; // Lấy ra (FIFO)
        arr[idx] = val;
        moves++;

        yield {
          type: 'BUCKET_POP',
          indices: [idx],
          arrayState: [...arr],
          sortedIndices: [],
          message: `Pop ${val} from Bucket ${b} back to Array index ${idx}.`,
          variables: { digitPlace: exp, buckets: JSON.parse(JSON.stringify(buckets)), activeBucket: b },
          counts: { comparisons: operations, swaps: moves }
        };
        idx++;
      }
    }
  }

  yield {
    type: 'SORTED',
    indices: [],
    arrayState: [...arr],
    sortedIndices: Array.from({ length: arr.length }, (_, k) => k),
    message: "Radix Sort Completed!",
    variables: { buckets: Array.from({ length: 10 }, () => []) },
    counts: { comparisons: operations, swaps: moves }
  };
}

export function generateRadixSortTimeline(initialArray: number[]): AnimationStep[] {
  const generator = radixSortGenerator(initialArray);
  const timeline: AnimationStep[] = [];

  timeline.push({
    type: 'GET_DIGIT',
    indices: [],
    arrayState: [...initialArray],
    sortedIndices: [],
    message: "Ready to start Radix Sort...",
    variables: { buckets: Array.from({ length: 10 }, () => []), digitPlace: 1 },
    counts: { comparisons: 0, swaps: 0 }
  });

  for (const step of generator) {
    timeline.push(step);
  }

  return timeline;
}