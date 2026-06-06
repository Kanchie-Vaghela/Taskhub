"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import GlassCard from "../glasscard";
import Link from "next/link";


type Task = {
  id: string;
  title: string;
  status: string;
  assigned_to: string | null;
  product_image_url?: string;
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/api/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const assigned = tasks.filter(
    (task) => task.status === "assigned"
  );

  const inProgress = tasks.filter(
    (task) => task.status === "in_progress"
  );

  const review = tasks.filter(
    (task) => task.status === "review"
  );

  const completed = tasks.filter(
    (task) => task.status === "completed"
  );

  const Column = ({
    title,
    tasks,
  }: {
    title: string;
    tasks: Task[];
  }) => (
    <div className="bg-white rounded-xl border p-4 min-h-[500px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">
          {title}
        </h2>

        <span className="bg-gray-100 px-2 py-1 rounded-full text-sm">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="border rounded-lg p-3 bg-gray-50"
          >
            {task.product_image_url && (
              <img
                src={task.product_image_url}
                alt=""
                className="
                  w-full
                  h-32
                  object-cover
                  rounded-lg
                  mb-3
                "
              />
            )}

            <h3 className="font-medium">
              {task.title}
            </h3>

            <p className="text-xs text-gray-500 mt-2 break-all">
              {task.assigned_to ??
                "Unassigned"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-cyan-50 p-6 md:p-10">

  {/* Header */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
    <div>
      <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-sky-500 to-cyan-400 bg-clip-text text-transparent">
        Admin Dashboard
      </h1>

      <p className="text-slate-500 mt-3 text-lg">
        Monitor tasks flowing through your system.
      </p>
    </div>
<Link
  href="/admin/tasks"
  className="
    inline-block
    mt-5 md:mt-0
    px-6 py-3
    rounded-2xl
    bg-white/40
    backdrop-blur-xl
    border border-white/50
    shadow-lg
    hover:shadow-cyan-300/40
    hover:scale-105
    transition
  "
>
  + New Task
</Link>
  </div>

  {/* Stats */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">

    <GlassCard title="Total Tasks" value={tasks.length} color="from-sky-400 to-cyan-300"/>

    <GlassCard title="Assigned" value={assigned.length} color="from-cyan-400 to-blue-300"/>

    <GlassCard title="In Progress" value={inProgress.length} color="from-blue-400 to-indigo-300"/>

    <GlassCard title="Completed" value={completed.length} color="from-teal-400 to-cyan-300"/>

  </div>

  {/* Kanban */}
  <div className="grid lg:grid-cols-4 gap-6">

    <div className="rounded-3xl bg-white/35 backdrop-blur-2xl border border-white/50 p-4 shadow-xl">
      <Column title="Assigned" tasks={assigned}/>
    </div>

    <div className="rounded-3xl bg-white/35 backdrop-blur-2xl border border-white/50 p-4 shadow-xl">
      <Column title="In Progress" tasks={inProgress}/>
    </div>

    <div className="rounded-3xl bg-white/35 backdrop-blur-2xl border border-white/50 p-4 shadow-xl">
      <Column title="Review" tasks={review}/>
    </div>

    <div className="rounded-3xl bg-white/35 backdrop-blur-2xl border border-white/50 p-4 shadow-xl">
      <Column title="Completed" tasks={completed}/>
    </div>

  </div>

</div>
  );
}