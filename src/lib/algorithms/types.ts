// Định nghĩa các loại hành động có thể xảy ra trong thuật toán
export type ActionType = 
  | 'COMPARE'  // Đang so sánh 2 số (thường tô màu vàng/xanh)
  | 'SWAP'     // Đang đổi chỗ 2 số (thường tô màu đỏ/tím)
  | 'SORTED';  // Đã sắp xếp xong vị trí này (tô màu xanh lá)

// Định nghĩa cấu trúc của 1 bước (Step) gửi ra cho UI
export interface AnimationStep {
  type: ActionType;
  indices: number[]; // Vị trí các phần tử đang tương tác (ví dụ: [0, 1])
  arrayState: number[]; // Trạng thái mảng tại thời điểm đó (để backup/undo)
  sortedIndices: number[]; // Vị trí các phần tử đã được sắp xếp xong
}