import { AnimationStep } from './types';

function* bubbleSortGenerator(array: number[]): Generator<AnimationStep> {
  const arr = [...array]; 
  const n = arr.length;
  const sortedIndices: number[] = [];
  
  // Khởi tạo bộ đếm
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      
      const val1 = arr[j];
      const val2 = arr[j + 1];

      // Tăng biến đếm so sánh
      comparisons++;

      yield {
        type: 'COMPARE',
        indices: [j, j + 1],
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
        message: `Comparing index ${j} (${val1}) and ${j+1} (${val2}).`,
        variables: { i, j, compareVal1: val1, compareVal2: val2 },
        counts: { comparisons, swaps } // Lưu vào timeline
      };

      if (val1 > val2) {
        arr[j] = val2;
        arr[j + 1] = val1;
        
        // Tăng biến đếm đổi chỗ
        swaps++;

        yield {
          type: 'SWAP',
          indices: [j, j + 1],
          arrayState: [...arr],
          sortedIndices: [...sortedIndices],
          message: `Swap ${val1} and ${val2}.`,
          variables: { i, j, compareVal1: val1, compareVal2: val2 },
          counts: { comparisons, swaps } // Lưu vào timeline
        };
      }
    }
    
    sortedIndices.push(n - i - 1);
    
    yield {
        type: 'SORTED',
        indices: [n - i - 1],
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
        message: `Position ${n - i - 1} is sorted.`,
        variables: { i, j: n - i - 1 },
        counts: { comparisons, swaps }
    };
  }
  
  sortedIndices.push(0);
  
  yield {
      type: 'SORTED',
      indices: [0],
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
      message: `Algorithm Finished.`,
      variables: { i: n - 1, j: 0 },
      counts: { comparisons, swaps }
  };
}

export function generateBubbleSortTimeline(initialArray: number[]): AnimationStep[] {
  const generator = bubbleSortGenerator(initialArray);
  const timeline: AnimationStep[] = [];

  timeline.push({
    type: 'COMPARE',
    indices: [],
    arrayState: [...initialArray],
    sortedIndices: [],
    message: "Ready to start...",
    variables: { i: 0, j: 0 },
    counts: { comparisons: 0, swaps: 0 }
  });

  for (const step of generator) {
    timeline.push(step);
  }

  return timeline;
}