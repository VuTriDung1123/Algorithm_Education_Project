export type ActionType = 
  | 'COMPARE' 
  | 'SWAP'    
  | 'SORTED'; 

export interface AnimationStep {
  type: ActionType;
  indices: number[]; 
  arrayState: number[];
  sortedIndices: number[];
  message: string;
  variables: {
    i: number;
    j: number;
    minIdx?: number;      // <--- THÊM DÒNG NÀY (Dấu ? nghĩa là có thể không có, vì Bubble Sort không dùng)
    compareVal1?: number;
    compareVal2?: number;
  };
  counts: {
    comparisons: number;
    swaps: number;
  };
}