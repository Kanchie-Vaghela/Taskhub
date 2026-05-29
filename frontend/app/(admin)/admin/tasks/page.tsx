"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";

export default function AdminTasksPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateTask = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const response = await api.post("/api/tasks", {
      title,
      description,
      created_by: user.id,
    });

    console.log(response.data);
  };

  return (
    <div>
      <h1>Create Task</h1>

      <input
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={handleCreateTask}>
        Create Task
      </button>
    </div>
  );
}