from flask import Blueprint, request
import uuid
from services.supabase import supabase

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/tasks/<task_id>/generate", methods=["POST"])
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

    return job.data
   
@ai_bp.route(
    "/tasks/<task_id>/generations",
    methods=["GET"]
)
def get_generations(task_id):

    images = (
        supabase
        .table("generated_images")
        .select("*")
        .eq("task_id", task_id)
        .execute()
    )

    return images.data