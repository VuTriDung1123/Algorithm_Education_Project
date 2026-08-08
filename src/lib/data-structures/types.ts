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
  auxiliary?: any;
}

export type ArrayOperation = 
  | 'ACCESS' 
  | 'INSERT' 
  | 'DELETE' 
  | 'SEARCH' 
  | 'UPDATE';


export interface TreeNodeData {
  id: string;
  value: number | string | null;
  state: MemoryState;
  x: number;
  y: number;
  left?: string | null; // id of left child
  right?: string | null; // id of right child
  children?: string[]; // for n-ary trees like Trie
  isVisible: boolean;
  auxiliary?: any;
}

export interface DSAnimationStep {
  arrayState: ArrayNode[];
  secondArrayState?: ArrayNode[]; // Dùng cho Prefix Sum hoặc Mảng cũ khi resize
  tempArrayState?: ArrayNode[];   // THÊM: Dùng cho mảng mới đang copy sang (Resizing)
  treeState?: TreeNodeData[];     // Dùng cho Tree Visualization
  message: string;
  codeLine?: number;
  auxiliary?: Record<string, unknown>;
}