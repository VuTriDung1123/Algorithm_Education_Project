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
  | 'COUNT'
  | 'ACCUMULATE'
  | 'PLACE'
  | 'GET_DIGIT'   // <--- MỚI: Đang xét chữ số nào
  | 'BUCKET_PUSH' // <--- MỚI: Đẩy vào thùng
  | 'BUCKET_POP'; // <--- MỚI: Lấy ra khỏi thùng

export interface AnimationStep {
  type: ActionType;
  indices: number[]; 
  arrayState: number[];
  sortedIndices: number[];
  message: string;
  variables: {
    // ... (các biến cũ)
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
    val?: number;
    countIndex?: number;
    countArr?: number[];
    
    // <--- BIẾN MỚI CHO RADIX SORT --->
    digitPlace?: number;     // Hàng đang xét (1, 10, 100...)
    digitVal?: number;       // Giá trị chữ số (0-9)
    buckets?: number[][];    // Trạng thái các thùng (snapshot)
    activeBucket?: number;   // Thùng đang hoạt động
  };
  counts: {
    comparisons: number; // Radix không so sánh, dùng để đếm thao tác Extract Digit
    swaps: number;       // Đếm thao tác Move (Push/Pop)
  };
}