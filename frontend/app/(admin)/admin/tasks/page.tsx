"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  assigned_to: string | null;
  product_image_url?: string;
};

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedUser, setAssignedUser] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/auth/users");
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

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
        assigned_to: assignedUser,
        product_image_url: imageUrl,
      });

      setTitle("");
      setDescription("");
      setAssignedUser("");
      setImageUrl("");

      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const uploadImage = async () => {
    if (!image) return;

    setUploading(true);

    const formData = new FormData();

    formData.append("file", image);
    formData.append("upload_preset", "taskhub-images");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dbxmbylq3/image/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      setImageUrl(data.secure_url);

      console.log(data.secure_url);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="bg-white rounded-xl shadow p-6 border">
        <h2 className="text-xl font-semibold mb-4">Create Task</h2>

        <div className="flex flex-col gap-4">
          <input
            className="border rounded-lg p-3"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="border rounded-lg p-3"
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="border rounded-lg p-3"
            value={assignedUser}
            onChange={(e) => setAssignedUser(e.target.value)}
          >
            <option value="">Select User</option>

            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setImage(e.target.files[0]);
              }
            }}
          />

          <button onClick={uploadImage}>
            {uploading ? "Uploading..." : "Upload Image"}
          </button>

          {imageUrl && (
            <img src={imageUrl} alt="Preview" className="w-40 rounded" />
          )}

          <button
            onClick={handleCreateTask}
            className="bg-black text-white rounded-lg px-4 py-3 hover:opacity-90"
          >
            Create Task
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">All Tasks</h2>

        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border rounded-xl p-4 shadow-sm bg-white"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{task.title}</h3>

                <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
                  {task.status}
                </span>
              </div>

              <p className="text-gray-600 mt-2">{task.description}</p>

              <p className="text-sm text-gray-500 mt-3">
                Assigned To: {task.assigned_to ?? "Not Assigned"}
              </p>

              {task.product_image_url && (
                <div className="mt-3">
                  <img
                    src={task.product_image_url}
                    alt="Product"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
