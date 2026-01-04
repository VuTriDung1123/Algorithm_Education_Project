export type ActionType = 
  | 'COMPARE' 
  | 'SWAP'    
  | 'SORTED'
  | 'SHIFT'   // <--- MỚI: Hành động dời chỗ (arr[j+1] = arr[j])
  | 'INSERT'; // <--- MỚI: Hành động chèn (arr[j+1] = key)

export interface AnimationStep {
  type: ActionType;
  indices: number[]; 
  arrayState: number[];
  sortedIndices: number[];
  message: string;
  variables: {
    i: number;
    j: number;
    minIdx?: number;
    keyVal?: number; // <--- MỚI: Giá trị Key đang cầm trên tay để chèn
    compareVal1?: number;
    compareVal2?: number;
  };
  counts: {
    comparisons: number;
    swaps: number; // Ở Insertion Sort, ta có thể coi Shift là 1 dạng Swap hoặc đếm riêng. Ta cứ đếm vào swaps cho đơn giản.
  };
}