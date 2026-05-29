"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";

export default function AdminTasksPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState<any[]>([]);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTask = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await api.post("/api/tasks", {
        title,
        description,
        created_by: user.id,
      });

      setTitle("");
      setDescription("");

      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    const res = await api.get("/api/auth/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const assignTask = async (
  taskId: string,
  userId: string
) => {

  await api.post(
    `/api/tasks/${taskId}/assign`,
    {
      user_id: userId,
    }
  );

  fetchTasks();
};

  return (
    <div>
      <h1>Create Task</h1>

      <input
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />

      <select>
        <option value="">Select a user</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

        <br />
      <button onClick={handleCreateTask}>Create Task</button>

      <hr />

      <h2>All Tasks</h2>

      {tasks.map((task: any) => (
        <div
          key={task.id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{task.title}</h3>

          <p>{task.description}</p>

          <p>Status: {task.status}</p>
        </div>
      ))}
    </div>
  );
}
