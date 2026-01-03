import AlgorithmCard from "@/components/AlgorithmCard";
import { BarChart3, Search, Share2, GitGraph, Binary } from "lucide-react";

export default function Home() {
  // Danh sách thuật toán (Data giả lập)
  const algorithms = [
    {
      title: "Bubble Sort",
      description: "Thuật toán sắp xếp nổi bọt cơ bản. So sánh các cặp phần tử liền kề và đổi chỗ.",
      href: "/sorting/bubble", // Link tới trang chúng ta vừa chuyển
      icon: <BarChart3 size={24} />,
      isReady: true, // Cái này ĐÃ XONG -> Sáng đèn
      tags: ["Sorting", "Easy", "O(n²)"],
    },
    {
      title: "Quick Sort",
      description: "Thuật toán chia để trị hiệu quả. Chọn pivot và phân chia mảng.",
      href: "/sorting/quick",
      icon: <BarChart3 size={24} />,
      isReady: false, // Cái này CHƯA XONG -> Tối đèn
      tags: ["Sorting", "Hard", "O(n log n)"],
    },
    {
      title: "Binary Search",
      description: "Tìm kiếm nhị phân trên mảng đã sắp xếp. Chia đôi không gian tìm kiếm.",
      href: "/search/binary",
      icon: <Search size={24} />,
      isReady: false,
      tags: ["Search", "Easy", "O(log n)"],
    },
    {
      title: "Dijkstra Algorithm",
      description: "Tìm đường đi ngắn nhất trong đồ thị có trọng số không âm.",
      href: "/graph/dijkstra",
      icon: <Share2 size={24} />,
      isReady: false,
      tags: ["Graph", "Greedy"],
    },
    {
      title: "Binary Search Tree",
      description: "Cấu trúc dữ liệu cây. Các thao tác thêm, sửa, xóa, tìm kiếm.",
      href: "/tree/bst",
      icon: <GitGraph size={24} />,
      isReady: false,
      tags: ["Tree", "Data Structure"],
    },
     {
      title: "Dynamic Programming",
      description: "Giải quyết bài toán phức tạp bằng cách chia nhỏ thành các bài toán con.",
      href: "/dp/fibonacci",
      icon: <Binary size={24} />,
      isReady: false,
      tags: ["Advanced", "Math"],
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header giới thiệu */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-linear-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            Algorithm Visualizer
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Khám phá sức mạnh của thuật toán qua các mô phỏng trực quan. 
            Code, chạy thử và hiểu sâu hơn về khoa học máy tính.
          </p>
        </div>

        {/* Grid chứa các Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {algorithms.map((algo, index) => (
            <AlgorithmCard 
              key={index}
              {...algo}
            />
          ))}
        </div>

      </div>
    </main>
  );
}