"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  product_image_url?: string;
};

export default function ReviewPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/api/tasks");

      const reviewTasks = res.data.filter(
        (task: Task) =>
          task.status === "review"
      );

      setTasks(reviewTasks);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Review Queue
      </h1>

      {tasks.length === 0 ? (
        <p>No tasks waiting for review.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white border rounded-xl p-4"
            >
              {task.product_image_url && (
                <img
                  src={task.product_image_url}
                  alt=""
                  className="
                    w-full
                    h-48
                    object-cover
                    rounded-lg
                    mb-4
                  "
                />
              )}

              <h2 className="text-xl font-semibold">
                {task.title}
              </h2>

              <p className="text-gray-600 mt-2">
                {task.description}
              </p>

              <Link
                href={`/admin/review/${task.id}`}
                className="
                  inline-block
                  mt-4
                  bg-black
                  text-white
                  px-4
                  py-2
                  rounded-lg
                "
              >
                Open Review
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}