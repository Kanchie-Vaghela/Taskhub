from flask import Blueprint, request
import uuid
from services.supabase import supabase

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/tasks/<task_id>/generate", methods=["POST"])
def generate_images(task_id):

    data = request.json

    style = data.get("style")

    # remove old generated images
    supabase.table(
        "generated_images"
    ).delete().eq(
        "task_id",
        task_id
    ).execute()

    # fake image 1
    supabase.table(
        "generated_images"
    ).insert({
        "task_id": task_id,
        "image_type": style,
        "image_url": "https://picsum.photos/600/400",
        "prompt_used": f"{style} product photography",
        "angle": "front",
        "metadata": {
            "provider": "fake"
        }
    }).execute()

    # fake image 2
    supabase.table(
        "generated_images"
    ).insert({
        "task_id": task_id,
        "image_type": style,
        "image_url": "https://picsum.photos/600/401",
        "prompt_used": f"{style} product photography",
        "angle": "side",
        "metadata": {
            "provider": "fake"
        }
    }).execute()

    return {
        "status": "completed"
    }
   
    
@ai_bp.route("/jobs/<job_id>/status", methods=["GET"])
def get_job_status(job_id):

    return {
        "job_id": job_id,
        "status": "completed"
    }
    


    return [
        {
            "id": "1",
            "image_url":
            "https://picsum.photos/500"
        }
    ]
    
@ai_bp.route( "/tasks/<task_id>/generations", methods=["GET"])
def get_generations(task_id):

    return [
        {
            "id": "1",
            "image_url":
            "https://picsum.photos/600/400"
        },
        {
            "id": "2",
            "image_url":
            "https://picsum.photos/600/401"
        }
    ]