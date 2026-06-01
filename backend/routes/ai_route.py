from flask import Blueprint, request
import uuid
from services.supabase import supabase
from extensions import limiter

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/tasks/<task_id>/generate", methods=["POST"])
@limiter.limit("10 per hour")
def generate_images(task_id):

    job = (
        supabase
        .table("jobs")
        .insert({
            "task_id": task_id,
            "status": "queued"
        })
        .execute()
    )
    
    supabase.table(
    "tasks"
    ).update({
        "status": "in_progress"
    }).eq(
        "id",
        task_id
    ).execute()
    
    task = (
    supabase
    .table("tasks")
    .select("*")
    .eq("id", task_id)
    .execute()
    )

    if not task.data:
        return {
        "error": "Task not found"
    }, 404

    return {
        "job_id": job.data[0]["id"],
        "status": "queued"
    } 
    
@ai_bp.route("/jobs/<job_id>/status", methods=["GET"])
def get_job_status(job_id):

    job = (
        supabase
        .table("jobs")
        .select("*")
        .eq("id", job_id)
        .single()
        .execute()
    )

    if not job.data:
        return {
            "error": "Job not found"
        }, 404

    return job.data
   
@ai_bp.route( "/tasks/<task_id>/generations", methods=["GET"])
def get_generations(task_id):

    images = (
        supabase
        .table("generated_images")
        .select("*")
        .eq("task_id", task_id)
        .execute()
    )

    return images.data


@ai_bp.route("/generations/<generation_id>/select", methods=["PATCH"] )
def select_generation(generation_id):

    image = (
        supabase
        .table("generated_images")
        .select("*")
        .eq("id", generation_id)
        .single()
        .execute()
    )

    if not image.data:
        return {
            "error": "Image not found"
        }, 404

    current = image.data["is_selected"]

    supabase.table(
        "generated_images"
    ).update({
        "is_selected": not current
    }).eq(
        "id",
        generation_id
    ).execute()

    return {
        "message": "Updated"
    }
    
@ai_bp.route(
    "/tasks/<task_id>/submit",
    methods=["POST"]
)
def submit_selection(task_id):

    selected = (
        supabase
        .table("generated_images")
        .select("*")
        .eq("task_id", task_id)
        .eq("is_selected", True)
        .execute()
    )

    if len(selected.data) == 0:
        return {
            "error":
            "Select at least one image"
        }, 400

    supabase.table(
        "tasks"
    ).update({
        "status": "review"
    }).eq(
        "id",
        task_id
    ).execute()

    return {
        "message":
        "Task completed"
    }