import { AnimationStep } from './types';

function* bubbleSortGenerator(array: number[]): Generator<AnimationStep> {
  const arr = [...array]; 
  const n = arr.length;
  // Mảng lưu vết các vị trí đã sắp xếp xong (màu xanh)
  const sortedIndices: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      
      // Bước 1: So sánh
      yield {
        type: 'COMPARE',
        indices: [j, j + 1],
        arrayState: [...arr],
        sortedIndices: [...sortedIndices] // Gửi kèm danh sách đã xanh
      };

      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        // Bước 2: Swap
        yield {
          type: 'SWAP',
          indices: [j, j + 1],
          arrayState: [...arr],
          sortedIndices: [...sortedIndices]
        };
      }
    }
    
    // Bước 3: Đánh dấu phần tử cuối cùng của vòng lặp này là SORTED
    sortedIndices.push(n - i - 1); // Thêm vị trí này vào danh sách xanh
    
    yield {
        type: 'SORTED',
        indices: [n - i - 1],
        arrayState: [...arr],
        sortedIndices: [...sortedIndices]
    };
  }
  
  // Xử lý nốt phần tử đầu tiên (phần tử còn lại duy nhất chắc chắn đã sort)
  sortedIndices.push(0);
  
  yield {
      type: 'SORTED',
      indices: [0],
      arrayState: [...arr],
      sortedIndices: [...sortedIndices]
  };
}

export function generateBubbleSortTimeline(initialArray: number[]): AnimationStep[] {
  const generator = bubbleSortGenerator(initialArray);
  const timeline: AnimationStep[] = [];

  timeline.push({
    type: 'COMPARE',
    indices: [],
    arrayState: [...initialArray],
    sortedIndices: [] // Ban đầu chưa có cột nào xanh
  });

  for (const step of generator) {
    timeline.push(step);
  }

  return timeline;
}