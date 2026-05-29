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
      await api.patch(
        `/api/tasks/${taskId}/status`,
        {
          status,
        }
      );

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

        const res = await api.get(
          `/api/tasks/${taskId}`
        );

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
    <div>
      <h1>{task.title}</h1>

      <p>{task.description}</p>

      <p>Status: {task.status}</p>

      <p>Assigned To: {task.assigned_to}</p>

      <button
        onClick={() =>
          updateStatus("in_progress")
        }
      >
        Start Task
      </button>

      <button
        onClick={() =>
          updateStatus("completed")
        }
      >
        Complete Task
      </button>
    </div>
  );
}