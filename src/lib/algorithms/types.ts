export type ActionType = 
  | 'COMPARE' 
  | 'SWAP'    
  | 'SORTED'
  | 'SHIFT'   // Insertion
  | 'INSERT'  // Insertion
  | 'DIVIDE'  // Merge
  | 'MERGE'   // Merge
  | 'OVERWRITE' // Merge
  | 'PIVOT';  // <--- MỚI: Quick Sort (Chọn điểm chốt)

export interface AnimationStep {
  type: ActionType;
  indices: number[]; 
  arrayState: number[];
  sortedIndices: number[];
  message: string;
  variables: {
    i?: number;
    j?: number;
    k?: number;
    left?: number;
    right?: number;
    mid?: number;
    minIdx?: number;
    keyVal?: number;
    pivotIdx?: number; // <--- MỚI: Vị trí của Pivot
    compareVal1?: number;
    compareVal2?: number;
    overwriteVal?: number;
  };
  counts: {
    comparisons: number;
    swaps: number;
  };
}