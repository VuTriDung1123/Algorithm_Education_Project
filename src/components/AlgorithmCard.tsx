import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

interface AlgorithmCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  isReady?: boolean; // Biến này để check xem làm xong chưa, chưa xong thì hiện ổ khóa
  tags: string[];
}

export default function AlgorithmCard({ title, description, href, icon, isReady = false, tags }: AlgorithmCardProps) {
  // Nếu chưa sẵn sàng (isReady = false) thì disable link
  const Wrapper = isReady ? Link : "div";

  return (
    <Wrapper 
      href={href}
      className={`relative group block p-6 rounded-2xl border transition-all duration-300
        ${isReady 
          ? "bg-slate-800 border-slate-700 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 cursor-pointer" 
          : "bg-slate-900 border-slate-800 opacity-60 cursor-not-allowed"
        }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${isReady ? "bg-cyan-500/10 text-cyan-400" : "bg-slate-800 text-slate-500"}`}>
          {icon}
        </div>
        {isReady ? (
          <ArrowRight className="text-slate-600 group-hover:text-cyan-400 transition-colors" size={20} />
        ) : (
          <Lock className="text-slate-600" size={20} />
        )}
      </div>

      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
        {title}
      </h3>
      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
        {description}
      </p>

      <div className="flex gap-2 flex-wrap">
        {tags.map((tag, index) => (
          <span key={index} className="text-xs px-2 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-400">
            {tag}
          </span>
        ))}
      </div>
    </Wrapper>
  );
}