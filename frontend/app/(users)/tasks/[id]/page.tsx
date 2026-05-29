"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

export default function TaskDetailsPage() {
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<any>(null);

  const updateStatus = async (status: string) => {
    try {
      await api.patch(`/api/tasks/${taskId}/status`, {
        status,
      });

      setTask({
        ...task,
        status,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!taskId) return;

    const fetchTask = async () => {
      try {
        console.log("TASK ID:", taskId);

        const res = await api.get(`/api/tasks/${taskId}`);

        console.log(res.data);

        setTask(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTask();
  }, [taskId]);

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        {task.product_image_url && (
          <div className="w-full h-[350px] bg-gray-100">
            <img
              src={task.product_image_url}
              alt={task.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{task.title}</h1>

            <span
              className={`px-4 py-2 rounded-full text-sm font-medium
              ${
                task.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : task.status === "in_progress"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              {task.status}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="font-semibold text-lg mb-2">Description</h2>

              <p className="text-gray-600 leading-relaxed">
                {task.description}
              </p>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-2">Assigned To</h2>

              <p className="text-gray-600 break-all">{task.assigned_to}</p>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => updateStatus("in_progress")}
              className="px-5 py-3 rounded-lg bg-yellow-500 text-white font-medium"
            >
              Start Task
            </button>

            <button
              onClick={() => updateStatus("completed")}
              className="px-5 py-3 rounded-lg bg-green-600 text-white font-medium"
            >
              Complete Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
