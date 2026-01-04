import { AnimationStep } from './types';

function* shellSortGenerator(array: number[]): Generator<AnimationStep> {
  const arr = [...array];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0; // Đếm số lần dịch chuyển

  // Start with a big gap, then reduce the gap
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    
    // Thông báo đổi Gap
    yield {
      type: 'COMPARE', // Dùng tạm type này để hiện thông báo
      indices: [],
      arrayState: [...arr],
      sortedIndices: [],
      message: `New Gap Size: ${gap}. Comparing elements ${gap} positions apart.`,
      variables: { gap, i: -1, j: -1 },
      counts: { comparisons, swaps }
    };

    // Do a gapped insertion sort for this gap size.
    for (let i = gap; i < n; i += 1) {
      const temp = arr[i];
      let j = i;

      yield {
        type: 'COMPARE',
        indices: [i],
        arrayState: [...arr],
        sortedIndices: [],
        message: `Pick ${temp} (at index ${i}) to insert into its gapped sequence.`,
        variables: { gap, i, j, tempVal: temp },
        counts: { comparisons, swaps }
      };

      // Shift elements of gap-sorted subarray
      while (j >= gap) {
        comparisons++;
        
        yield {
          type: 'COMPARE',
          indices: [j - gap, j], // So sánh 2 phần tử cách nhau khoảng gap
          arrayState: [...arr],
          sortedIndices: [],
          message: `Compare: Is ${arr[j - gap]} > ${temp}?`,
          variables: { gap, i, j, tempVal: temp, compareVal1: arr[j - gap], compareVal2: temp },
          counts: { comparisons, swaps }
        };

        if (arr[j - gap] > temp) {
          arr[j] = arr[j - gap];
          swaps++;
          
          yield {
            type: 'SHIFT',
            indices: [j - gap, j],
            arrayState: [...arr],
            sortedIndices: [],
            message: `Yes. Shift ${arr[j]} from idx ${j - gap} to idx ${j}.`,
            variables: { gap, i, j, tempVal: temp, compareVal1: arr[j - gap] },
            counts: { comparisons, swaps }
          };

          j -= gap;
        } else {
          break;
        }
      }

      arr[j] = temp;
      
      // Chỉ tính là swap/write nếu vị trí thay đổi
      if (j !== i) { 
          swaps++; 
          yield {
            type: 'INSERT',
            indices: [j],
            arrayState: [...arr],
            sortedIndices: [],
            message: `Insert ${temp} at index ${j}.`,
            variables: { gap, i, j, tempVal: temp },
            counts: { comparisons, swaps }
          };
      }
    }
  }

  yield {
    type: 'SORTED',
    indices: [],
    arrayState: [...arr],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    message: "Shell Sort Completed!",
    variables: { gap: 0 },
    counts: { comparisons, swaps }
  };
}

export function generateShellSortTimeline(initialArray: number[]): AnimationStep[] {
  const generator = shellSortGenerator(initialArray);
  const timeline: AnimationStep[] = [];

  timeline.push({
    type: 'COMPARE',
    indices: [],
    arrayState: [...initialArray],
    sortedIndices: [],
    message: "Ready to start Shell Sort...",
    variables: { gap: Math.floor(initialArray.length / 2) },
    counts: { comparisons: 0, swaps: 0 }
  });

  for (const step of generator) {
    timeline.push(step);
  }

  return timeline;
}