export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Algorithm Visualizer</h1>
      <p className="text-gray-400">Ready to code Next.js + TypeScript!</p>
      
      <div className="mt-8 p-4 border border-gray-700 rounded bg-slate-800">
        <code className="text-green-400">Environment: Setup Complete</code>
      </div>
    </main>
  );
}