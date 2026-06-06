export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-cyan-50 to-white flex">

      {/* Sidebar */}
      <aside
        className="
          w-72
          m-4
          rounded-3xl
          bg-white/30
          backdrop-blur-2xl
          border border-white/40
          shadow-2xl
          flex
          flex-col
          p-8
        "
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-500 to-cyan-400 bg-clip-text text-transparent mb-10">
          TaskHub
        </h1>

        <nav className="flex flex-col gap-3">

          <a
            href="/admin/dashboard"
            className="
              px-5
              py-4
              rounded-2xl
              hover:bg-sky-100/70
              transition-all
              hover:translate-x-1
              font-semibold
              focus:bg-sky-100/70
              focus:translate-x-1
              text-sky-600  
              text-lg
            "
          >
             Dashboard
          </a>

          <a
            href="/admin/tasks"
            className="
              px-5
              py-4
              rounded-2xl
              hover:bg-sky-100/70
              transition-all
              hover:translate-x-1
              font-semibold
              focus:bg-sky-100/70
              focus:translate-x-1
              text-sky-600  
              text-lg
            "
          >
             Tasks
          </a>

          <a
            href="/admin/review"
            className="
              px-5
              py-4
              rounded-2xl
              hover:bg-sky-100/70
              transition-all
              hover:translate-x-1
              font-semibold
              focus:bg-sky-100/70
              focus:translate-x-1
              text-sky-600  
              text-lg
            "
          >
             Review Queue
          </a>

        </nav>

      
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <div
          className="
            rounded-[32px]
            bg-white/25
            backdrop-blur-2xl
            border
            border-white/40
            shadow-2xl
            p-8
            min-h-[calc(100vh-3rem)]
          "
        >
          {children}
        </div>
      </main>

    </div>
  );
}