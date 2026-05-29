"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";

export default function UserDashboard() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("USER:", user);
      if (!user) return;

      const res = await api.get(
        `/api/tasks/user/${user.id}`
      );
      console.log("TASKS:", res.data);
      setTasks(res.data);
    };

    fetchTasks();
  }, []);

  

  return (
    <div>
      <h1>My Tasks</h1>

      {tasks.map((task) => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>{task.status}</p>
        </div>
      ))}
    </div>
  );
}