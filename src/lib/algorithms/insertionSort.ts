import { AnimationStep } from './types';

function* insertionSortGenerator(array: number[]): Generator<AnimationStep> {
  const arr = [...array];
  const n = arr.length;
  // Trong Insertion Sort, phần đầu mảng dần dần được sort.
  // Tuy nhiên, nó chỉ thực sự "Final Sorted" khi chạy hết toàn bộ.
  // Để visualization đẹp, ta coi i là ranh giới sorted tạm thời.
  let sortedIndices: number[] = [0]; 
  
  let comparisons = 0;
  let swaps = 0; // Đếm số lần dời chỗ (Shift)

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    // Bước: Chọn Key
    yield {
      type: 'COMPARE', // Dùng màu vàng để highlight Key
      indices: [i],
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
      message: `Pass ${i}: Pick element at index ${i} (Value: ${key}) as KEY.`,
      variables: { i, j, keyVal: key },
      counts: { comparisons, swaps }
    };

    // Bắt đầu dời chỗ
    while (j >= 0) {
      comparisons++;
      
      // Bước: So sánh Key với arr[j]
      yield {
        type: 'COMPARE',
        indices: [j, i], // Highlight vị trí đang so sánh vs vị trí gốc của key (hoặc vị trí trống)
        arrayState: [...arr], // Lưu ý: Lúc này arr[i] vẫn là key, chưa bị ghi đè về mặt hiển thị
        sortedIndices: [...sortedIndices],
        message: `Compare: Is ${arr[j]} > Key (${key})?`,
        variables: { i, j, keyVal: key, compareVal1: arr[j], compareVal2: key },
        counts: { comparisons, swaps }
      };

      if (arr[j] > key) {
        // SHIFT: Dời arr[j] sang phải
        arr[j + 1] = arr[j];
        swaps++;

        yield {
          type: 'SHIFT', // Màu đỏ (hoặc màu riêng cho shift)
          indices: [j, j + 1],
          arrayState: [...arr], // Lúc này arr[j+1] đã thành arr[j], tạo hiệu ứng "nhân bản" sang phải
          sortedIndices: [...sortedIndices],
          message: `Yes! ${arr[j]} > ${key}. Shift ${arr[j]} to the right (index ${j+1}).`,
          variables: { i, j, keyVal: key, compareVal1: arr[j], compareVal2: key },
          counts: { comparisons, swaps }
        };

        j--;
      } else {
        // Không lớn hơn -> Tìm thấy chỗ chèn
        yield {
            type: 'COMPARE',
            indices: [j],
            arrayState: [...arr],
            sortedIndices: [...sortedIndices],
            message: `No. ${arr[j]} <= ${key}. Found insertion point at index ${j + 1}.`,
            variables: { i, j, keyVal: key, compareVal1: arr[j], compareVal2: key },
            counts: { comparisons, swaps }
        };
        break;
      }
    }

    // Insert Key vào đúng chỗ
    arr[j + 1] = key;
    
    // Cập nhật sorted indices (từ 0 đến i)
    sortedIndices = Array.from({ length: i + 1 }, (_, k) => k);

    yield {
      type: 'INSERT', // Màu xanh lá hoặc tím
      indices: [j + 1],
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
      message: `Insert Key (${key}) at index ${j + 1}.`,
      variables: { i: i + 1, j: -1, keyVal: key },
      counts: { comparisons, swaps }
    };
  }

  // Kết thúc
  yield {
    type: 'SORTED',
    indices: [],
    arrayState: [...arr],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    message: "Array is fully sorted!",
    variables: { i: n, j: -1, keyVal: 0 },
    counts: { comparisons, swaps }
  };
}

export function generateInsertionSortTimeline(initialArray: number[]): AnimationStep[] {
  const generator = insertionSortGenerator(initialArray);
  const timeline: AnimationStep[] = [];

  timeline.push({
    type: 'COMPARE',
    indices: [],
    arrayState: [...initialArray],
    sortedIndices: [0], // Phần tử đầu tiên coi như đã sort
    message: "Ready to start Insertion Sort...",
    variables: { i: 1, j: 0, keyVal: initialArray[1] }, // Bắt đầu từ index 1
    counts: { comparisons: 0, swaps: 0 }
  });

  for (const step of generator) {
    timeline.push(step);
  }

  return timeline;
}