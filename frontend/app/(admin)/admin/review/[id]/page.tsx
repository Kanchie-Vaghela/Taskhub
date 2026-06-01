"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

export default function ReviewTaskPage() {
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (!taskId) return;

    fetchData();
  }, [taskId]);

  const fetchData = async () => {
    try {
      const taskRes = await api.get(
        `/api/tasks/${taskId}`
      );

      setTask(taskRes.data);

      const imageRes = await api.get(
        `/api/tasks/${taskId}/generations`
      );

      setImages(
        imageRes.data.filter(
          (img: any) => img.is_selected
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const approveTask = async () => {
    try {
      await api.patch(
        `/api/tasks/${taskId}/approve`
      );

      alert("Task Approved");

      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const requestRevision = async () => {
    try {
      await api.patch(
        `/api/tasks/${taskId}/revision`
      );

      alert("Revision Requested");

      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  if (!task) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="bg-white border rounded-xl p-6 shadow-sm">

        <h1 className="text-3xl font-bold mb-6">
          Review Task
        </h1>

        <div className="grid md:grid-cols-2 gap-8">

          <div>
            <h2 className="font-semibold text-lg mb-3">
              Original Product
            </h2>

            {task.product_image_url && (
              <img
                src={task.product_image_url}
                alt=""
                className="
                  w-full
                  rounded-xl
                  border
                "
              />
            )}
          </div>

          <div>
            <h2 className="font-semibold text-lg">
              {task.title}
            </h2>

            <p className="text-gray-600 mt-3">
              {task.description}
            </p>

            <div className="mt-4">
              <span
                className="
                  px-3
                  py-1
                  rounded-full
                  bg-yellow-100
                  text-yellow-700
                  text-sm
                "
              >
                {task.status}
              </span>
            </div>
          </div>

        </div>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold mb-4">
          Selected Images
        </h2>

        {images.length === 0 ? (
          <p className="text-gray-500">
            No selected images found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {images.map((img) => (
              <div
                key={img.id}
                className="
                  border
                  rounded-xl
                  overflow-hidden
                "
              >
                <img
                  src={img.image_url}
                  alt=""
                  onClick={() =>
                    setPreviewImage(
                      img.image_url
                    )
                  }
                  className="
                    w-full
                    cursor-pointer
                    hover:opacity-90
                  "
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-4 mt-8">

          <button
            onClick={approveTask}
            className="
              bg-green-600
              text-white
              px-5
              py-3
              rounded-lg
            "
          >
            Approve Task
          </button>

          <button
            onClick={requestRevision}
            className="
              bg-red-600
              text-white
              px-5
              py-3
              rounded-lg
            "
          >
            Request Revision
          </button>

        </div>

      </div>

      {previewImage && (
        <div
          className="
            fixed
            inset-0
            bg-black/80
            flex
            items-center
            justify-center
            z-50
            p-4
          "
          onClick={() =>
            setPreviewImage("")
          }
        >
          <img
            src={previewImage}
            alt=""
            className="
              max-w-[90vw]
              max-h-[90vh]
              rounded-xl
            "
          />
        </div>
      )}
    </div>
  );
}