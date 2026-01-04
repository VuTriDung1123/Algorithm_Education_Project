export type ActionType = 
  | 'COMPARE' 
  | 'SWAP'    
  | 'SORTED'
  | 'SHIFT'   
  | 'INSERT'  
  | 'DIVIDE'  
  | 'MERGE'   
  | 'OVERWRITE'
  | 'PIVOT'; 

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
    pivotIdx?: number;
    compareVal1?: number;
    compareVal2?: number;
    overwriteVal?: number;
    heapSize?: number; // <--- MỚI: Kích thước vùng Heap hiện tại
    parent?: number;   // <--- MỚI: Để highlight node cha
    child?: number;    // <--- MỚI: Để highlight node con
  };
  counts: {
    comparisons: number;
    swaps: number;
  };
}