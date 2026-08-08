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

export interface GraphNodeData {
  id: string;
  value: string | number;
  x: number; // percentage or px
  y: number; // percentage or px
  state: MemoryState;
  auxiliary?: any;
}

export interface GraphEdgeData {
  id: string;
  source: string;
  target: string;
  weight?: number;
  isDirected?: boolean;
  state: MemoryState;
  auxiliary?: any;
}

export interface GraphStateData {
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
}

export interface SearchStateData {
    array: number[];
    target: number;
    left?: number;
    right?: number;
    mid?: number;
    current?: number;
    found?: boolean;
    foundIndex?: number;
}

export interface DPTableCell {
  value: string | number;
  state: 'DEFAULT' | 'SELECTED' | 'COMPARE' | 'FOUND' | 'DELETED';
}

export interface DPTableState {
  table: DPTableCell[][];
  rowLabels?: string[];
  colLabels?: string[];
}

export interface DSAnimationStep {
  arrayState: ArrayNode[];
  secondArrayState?: ArrayNode[]; // Dùng cho Prefix Sum hoặc Mảng cũ khi resize
  tempArrayState?: ArrayNode[];   // THÊM: Dùng cho mảng mới đang copy sang (Resizing)
  treeState?: TreeNodeData[];     // Dùng cho Tree Visualization
  graphState?: GraphStateData;    // THÊM: Dùng cho Graph Visualization
  searchState?: SearchStateData;  // THÊM: Dùng cho Searching Algorithms
  dpTableState?: DPTableState;    // THÊM: Dùng cho Dynamic Programming
  message: string;
  codeLine?: number;
  auxiliary?: any;                // Data phụ trợ nếu cần
}