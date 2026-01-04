export type ActionType = 
  | 'COMPARE' 
  | 'SWAP'    
  | 'SORTED'
  | 'SHIFT'   
  | 'INSERT'  
  | 'DIVIDE'  
  | 'MERGE'   
  | 'OVERWRITE'
  | 'PIVOT'
  | 'COUNT'      // <--- MỚI: Tăng biến đếm
  | 'ACCUMULATE' // <--- MỚI: Cộng dồn (Prefix Sum)
  | 'PLACE';     // <--- MỚI: Đặt phần tử vào mảng kết quả

export interface AnimationStep {
  type: ActionType;
  indices: number[]; 
  arrayState: number[];
  sortedIndices: number[]; // Với Counting sort, ta dùng cái này để đánh dấu phần tử đã vào đúng chỗ
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
    heapSize?: number;
    parent?: number;
    child?: number;
    
    // <--- CÁC BIẾN MỚI CHO COUNTING SORT --->
    val?: number;        // Giá trị đang xét
    countIndex?: number; // Index trong mảng đếm
    countArr?: number[]; // Trạng thái của mảng đếm (Snapshot)
  };
  counts: {
    comparisons: number; // Counting sort không so sánh, ta có thể dùng biến này đếm số bước "Đếm"
    swaps: number;       // Đếm số bước "Ghi" (Write)
  };
}