from flask import Blueprint, request
import uuid

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/tasks/<task_id>/generate", methods=["POST"])
def generate_images(task_id):

    data = request.json

    style = data.get("style")

    job_id = str(uuid.uuid4())

    return {
        "message": "Generation started",
        "task_id": task_id,
        "style": style,
        "job_id": job_id,
        "status": "queued"
    }
    
@ai_bp.route("/jobs/<job_id>/status", methods=["GET"])
def get_job_status(job_id):

    return {
        "job_id": job_id,
        "status": "completed"
    }
    
@ai_bp.route(
    "/tasks/<task_id>/generations",
    methods=["GET"]
)
def get_generations(task_id):

    return [
        {
            "id": "1",
            "image_url":
            "https://picsum.photos/500"
        }
    ]