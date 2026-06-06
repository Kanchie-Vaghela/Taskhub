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
    <div className="max-w-7xl mx-auto p-8">

  {/* Header */}
  <div className="mb-10">
    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-sky-500 to-cyan-400 bg-clip-text text-transparent">
      Admin Dashboard
    </h1>

    <p className="text-slate-500 mt-3 text-lg">
      Create and manage tasks across your workflow.
    </p>
  </div>

  {/* Create Task */}
  <div
    className="
      rounded-3xl
      bg-white/30
      backdrop-blur-2xl
      border border-white/50
      shadow-xl
      p-8
      mb-10
    "
  >
    <h2 className="text-2xl font-bold mb-6 text-slate-800">
      Create Task
    </h2>

    <div className="flex flex-col gap-5">

      <input
        className="
          rounded-2xl
          bg-white/60
          border border-white/50
          p-4
          outline-none
          focus:ring-2
          focus:ring-cyan-300
        "
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        rows={5}
        className="
          rounded-2xl
          bg-white/60
          border border-white/50
          p-4
          outline-none
          focus:ring-2
          focus:ring-cyan-300
        "
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        className="
          rounded-2xl
          bg-white/60
          border border-white/50
          p-4
          outline-none
          focus:ring-2
          focus:ring-cyan-300
        "
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
        className="
          rounded-2xl
          bg-white/60
          border border-white/50
          p-3
        "
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setImage(e.target.files[0]);
          }
        }}
      />

      <button
        onClick={uploadImage}
        className="
          rounded-2xl
          py-3
          bg-gradient-to-r
          from-sky-500
          to-cyan-400
          text-white
          font-semibold
          shadow-lg
          hover:scale-[1.02]
          transition
        "
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Preview"
          className="
            w-48
            rounded-2xl
            border
            border-white/40
            shadow-lg
          "
        />
      )}

      <button
        onClick={handleCreateTask}
        className="
          rounded-2xl
          py-4
          bg-gradient-to-r
          from-sky-500
          to-cyan-400
          text-white
          font-semibold
          shadow-lg
          hover:scale-[1.02]
          transition
        "
      >
        Create Task
      </button>

    </div>
  </div>

  {/* Tasks */}
  <div>

    <h2 className="text-3xl font-bold mb-6 text-slate-800">
      All Tasks
    </h2>

    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

      {tasks.map((task) => (
        <div
          key={task.id}
          className="
            rounded-3xl
            bg-white/30
            backdrop-blur-xl
            border border-white/50
            shadow-lg
            p-5
            hover:-translate-y-1
            hover:shadow-cyan-300/30
            transition-all
          "
        >

          <div className="flex justify-between items-center">

            <h3 className="text-xl font-bold text-slate-800">
              {task.title}
            </h3>

            <span
              className="
                px-4
                py-1
                rounded-full
                bg-sky-100
                text-sky-700
                text-sm
                font-medium
              "
            >
              {task.status}
            </span>

          </div>

          <p className="text-slate-500 mt-3">
            {task.description}
          </p>

          <p className="text-sm text-slate-400 mt-4">
            Assigned To: {task.assigned_to ?? "Not Assigned"}
          </p>

          {task.product_image_url && (
            <img
              src={task.product_image_url}
              alt="Product"
              className="
                mt-5
                w-full
                h-48
                rounded-2xl
                object-cover
                border
                border-white/40
              "
            />
          )}

        </div>
      ))}

    </div>

  </div>

</div>
  );
}
