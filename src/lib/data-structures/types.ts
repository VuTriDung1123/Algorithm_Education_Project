// src/lib/data-structures/types.ts

export type MemoryState = 
  | 'DEFAULT'   
  | 'ACCESS'    
  | 'SELECTED'  
  | 'SHIFTING'  
  | 'FOUND'     
  | 'DELETED';  

export interface ArrayNode {
  id: string;       
  index: number;    
  value: number | null; 
  address: string;  
  state: MemoryState;
  isVisible: boolean; 
}

export type ArrayOperation = 
  | 'ACCESS' 
  | 'INSERT' 
  | 'DELETE' 
  | 'SEARCH' 
  | 'UPDATE';

export interface DSAnimationStep {
  arrayState: ArrayNode[];
  // THÊM DÒNG NÀY: Để chứa trạng thái mảng thứ 2 (Prefix Sum)
  secondArrayState?: ArrayNode[]; 
  message: string;
  codeLine?: number;
  auxiliary?: Record<string, unknown>;
}

export interface DSAnimationStep {
  arrayState: ArrayNode[];
  secondArrayState?: ArrayNode[]; // Dùng cho Prefix Sum hoặc Mảng cũ khi resize
  tempArrayState?: ArrayNode[];   // THÊM: Dùng cho mảng mới đang copy sang (Resizing)
  message: string;
  codeLine?: number;
  auxiliary?: Record<string, unknown>;
}