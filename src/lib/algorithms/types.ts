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
    compareVal1?: number;
    compareVal2?: number;
  };
  // --- MỚI: BỘ ĐẾM ---
  counts: {
    comparisons: number; // Tổng số lần so sánh tính đến bước này
    swaps: number;       // Tổng số lần đổi chỗ tính đến bước này
  };
}