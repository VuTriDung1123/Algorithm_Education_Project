import { AnimationStep } from './types';

export function* generateBubbleSortSteps(array: number[]): Generator<AnimationStep> {
  // Dùng const vì ta không gán arr = mảng khác, ta chỉ sửa ruột của nó
  const arr = [...array]; 
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      
      yield {
        type: 'COMPARE',
        indices: [j, j + 1],
        arrayState: [...arr]
      };

      if (arr[j] > arr[j + 1]) {
        // Dùng const cho temp vì trong phạm vi vòng lặp này, nó không đổi
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        yield {
          type: 'SWAP',
          indices: [j, j + 1],
          arrayState: [...arr]
        };
      }
    }
    
    yield {
        type: 'SORTED',
        indices: [n - i - 1],
        arrayState: [...arr]
    };
  }
  
  yield {
      type: 'SORTED',
      indices: [0],
      arrayState: [...arr]
  };
}