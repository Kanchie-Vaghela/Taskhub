export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r p-6">
        <h1 className="text-2xl font-bold mb-8">
          TaskHub Admin
        </h1>

        <nav className="flex flex-col gap-2">
          <a
            href="/admin/dashboard"
            className="
              px-4
              py-3
              rounded-lg
              hover:bg-gray-100
              transition
            "
          >
             Dashboard
          </a>

          <a
            href="/admin/tasks"
            className="
              px-4
              py-3
              rounded-lg
              hover:bg-gray-100
              transition
            "
          >
             Tasks
          </a>

          <a
            href="/admin/review"
            className="
              px-4
              py-3
              rounded-lg
              hover:bg-gray-100
              transition
            "
          >
             Review Queue
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}