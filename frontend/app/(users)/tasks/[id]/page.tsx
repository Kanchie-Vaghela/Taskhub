"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

export default function TaskDetailsPage() {
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<any>(null);
  const [job, setJob] = useState<any>(null);
  const [style, setStyle] = useState("luxury");

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

  const generateImages = async () => {
    try {
      const res = await api.post(`/api/tasks/${taskId}/generate`, {
        style,
      });

      setJob(res.data);

      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };
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

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-3">AI Generation</h2>

            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="luxury">Luxury</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="studio">Studio</option>
              <option value="instagram">Instagram Ad</option>
            </select>

            <button
              onClick={generateImages}
              className="ml-3 px-4 py-2 bg-black text-white rounded"
            >
              Generate
            </button>
          </div>

          {job && (
            <div className="mt-4 border rounded p-4">
              <p>Job ID: {job.job_id}</p>
              <p>Status: {job.status}</p>
              <p>Style: {job.style}</p>
            </div>
          )}

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
