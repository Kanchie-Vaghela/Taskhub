"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";

export default function AdminTasksPage() {
  type Task = {
    id: string;
    title: string;
    description: string;
    status: string;
    assigned_to: string | null;
  };
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<Record<string, string>>({});

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

  const assignTask = async (taskId: string, userId: string) => {
    await api.post(`/api/tasks/${taskId}/assign`, {
      user_id: userId,
    });

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
        <option>Select User</option>

        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.email}
          </option>
        ))}
      </select>

      <br />
      <button onClick={handleCreateTask}>Create Task</button>

      <hr />

      <h2>All Tasks</h2>

      {tasks.map((task) => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>

          {task.assigned_to == null ? (
            <>
              <select
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    [task.id]: e.target.value,
                  })
                }
              >
                <option>Select User</option>

                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.email}
                  </option>
                ))}
              </select>

              <button
                onClick={() => assignTask(task.id, selectedUser[task.id])}
              >
                Assign
              </button>
            </>
          ) : null}
        </div>
      ))}
    </div>
  );
}
