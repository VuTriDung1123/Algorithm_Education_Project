import AlgorithmCard from "@/components/AlgorithmCard";
import { algorithmCategories } from "@/lib/algorithmData";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* HERO SECTION */}
        <div className="mb-20 text-center space-y-4">
          <div className="inline-block p-2 px-4 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono mb-2">
            v2.0.0 • Comprehensive Edition
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            Algorithm Visualizer
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Hệ thống kiến thức toàn diện về Cấu trúc dữ liệu và Giải thuật.
          </p>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="space-y-24"> 
          {algorithmCategories.map((category) => (
            <section key={category.id} id={category.id} className="scroll-mt-20">
              
              {/* Tiêu đề Category */}
              <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-4 sticky top-0 bg-slate-950/90 backdrop-blur z-10 py-4">
                <div className={`p-3 rounded-xl bg-slate-900 border border-slate-800 ${category.color}`}>
                  <category.icon size={28} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-200">
                  {category.title}
                </h2>
              </div>

              {/* Grid Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.items.map((algo, index) => (
                  <AlgorithmCard 
                    key={index}
                    title={algo.title}
                    description={algo.description}
                    href={algo.href}
                    icon={<category.icon size={24} />} 
                    isReady={algo.isReady}
                    tags={algo.tags}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* FOOTER */}
        <footer className="mt-32 border-t border-slate-900 pt-8 text-center text-slate-600 text-sm pb-12">
          <p>© 2026 Algorithm Visualizer. Built for Education.</p>
        </footer>

      </div>
    </main>
  );
}