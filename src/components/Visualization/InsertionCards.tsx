"use client";

import { motion } from "framer-motion";
import { AnimationStep } from "@/lib/algorithms/types";

interface InsertionCardsProps {
  data: AnimationStep;
  array: number[];
}

export default function InsertionCards({ data, array }: InsertionCardsProps) {
  const { indices, sortedIndices, type, variables } = data;
  const keyVal = variables.keyVal; 
  const compareIdx = variables.j; // Index đang so sánh với Key
  
  // Cấu hình kích thước thẻ
  const cardWidth = 50;
  const cardHeight = 70;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/30 rounded-xl border border-slate-800 p-8 relative overflow-hidden">
      
      {/* Nền bàn chơi bài (Felt green/blue hint) */}
      <div className="absolute inset-0 bg-emerald-900/10 pointer-events-none"></div>

      <div className="flex gap-3 items-end justify-center relative z-10 flex-wrap min-h-[120px]">
        {array.map((value, index) => {
          // Logic xác định trạng thái
          const isKey = value === keyVal && (type === 'COMPARE' || type === 'SHIFT' || type === 'INSERT') && index === (variables.j !== undefined ? variables.j + 1 : indices[0]);
          // Lưu ý: Logic isKey hơi phức tạp vì trong code generator, vị trí thực của key thay đổi khi shift.
          // Để đơn giản cho visual: Nếu value == keyVal và đang trong pha Insert, ta highlight nó.
          
          // Tuy nhiên, cách tốt nhất: Dựa vào biến `indices`.
          // Trong Insertion Sort: 
          // - indices[0] thường là vị trí nguồn hoặc đích.
          // - variables.j là vị trí đang so sánh.
          
          const isComparing = index === compareIdx;
          const isSorted = sortedIndices.includes(index);
          const isShifted = type === 'SHIFT' && indices.includes(index);

          // Xác định xem lá bài này có phải là "Key" đang bay không?
          // Trong Insertion Sort, Key là giá trị đang cầm trên tay.
          // Ta sẽ kiểm tra nếu value == keyVal. Tuy nhiên nếu mảng có số trùng thì sai.
          // Tốt nhất: Ta highlight ô `j+1` nếu đang compare, vì Key tạm thời nằm ở đó (hoặc đè lên đó).
          // Nhưng để visual đẹp: Ta sẽ coi ô nào chứa giá trị KeyVal chính là Key.
          const isActiveKey = value === keyVal && sortedIndices.length > 0; 

          // Styles
          let bgColor = "bg-slate-200";
          let textColor = "text-slate-900";
          let border = "border-slate-300";
          let yOffset = 0;
          let shadow = "shadow-md";
          let scale = 1;

          if (isSorted) {
             // Bài đã xếp xong: Màu tối hơn chút
             bgColor = "bg-slate-300";
             border = "border-slate-400";
          }

          if (isActiveKey) {
             // LÁ BÀI KEY: Nhấc lên cao, màu nổi
             yOffset = -40; 
             bgColor = "bg-indigo-600";
             textColor = "text-white";
             border = "border-indigo-400";
             shadow = "shadow-2xl shadow-indigo-500/50";
             scale = 1.1;
          } else if (isComparing) {
             // LÁ ĐANG BỊ SO SÁNH: Viền vàng
             border = "border-yellow-500 border-4";
             bgColor = "bg-yellow-100";
          } else if (isShifted) {
             // LÁ ĐANG TRƯỢT: Màu cam
             bgColor = "bg-orange-200";
             border = "border-orange-400";
          }

          return (
            <div key={index} className="flex flex-col items-center group">
               {/* Label trên đầu thẻ Key */}
               {isActiveKey && (
                   <motion.span 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="mb-2 text-[10px] font-bold text-indigo-400 font-mono uppercase tracking-wider"
                   >
                       Key
                   </motion.span>
               )}

               <motion.div
                layout
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`
                  relative flex items-center justify-center rounded-lg border-2
                  ${bgColor} ${textColor} ${border} ${shadow} font-bold font-mono text-xl select-none
                `}
                style={{ width: cardWidth, height: cardHeight }}
                animate={{ y: yOffset, scale: scale }}
              >
                {/* Trang trí lá bài */}
                <div className="absolute top-1 left-1 text-[8px] opacity-50">{value}</div>
                <div className="absolute bottom-1 right-1 text-[8px] opacity-50 rotate-180">{value}</div>
                
                {value}
              </motion.div>
              
              <span className="mt-4 text-[10px] text-slate-600 font-mono group-hover:text-slate-400 transition-colors">{index}</span>
            </div>
          );
        })}
      </div>
      
      {/* Chú thích */}
      <div className="absolute bottom-4 right-4 flex gap-4 text-[10px] text-slate-500">
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-indigo-600 rounded-full"></div> Key (Insert)</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-500 rounded-full"></div> Compare</div>
      </div>
    </div>
  );
}