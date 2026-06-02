import sys
import os

sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

import time
from services.supabase import supabase


def start_worker():

    print("Worker started...")

    while True:

        jobs = (
            supabase
            .table("jobs")
            .select("*")
            .eq("status", "queued")
            .execute()
        )

        for job in jobs.data:

            print(
                f"Processing {job['id']}"
            )

            supabase.table(
                "jobs"
            ).update({
                "status": "processing"
            }).eq(
                "id",
                job["id"]
            ).execute()

            time.sleep(5)

            images = [
                {
                    "task_id": job["task_id"],
                    "image_type": "luxury",
                    "image_url":
                    "https://picsum.photos/600/400",
                    "prompt_used":
                    "fake generation",
                    "angle": "front",
                    "is_selected": False,
                    "metadata": {
                        "provider": "fake"
                    }
                },
                {
                    "task_id": job["task_id"],
                    "image_type": "luxury",
                    "image_url":
                    "https://picsum.photos/600/401",
                    "prompt_used":
                    "fake generation",
                    "angle": "side",
                    "is_selected": False,
                    "metadata": {
                        "provider": "fake"
                    }
                }
            ]

            supabase.table(
                "generated_images"
            ).insert(images).execute()

            supabase.table(
                "jobs"
            ).update({
                "status": "completed"
            }).eq(
                "id",
                job["id"]
            ).execute()

            print(
                f"Completed {job['id']}"
            )

        time.sleep(2)


if __name__ == "__main__":
    start_worker()