import { AnimationStep } from './types';

function* selectionSortGenerator(array: number[]): Generator<AnimationStep> {
  const arr = [...array];
  const n = arr.length;
  const sortedIndices: number[] = [];
  
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < n; i++) {
    let minIdx = i;

    // Bước: Khởi tạo Min (Không cần user đoán, chỉ thông báo)
    yield {
      type: 'COMPARE',
      indices: [i],
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
      message: `Pass ${i + 1}: Start with index ${i} (${arr[i]}) as current minimum.`,
      variables: { i, j: i + 1, minIdx: i, compareVal1: arr[i], compareVal2: arr[i] }, // compareVal1 ở đây là currentMin
      counts: { comparisons, swaps }
    };

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      
      const currentVal = arr[j];
      const currentMin = arr[minIdx];

      // Bước: Hỏi User "Số này có nhỏ hơn Min không?"
      yield {
        type: 'COMPARE',
        indices: [j, minIdx],
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
        message: `Check: Is ${currentVal} < ${currentMin} (Current Min)?`,
        variables: { i, j, minIdx, compareVal1: currentVal, compareVal2: currentMin }, // Val1: Số đang xét, Val2: Min hiện tại
        counts: { comparisons, swaps }
      };

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        
        // Bước: Cập nhật Min mới (Thông báo)
        yield {
          type: 'COMPARE',
          indices: [minIdx],
          arrayState: [...arr],
          sortedIndices: [...sortedIndices],
          message: `Yes! New minimum found at index ${minIdx} (${arr[minIdx]}).`,
          variables: { i, j, minIdx, compareVal1: arr[j], compareVal2: currentMin },
          counts: { comparisons, swaps }
        };
      }
    }

    if (minIdx !== i) {
      const valI = arr[i];
      const valMin = arr[minIdx];
      
      // Swap
      arr[i] = valMin;
      arr[minIdx] = valI;
      swaps++;

      yield {
        type: 'SWAP',
        indices: [i, minIdx],
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
        message: `End of pass: Swap minimum (${valMin}) with position ${i} (${valI}).`,
        variables: { i, j: n, minIdx, compareVal1: valI, compareVal2: valMin },
        counts: { comparisons, swaps }
      };
    }

    sortedIndices.push(i);

    yield {
      type: 'SORTED',
      indices: [i],
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
      message: `Position ${i} is sorted.`,
      variables: { i: i + 1, j: i + 2, minIdx: -1 },
      counts: { comparisons, swaps }
    };
  }
}

export function generateSelectionSortTimeline(initialArray: number[]): AnimationStep[] {
  const generator = selectionSortGenerator(initialArray);
  const timeline: AnimationStep[] = [];

  timeline.push({
    type: 'COMPARE',
    indices: [],
    arrayState: [...initialArray],
    sortedIndices: [],
    message: "Ready to start Selection Sort...",
    variables: { i: 0, j: 1, minIdx: 0 },
    counts: { comparisons: 0, swaps: 0 }
  });

  for (const step of generator) {
    timeline.push(step);
  }

  return timeline;
}