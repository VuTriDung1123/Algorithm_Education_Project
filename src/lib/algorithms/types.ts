export type ActionType = 
  | 'COMPARE' 
  | 'SWAP'    
  | 'SORTED'
  | 'SHIFT'   // Insertion Sort
  | 'INSERT'  // Insertion Sort
  | 'DIVIDE'  // <--- MỚI: Merge Sort (Chia)
  | 'MERGE'   // <--- MỚI: Merge Sort (Bắt đầu gộp)
  | 'OVERWRITE'; // <--- MỚI: Merge Sort (Ghi giá trị vào mảng chính)

export interface AnimationStep {
  type: ActionType;
  indices: number[]; 
  arrayState: number[];
  sortedIndices: number[];
  message: string;
  variables: {
    i?: number;
    j?: number;
    k?: number;       // <--- MỚI: Index trong mảng chính khi merge
    left?: number;    // <--- MỚI: Biên trái
    right?: number;   // <--- MỚI: Biên phải
    mid?: number;     // <--- MỚI: Điểm giữa
    minIdx?: number;
    keyVal?: number;
    compareVal1?: number;
    compareVal2?: number;
    overwriteVal?: number; // <--- MỚI: Giá trị sắp được ghi vào
  };
  counts: {
    comparisons: number;
    swaps: number; // Với Merge Sort, ta có thể đếm số lần Overwrite vào mảng chính
  };
}