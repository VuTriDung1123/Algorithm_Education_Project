"use client";

import { motion } from "framer-motion";
import { AnimationStep } from "@/lib/algorithms/types";

interface BubbleContainerProps {
  data: AnimationStep;
  array: number[]; // Mảng dữ liệu hiện tại
}

export default function BubbleContainer({ data, array }: BubbleContainerProps) {
  const { indices, sortedIndices, type } = data;

  // Cấu hình kích thước bóng
  const bubbleSize = 50; 
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-900/20 to-blue-900/50 rounded-xl border border-blue-800/50 relative overflow-hidden p-8">
      {/* Hiệu ứng nền nước/khí (Optional decorative elements) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute top-10 left-10 w-4 h-4 bg-white rounded-full animate-bounce delay-100"></div>
         <div className="absolute bottom-20 right-20 w-6 h-6 bg-white rounded-full animate-pulse"></div>
      </div>

      <div className="flex gap-4 items-center justify-center relative z-10 flex-wrap">
        {array.map((value, index) => {
          // 1. Xác định trạng thái của bong bóng
          const isCompare = type === 'COMPARE' && indices.includes(index);
          const isSwap = type === 'SWAP' && indices.includes(index);
          const isSorted = sortedIndices.includes(index);

          // 2. Màu sắc
          let borderColor = "border-cyan-400";
          let bgColor = "bg-cyan-500/20";
          let textColor = "text-cyan-100";
          let shadow = "shadow-[0_0_10px_rgba(34,211,238,0.3)]";
          let scale = 1;

          if (isSorted) {
            borderColor = "border-green-400";
            bgColor = "bg-green-500/30";
            textColor = "text-green-100";
            shadow = "shadow-[0_0_15px_rgba(74,222,128,0.5)]";
          } else if (isSwap) {
            borderColor = "border-orange-500";
            bgColor = "bg-orange-500/40";
            textColor = "text-orange-100";
            shadow = "shadow-[0_0_20px_rgba(249,115,22,0.6)]";
            scale = 1.2;
          } else if (isCompare) {
            borderColor = "border-yellow-400";
            bgColor = "bg-yellow-500/30";
            textColor = "text-yellow-100";
            shadow = "shadow-[0_0_20px_rgba(250,204,21,0.5)]";
            scale = 1.1;
          }

          // 3. Hiệu ứng nổi (Floating) ngẫu nhiên nhẹ
          // Dùng index để tạo delay khác nhau cho mỗi bóng
          const floatDuration = 2 + (index % 3) * 0.5; 

          return (
            <motion.div
              layout // Quan trọng: Giúp hoán đổi vị trí mượt mà
              key={value} // Dùng value làm key nếu mảng unique, hoặc kết hợp index nếu cần (nhưng value giúp motion hiểu là object di chuyển)
              // Lưu ý: Nếu dùng key={index} thì nó sẽ không bay qua nhau mà chỉ đổi nội dung. 
              // Để animation đẹp nhất với mảng số trùng nhau, ta nên dùng key unique (ví dụ object {id, val}). 
              // Tuy nhiên ở đây data là number[], nên ta chấp nhận motion có thể không perfect 100% nếu số trùng, 
              // nhưng vẫn ổn. Tốt nhất là thêm ID vào mảng ban đầu, nhưng để đơn giản ta dùng `index` làm vị trí và animate value.
              // SỬA LẠI: Dùng layout và key={index} cho đơn giản, motion sẽ lo việc đổi chỗ.
              
              transition={{
                layout: { type: "spring", stiffness: 300, damping: 30 },
                scale: { duration: 0.2 }
              }}
              className={`
                relative rounded-full flex items-center justify-center border-2 backdrop-blur-sm
                ${borderColor} ${bgColor} ${textColor} ${shadow}
              `}
              style={{
                width: bubbleSize,
                height: bubbleSize,
              }}
              animate={{ 
                scale: scale,
                backgroundColor: isSwap ? "rgba(249,115,22,0.4)" : isCompare ? "rgba(250,204,21,0.3)" : isSorted ? "rgba(34,197,94,0.3)" : "rgba(6,182,212,0.2)",
                borderColor: isSwap ? "#f97316" : isCompare ? "#facc15" : isSorted ? "#4ade80" : "#22d3ee",
              }}
            >
              {/* Hiệu ứng bóng kính (Reflection) */}
              <div className="absolute top-2 left-2 w-3 h-2 bg-white/40 rounded-full blur-[1px]"></div>
              
              <span className="font-bold font-mono text-lg z-10">{value}</span>
              
              {/* Chỉ số index nhỏ dưới đáy */}
              <span className="absolute -bottom-6 text-[10px] text-slate-500 font-mono">
                {index}
              </span>
            </motion.div>
          );
        })}
      </div>
      
      <div className="absolute bottom-2 right-4 text-xs text-slate-500 italic">
        {'"Heavier bubbles move to the right"'}
      </div>
    </div>
  );
}