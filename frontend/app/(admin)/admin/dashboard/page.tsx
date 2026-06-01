"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

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
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Track task progress across the
          workflow
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border rounded-xl p-4">
          <p className="text-gray-500 text-sm">
            Total Tasks
          </p>

          <h2 className="text-3xl font-bold">
            {tasks.length}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <p className="text-gray-500 text-sm">
            Assigned
          </p>

          <h2 className="text-3xl font-bold">
            {assigned.length}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <p className="text-gray-500 text-sm">
            In Progress
          </p>

          <h2 className="text-3xl font-bold">
            {inProgress.length}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <p className="text-gray-500 text-sm">
            Completed
          </p>

          <h2 className="text-3xl font-bold">
            {completed.length}
          </h2>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <Column
          title="Assigned"
          tasks={assigned}
        />

        <Column
          title="In Progress"
          tasks={inProgress}
        />

        <Column
          title="Review"
          tasks={review}
        />

        <Column
          title="Completed"
          tasks={completed}
        />
      </div>
    </div>
  );
}