import { AnimationStep } from './types';


function* countingSortGenerator(array: number[]): Generator<AnimationStep> {
  const n = array.length;
  // Tìm max thực tế, nhưng visualizer sẽ ép max trong config
  let max = 0;
  for(let i=0; i<n; i++) if(array[i] > max) max = array[i];
  
  // Khởi tạo mảng đếm
  const count = new Array(max + 1).fill(0);
  const output = new Array(n).fill(0);
  
  let operations = 0; // Thay cho comparisons
  let writes = 0;     // Thay cho swaps

  // BƯỚC 1: ĐẾM TẦN SỐ (COUNTING)
  yield {
    type: 'COUNT',
    indices: [],
    arrayState: [...array],
    sortedIndices: [],
    message: `Phase 1: Count frequencies of each element.`,
    variables: { countArr: [...count] },
    counts: { comparisons: operations, swaps: writes }
  };

  for (let i = 0; i < n; i++) {
    const val = array[i];
    count[val]++;
    operations++;

    yield {
      type: 'COUNT',
      indices: [i], // Highlight phần tử đang xét trong mảng chính
      arrayState: [...array],
      sortedIndices: [],
      message: `Found value ${val}. Increment count at index ${val}.`,
      variables: { i, val, countIndex: val, countArr: [...count] },
      counts: { comparisons: operations, swaps: writes }
    };
  }

  // BƯỚC 2: CỘNG DỒN (ACCUMULATE)
  yield {
    type: 'ACCUMULATE',
    indices: [],
    arrayState: [...array],
    sortedIndices: [],
    message: `Phase 2: Calculate cumulative counts (Prefix Sum) to determine positions.`,
    variables: { countArr: [...count] },
    counts: { comparisons: operations, swaps: writes }
  };

  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
    operations++;

    yield {
      type: 'ACCUMULATE',
      indices: [],
      arrayState: [...array],
      sortedIndices: [],
      message: `Add Count[${i-1}] to Count[${i}] -> New Count[${i}] = ${count[i]}.`,
      variables: { countIndex: i, countArr: [...count] },
      counts: { comparisons: operations, swaps: writes }
    };
  }

  // BƯỚC 3: XÂY DỰNG MẢNG OUTPUT (PLACE)
  // Duyệt ngược để giữ tính ổn định (Stable)
  for (let i = n - 1; i >= 0; i--) {
    const val = array[i];
    const position = count[val] - 1;
    
    output[position] = val;
    count[val]--; // Giảm count để phần tử cùng giá trị tiếp theo sẽ đứng trước
    writes++;

    // Ở bước này, ta sẽ hiển thị output dần dần lấp đầy vào mảng chính (hoặc mảng output ảo)
    // Để visual dễ hiểu, ta coi mảng chính dần biến đổi thành output
    // Ta tạo một mảng lai: những chỗ chưa điền là 0 (hoặc giá trị cũ), những chỗ điền rồi là giá trị mới
    // Nhưng để đơn giản, ta sẽ dùng biến output làm arrayState, các ô chưa điền ta đánh dấu riêng?
    // Cách tốt nhất: arrayState vẫn là input, nhưng ta highlight vị trí đích trong output.
    
    // Tuy nhiên, logic Visualizer của ta dùng 1 mảng.
    // Ta sẽ "hack" một chút: arrayState sẽ là mảng Output đang được xây dựng.
    // Các phần tử chưa được fill ta để ẩn hoặc giá trị 0.
    
    // Để người dùng thấy rõ: Ta copy output hiện tại vào state. 
    // Những vị trí chưa fill trong output thực tế đang là 0.
    
    yield {
      type: 'PLACE',
      indices: [i], // i là vị trí nguồn trong mảng input cũ (tuy nhiên arrayState đang hiển thị output, nên i này hơi lệch pha)
                    // Sửa lại: Highlight vị trí đích (position)
      arrayState: [...output], // Show mảng output đang hình thành
      sortedIndices: [...Array.from(output.keys()).filter(k => output[k] !== 0)], // Những ô đã điền coi như sorted
      message: `Take value ${val} from Input. Place it at index ${position} in Output. Decrement Count[${val}].`,
      variables: { val, countIndex: val, overwriteVal: position, countArr: [...count] }, // overwriteVal dùng tạm làm index đích
      counts: { comparisons: operations, swaps: writes }
    };
  }

  yield {
    type: 'SORTED',
    indices: [],
    arrayState: [...output],
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    message: "Counting Sort Completed!",
    variables: { countArr: [...count] },
    counts: { comparisons: operations, swaps: writes }
  };
}

export function generateCountingSortTimeline(initialArray: number[]): AnimationStep[] {
  // Tìm max để init mảng count rỗng
  let max = 0;
  for(const v of initialArray) if(v > max) max = v;
  const initialCount = new Array(max + 1).fill(0);

  const generator = countingSortGenerator(initialArray);
  const timeline: AnimationStep[] = [];

  timeline.push({
    type: 'COUNT',
    indices: [],
    arrayState: [...initialArray],
    sortedIndices: [],
    message: "Ready to start Counting Sort...",
    variables: { countArr: initialCount },
    counts: { comparisons: 0, swaps: 0 }
  });

  for (const step of generator) {
    timeline.push(step);
  }

  return timeline;
}