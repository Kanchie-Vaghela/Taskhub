"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import Link from "next/link";

export default function UserDashboard() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("USER:", user);
      if (!user) return;

      const res = await api.get(`/api/tasks/user/${user.id}`);
      console.log("TASKS:", res.data);
      setTasks(res.data);
    };

    fetchTasks();
  }, []);

  return (
  <div className="max-w-5xl mx-auto">
    <div className="mb-8">
      <h1 className="text-3xl font-bold">
        My Tasks
      </h1>

      <p className="text-gray-500 mt-2">
        View and manage your assigned tasks
      </p>
    </div>

    <div className="grid gap-4">
      {tasks.map((task) => (
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
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">
                  {task.title}
                </h3>

                <p className="text-gray-600 mt-2">
                  {task.description}
                </p>
              </div>

              <span
                className={`
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  font-medium
                  ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : task.status === "in_progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }
                `}
              >
                {task.status}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
);
}
