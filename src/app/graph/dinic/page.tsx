import Link from 'next/link';
import { ArrowLeft, Construction } from 'lucide-react';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white p-4 font-sans relative">
      <Link href="/" className="absolute top-8 left-8 flex items-center text-slate-400 hover:text-white gap-2">
        <ArrowLeft size={20} /> Dashboard
      </Link>
      <div className="bg-slate-900 border border-slate-800 p-12 rounded-3xl flex flex-col items-center text-center shadow-2xl max-w-lg">
        <div className="w-24 h-24 bg-pink-500/10 text-pink-500 rounded-full flex items-center justify-center mb-6">
            <Construction size={48} />
        </div>
        <h1 className="text-3xl font-extrabold mb-4 bg-linear-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
            Dinic (Max Flow)
        </h1>
        <p className="text-slate-400 leading-relaxed">
            Thuật toán Đồ thị Nâng cao (Graph Advanced) này đang trong quá trình xây dựng UI/UX mô phỏng. 
            <br/><br/>
            Sẽ sớm ra mắt trong bản cập nhật sắp tới! Cảm ơn bạn đã kiên nhẫn.
        </p>
      </div>
    </main>
  );
}