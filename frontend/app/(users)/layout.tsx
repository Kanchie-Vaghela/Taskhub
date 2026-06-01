export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r bg-white p-6">
        <h1 className="text-2xl font-bold mb-8">
          TaskHub
        </h1>

        <nav>
          <a
            href="/dashboard"
            className="
              block
              px-4
              py-3
              rounded-lg
              hover:bg-gray-100
              transition
            "
          >
            Dashboard
          </a>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-50 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}