import { 
  Box, 
  ArrowUpDown, 
  Search, 
  Share2, 
  Layers, 
  Zap, 
  Scissors, 
  Type, 
  Calculator,
  LucideIcon 
} from "lucide-react";

export interface AlgorithmItem {
  title: string;
  description: string;
  href: string;
  tags: string[];
  isReady: boolean;
}

export interface AlgorithmCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  items: AlgorithmItem[];
}

export const algorithmCategories: AlgorithmCategory[] = [
  // I. CẤU TRÚC DỮ LIỆU
  {
    id: "data-structures",
    title: "I. Cấu trúc dữ liệu (Data Structures)",
    icon: Box,
    color: "text-blue-400",
    items: [
      // 1. Cơ bản
      { title: "Array", description: "Mảng tĩnh cố định kích thước.", href: "/ds/array", tags: ["Basic"], isReady: false },
      { title: "Dynamic Array (Vector)", description: "Mảng có thể thay đổi kích thước.", href: "/ds/vector", tags: ["Basic"], isReady: false },
      { title: "Linked List", description: "Danh sách liên kết đơn.", href: "/ds/linked-list", tags: ["Basic"], isReady: false },
      { title: "Doubly Linked List", description: "Danh sách liên kết đôi.", href: "/ds/doubly-linked-list", tags: ["Basic"], isReady: false },
      { title: "Stack", description: "Ngăn xếp (LIFO).", href: "/ds/stack", tags: ["Basic"], isReady: false },
      { title: "Queue", description: "Hàng đợi (FIFO).", href: "/ds/queue", tags: ["Basic"], isReady: false },
      { title: "Deque", description: "Hàng đợi hai đầu.", href: "/ds/deque", tags: ["Basic"], isReady: false },
      // 2. Cây
      { title: "Binary Tree", description: "Cây nhị phân cơ bản.", href: "/ds/binary-tree", tags: ["Tree"], isReady: false },
      { title: "Binary Search Tree (BST)", description: "Cây tìm kiếm nhị phân.", href: "/ds/bst", tags: ["Tree"], isReady: false },
      { title: "AVL Tree", description: "BST tự cân bằng.", href: "/ds/avl", tags: ["Tree"], isReady: false },
      { title: "Red-Black Tree", description: "BST cân bằng (dùng nhiều trong thư viện).", href: "/ds/rbt", tags: ["Tree"], isReady: false },
      { title: "Splay Tree", description: "Cây tự điều chỉnh (mới truy cập đưa lên gốc).", href: "/ds/splay", tags: ["Tree"], isReady: false },
      { title: "Treap", description: "Kết hợp Tree và Heap.", href: "/ds/treap", tags: ["Tree"], isReady: false },
      { title: "B-Tree", description: "Cây đa phân (dùng cho Disk Storage).", href: "/ds/b-tree", tags: ["Tree", "Database"], isReady: false },
      { title: "B+ Tree", description: "Biến thể B-Tree tối ưu truy vấn khoảng.", href: "/ds/b-plus-tree", tags: ["Tree", "Database"], isReady: false },
      { title: "Segment Tree", description: "Truy vấn đoạn (RMQ, Sum).", href: "/ds/segment-tree", tags: ["Tree", "Advanced"], isReady: false },
      { title: "Fenwick Tree (BIT)", description: "Cây chỉ số nhị phân.", href: "/ds/fenwick", tags: ["Tree", "Advanced"], isReady: false },
      { title: "Trie (Prefix Tree)", description: "Cây tiền tố xử lý chuỗi.", href: "/ds/trie", tags: ["Tree", "String"], isReady: false },
      // 3. Hash / Set
      { title: "Hash Table", description: "Bảng băm (Key-Value).", href: "/ds/hash-table", tags: ["Hash"], isReady: false },
      { title: "Hash Set", description: "Tập hợp các phần tử duy nhất.", href: "/ds/hash-set", tags: ["Hash"], isReady: false },
      { title: "Hash Map", description: "Ánh xạ khóa - giá trị.", href: "/ds/hash-map", tags: ["Hash"], isReady: false },
      { title: "Bloom Filter", description: "Kiểm tra tồn tại xác suất (tiết kiệm nhớ).", href: "/ds/bloom-filter", tags: ["Hash", "Probabilistic"], isReady: false },
      // 4. Heap
      { title: "Min Heap", description: "Phần tử nhỏ nhất ở gốc.", href: "/ds/min-heap", tags: ["Heap"], isReady: false },
      { title: "Max Heap", description: "Phần tử lớn nhất ở gốc.", href: "/ds/max-heap", tags: ["Heap"], isReady: false },
      { title: "Priority Queue", description: "Hàng đợi ưu tiên.", href: "/ds/priority-queue", tags: ["Heap"], isReady: false },
    ]
  },

  // II. THUẬT TOÁN SẮP XẾP
  {
    id: "sorting",
    title: "II. Thuật toán Sắp xếp (Sorting)",
    icon: ArrowUpDown,
    color: "text-green-400",
    items: [
      { title: "Bubble Sort", description: "Sắp xếp nổi bọt.", href: "/sorting/bubble", tags: ["O(n²)", "Simple"], isReady: true }, // OPEN
      { title: "Selection Sort", description: "Sắp xếp chọn.", href: "/sorting/selection", tags: ["O(n²)"], isReady: true },//OPEN
      { title: "Insertion Sort", description: "Sắp xếp chèn.", href: "/sorting/insertion", tags: ["O(n²)"], isReady: true },//OPEN
      { title: "Merge Sort", description: "Sắp xếp trộn (Chia để trị).", href: "/sorting/merge", tags: ["O(n log n)"], isReady: true },//OPEN
      { title: "Quick Sort", description: "Sắp xếp nhanh (Phân hoạch).", href: "/sorting/quick", tags: ["O(n log n)"], isReady: true }, // OPEN
      { title: "Heap Sort", description: "Sắp xếp vun đống.", href: "/sorting/heap", tags: ["O(n log n)"], isReady: true }, // OPEN
      { title: "Counting Sort", description: "Đếm số lần xuất hiện.", href: "/sorting/counting", tags: ["Linear"], isReady: false },
      { title: "Radix Sort", description: "Sắp xếp theo cơ số.", href: "/sorting/radix", tags: ["Linear"], isReady: false },
      { title: "Bucket Sort", description: "Chia vào các xô (bucket).", href: "/sorting/bucket", tags: ["Distribution"], isReady: false },
      { title: "Tim Sort", description: "Lai giữa Merge & Insertion (Python/Java dùng).", href: "/sorting/tim", tags: ["Hybrid"], isReady: false },
      { title: "Shell Sort", description: "Cải tiến của Insertion Sort.", href: "/sorting/shell", tags: ["Gap"], isReady: false },
    ]
  },

  // III. THUẬT TOÁN TÌM KIẾM
  {
    id: "searching",
    title: "III. Thuật toán Tìm kiếm (Searching)",
    icon: Search,
    color: "text-purple-400",
    items: [
      { title: "Linear Search", description: "Tìm kiếm tuần tự.", href: "/search/linear", tags: ["Basic"], isReady: false },
      { title: "Binary Search", description: "Tìm kiếm nhị phân (mảng đã sort).", href: "/search/binary", tags: ["O(log n)"], isReady: false },
      { title: "Ternary Search", description: "Tìm kiếm tam phân.", href: "/search/ternary", tags: ["O(log n)"], isReady: false },
      { title: "Interpolation Search", description: "Tìm kiếm nội suy.", href: "/search/interpolation", tags: ["Optimized"], isReady: false },
      { title: "Jump Search", description: "Nhảy từng bước căn bậc 2.", href: "/search/jump", tags: ["Block"], isReady: false },
      { title: "Exponential Search", description: "Tìm kiếm số mũ.", href: "/search/exponential", tags: ["Range"], isReady: false },
    ]
  },

  // IV. THUẬT TOÁN ĐỒ THỊ
  {
    id: "graph",
    title: "IV. Thuật toán Đồ thị (Graph)",
    icon: Share2,
    color: "text-pink-400",
    items: [
      // 1. Duyệt
      { title: "DFS", description: "Duyệt theo chiều sâu (Depth First Search).", href: "/graph/dfs", tags: ["Traversal"], isReady: false },
      { title: "BFS", description: "Duyệt theo chiều rộng (Breadth First Search).", href: "/graph/bfs", tags: ["Traversal"], isReady: false },
      // 2. Đường đi ngắn nhất
      { title: "Dijkstra", description: "Ngắn nhất từ 1 nguồn (không âm).", href: "/graph/dijkstra", tags: ["Shortest Path"], isReady: false },
      { title: "Bellman-Ford", description: "Ngắn nhất từ 1 nguồn (có âm).", href: "/graph/bellman-ford", tags: ["Shortest Path"], isReady: false },
      { title: "Floyd–Warshall", description: "Ngắn nhất giữa mọi cặp đỉnh.", href: "/graph/floyd", tags: ["All-pairs"], isReady: false },
      { title: "A* Search", description: "Tìm đường thông minh (Heuristic).", href: "/graph/a-star", tags: ["Pathfinding"], isReady: false },
      // 3. MST
      { title: "Kruskal", description: "Cây khung nhỏ nhất (Cạnh).", href: "/graph/kruskal", tags: ["MST"], isReady: false },
      { title: "Prim", description: "Cây khung nhỏ nhất (Đỉnh).", href: "/graph/prim", tags: ["MST"], isReady: false },
      // 4. Khác
      { title: "Topological Sort", description: "Sắp xếp tô-pô (DAG).", href: "/graph/topo", tags: ["DAG"], isReady: false },
      { title: "Union-Find (DSU)", description: "Cấu trúc dữ liệu các tập rời nhau.", href: "/graph/dsu", tags: ["Structure"], isReady: false },
      { title: "Tarjan", description: "Tìm thành phần liên thông mạnh (SCC).", href: "/graph/tarjan", tags: ["SCC"], isReady: false },
      { title: "Kosaraju", description: "Tìm SCC (Duyệt 2 lần DFS).", href: "/graph/kosaraju", tags: ["SCC"], isReady: false },
      { title: "Edmonds–Karp", description: "Luồng cực đại (Max Flow).", href: "/graph/edmonds-karp", tags: ["Flow"], isReady: false },
      { title: "Dinic", description: "Max Flow tối ưu hơn.", href: "/graph/dinic", tags: ["Flow"], isReady: false },
    ]
  },

  // V. QUY HOẠCH ĐỘNG
  {
    id: "dp",
    title: "V. Quy hoạch động (Dynamic Programming)",
    icon: Layers,
    color: "text-yellow-400",
    items: [
      { title: "Fibonacci DP", description: "Ghi nhớ các số Fib đã tính.", href: "/dp/fibonacci", tags: ["Basic"], isReady: false },
      { title: "Knapsack Problem", description: "Bài toán cái túi (0/1).", href: "/dp/knapsack", tags: ["Classic"], isReady: false },
      { title: "Coin Change", description: "Đổi tiền (Số lượng ít nhất/Số cách).", href: "/dp/coin-change", tags: ["Classic"], isReady: false },
      { title: "LCS", description: "Chuỗi con chung dài nhất.", href: "/dp/lcs", tags: ["String"], isReady: false },
      { title: "LIS", description: "Dãy con tăng dài nhất.", href: "/dp/lis", tags: ["Sequence"], isReady: false },
      { title: "Edit Distance", description: "Khoảng cách chỉnh sửa chuỗi.", href: "/dp/edit-distance", tags: ["String"], isReady: false },
      { title: "Matrix Chain Multiplication", description: "Nhân chuỗi ma trận tối ưu.", href: "/dp/mcm", tags: ["Optimization"], isReady: false },
      { title: "Subset Sum", description: "Tổng tập con bằng K.", href: "/dp/subset-sum", tags: ["Decision"], isReady: false },
    ]
  },

  // VI. THAM LAM
  {
    id: "greedy",
    title: "VI. Tham lam (Greedy)",
    icon: Zap,
    color: "text-orange-400",
    items: [
      { title: "Activity Selection", description: "Chọn nhiều hoạt động nhất.", href: "/greedy/activity", tags: ["Interval"], isReady: false },
      { title: "Fractional Knapsack", description: "Cái túi phân số (lấy 1 phần).", href: "/greedy/fractional-knapsack", tags: ["Classic"], isReady: false },
      { title: "Huffman Coding", description: "Nén dữ liệu không mất tin.", href: "/greedy/huffman", tags: ["Compression"], isReady: false },
      { title: "Job Scheduling", description: "Lên lịch công việc.", href: "/greedy/job-scheduling", tags: ["Scheduling"], isReady: false },
      { title: "Interval Scheduling", description: "Lên lịch khoảng.", href: "/greedy/interval", tags: ["Interval"], isReady: false },
    ]
  },

  // VII. CHIA ĐỂ TRỊ
  {
    id: "divide-conquer",
    title: "VII. Chia để trị (Divide & Conquer)",
    icon: Scissors,
    color: "text-teal-400",
    items: [
      { title: "Merge Sort", description: "Đã có trong phần Sorting.", href: "/sorting/merge", tags: ["Sort"], isReady: true }, // OPEN
      { title: "Quick Sort", description: "Đã có trong phần Sorting.", href: "/sorting/quick", tags: ["Sort"], isReady: false },
      { title: "Binary Search", description: "Đã có trong phần Searching.", href: "/search/binary", tags: ["Search"], isReady: false },
      { title: "Strassen Matrix", description: "Nhân ma trận nhanh.", href: "/dc/strassen", tags: ["Math"], isReady: false },
      { title: "Karatsuba", description: "Nhân số lớn nhanh.", href: "/dc/karatsuba", tags: ["Math"], isReady: false },
    ]
  },

  // VIII. THUẬT TOÁN CHUỖI
  {
    id: "string",
    title: "VIII. Thuật toán Chuỗi (String)",
    icon: Type,
    color: "text-cyan-400",
    items: [
      { title: "KMP Algorithm", description: "Tìm chuỗi mẫu (Prefix function).", href: "/string/kmp", tags: ["Pattern"], isReady: false },
      { title: "Rabin-Karp", description: "Rolling Hash.", href: "/string/rabin-karp", tags: ["Hash"], isReady: false },
      { title: "Z-Algorithm", description: "Z-array.", href: "/string/z-algo", tags: ["Pattern"], isReady: false },
      { title: "Boyer-Moore", description: "Tìm chuỗi nhảy cóc.", href: "/string/boyer-moore", tags: ["Pattern"], isReady: false },
      { title: "Suffix Array", description: "Mảng hậu tố.", href: "/string/suffix-array", tags: ["Advanced"], isReady: false },
      { title: "Suffix Tree", description: "Cây hậu tố.", href: "/string/suffix-tree", tags: ["Advanced"], isReady: false },
      { title: "Aho-Corasick", description: "Tìm nhiều mẫu cùng lúc.", href: "/string/aho-corasick", tags: ["Advanced"], isReady: false },
    ]
  },

  // IX. TOÁN & SỐ HỌC
  {
    id: "math",
    title: "IX. Thuật toán Số / Toán rời rạc",
    icon: Calculator,
    color: "text-red-400",
    items: [
      { title: "Euclidean Algorithm", description: "Tìm ước chung lớn nhất (GCD).", href: "/math/gcd", tags: ["Number Theory"], isReady: false },
      { title: "Extended Euclidean", description: "Tìm nghịch đảo modulo.", href: "/math/extended-gcd", tags: ["Number Theory"], isReady: false },
      { title: "Sieve of Eratosthenes", description: "Sàng số nguyên tố.", href: "/math/sieve", tags: ["Primes"], isReady: false },
      { title: "Fast Exponentiation", description: "Lũy thừa nhanh (Binary Exponentiation).", href: "/math/fast-pow", tags: ["Math"], isReady: false },
      { title: "Modular Exponentiation", description: "Lũy thừa module.", href: "/math/mod-pow", tags: ["Math"], isReady: false },
      { title: "Chinese Remainder", description: "Định lý phần dư Trung Hoa.", href: "/math/crt", tags: ["Number Theory"], isReady: false },
    ]
  },
];