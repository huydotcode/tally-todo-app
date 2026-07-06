export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral p-8 text-secondary">
      <main className="flex flex-col items-center max-w-md text-center bg-surface p-8 rounded-xl border border-border shadow-[0_1px_2px_rgba(20,33,61,0.06)]">
        <h1 className="text-4xl font-bold mb-4 tracking-tight text-secondary">Tally</h1>
        <p className="text-base leading-relaxed text-secondary/80 mb-6">
          Chào mừng bạn đến với ứng dụng quản lý công việc tối giản, hiện đại và tươi sáng.
        </p>
        <div className="w-full flex flex-col gap-3">
          <div className="bg-primary text-white py-3 px-6 rounded-md font-semibold text-center hover:opacity-90 transition-opacity cursor-pointer">
            Bắt đầu sử dụng
          </div>
        </div>
      </main>
    </div>
  );
}

