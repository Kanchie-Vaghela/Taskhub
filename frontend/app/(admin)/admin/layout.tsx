export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="w-64 min-h-screen border-r p-4">
        <h1 className="text-xl font-bold mb-4">Admin Panel</h1>

        <nav className="flex flex-col gap-2">
          <a href="/admin/dashboard">Dashboard</a>
          <a href="/admin/tasks">Tasks</a>
          <a href="/admin/users">Users</a>
          <a href="/admin/analytics">Analytics</a>
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}