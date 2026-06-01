"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import Link from "next/link";

export default function UserDashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTasks = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const res = await api.get(
        `/api/tasks/user/${user.id}`
      );

      setTasks(res.data);
    };

    fetchTasks();
  }, []);

  const filteredTasks =
    filter === "all"
      ? tasks
      : tasks.filter(
          (task) =>
            task.status === filter
        );

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          My Tasks
        </h1>

        <p className="text-gray-500 mt-2">
          View and manage your assigned
          tasks
        </p>

        <div className="flex flex-wrap gap-2 mt-6">
          {[
            "all",
            "assigned",
            "in_progress",
            "review",
            "completed",
          ].map((status) => (
            <button
              key={status}
              onClick={() =>
                setFilter(status)
              }
              className={`
                px-4
                py-2
                rounded-lg
                border
                capitalize
                transition
                ${
                  filter === status
                    ? "bg-black text-white"
                    : "bg-white hover:bg-gray-100"
                }
              `}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTasks.map((task) => (
          <Link
            key={task.id}
            href={`/tasks/${task.id}`}
          >
            <div
              className="
                bg-white
                border
                rounded-xl
                p-5
                hover:shadow-md
                hover:border-gray-300
                transition
                cursor-pointer
              "
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {task.title}
                  </h3>

                  <p className="text-gray-600 mt-2">
                    {task.description}
                  </p>

                  {task.status ===
                    "review" && (
                    <div
                      className="
                        mt-3
                        bg-purple-50
                        border
                        border-purple-200
                        text-purple-700
                        rounded-lg
                        px-3
                        py-2
                        text-sm
                      "
                    >
                      ⚠ Review feedback
                      received. Open task
                      to make revisions.
                    </div>
                  )}
                </div>

                <span
                  className={`
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-medium
                    whitespace-nowrap
                    ${
                      task.status ===
                      "completed"
                        ? "bg-green-100 text-green-700"
                        : task.status ===
                          "review"
                        ? "bg-purple-100 text-purple-700"
                        : task.status ===
                          "in_progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }
                  `}
                >
                  {task.status.replace(
                    "_",
                    " "
                  )}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div
          className="
            text-center
            text-gray-500
            mt-12
          "
        >
          No tasks found.
        </div>
      )}
    </div>
  );
}