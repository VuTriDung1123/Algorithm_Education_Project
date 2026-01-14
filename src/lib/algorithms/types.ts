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
  | 'BUCKET_POP' // <--- MỚI: Lấy ra khỏi thùng
  | 'BUCKET_SCATTER'      // Phân phối vào thùng
  | 'BUCKET_SORT_INTERNAL' // Sắp xếp nội bộ trong thùng
  | 'BUCKET_GATHER' // Gom từ thùng về mảng
  | 'TIM_RUN_START'  // Bắt đầu 1 Run (Insertion)
  | 'TIM_MERGE_START'; // Bắt đầu Merge 2 Runs
    

export interface AnimationStep {
  type: ActionType;
  indices: number[]; 
  arrayState: number[];
  sortedIndices: number[];
  message: string;
  variables: {
    // Biến chung cho nhiều thuật toán
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
    bucketRanges?: string[]; // Nhãn hiển thị phạm vi (ví dụ "0-19")

    runStart?: number; // Điểm bắt đầu của Run hiện tại
    runEnd?: number;   // Điểm kết thúc của Run hiện tại

    gap?: number;      // Khoảng cách hiện tại
    tempVal?: number;  // Giá trị đang cầm để chèn (giống keyVal nhưng cho Shell)
    
  };
  counts: {
    comparisons: number; // Radix không so sánh, dùng để đếm thao tác Extract Digit
    swaps: number;       // Đếm thao tác Move (Push/Pop)
  };
}
export interface DSAnimationStep {
  arrayState: ArrayNode[];
  secondArrayState?: ArrayNode[]; // Dùng cho Prefix Sum hoặc Mảng cũ khi resize
  tempArrayState?: ArrayNode[];   // THÊM: Dùng cho mảng mới đang copy sang (Resizing)
  message: string;
  codeLine?: number;
  auxiliary?: Record<string, unknown>;
}