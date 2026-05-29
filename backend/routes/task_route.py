from flask import Blueprint, request
from services.supabase import supabase

task_bp = Blueprint("tasks", __name__)

@task_bp.route("", methods=["POST"])
def create_task():

    data = request.json

    task = (
        supabase
        .table("tasks")
        .insert({
            "title": data["title"],
            "description": data["description"],
            "created_by": data["created_by"],
            "status": "pending"
        })
        .execute()
    )

    return {
        "message": "Task created",
        "task": task.data
    }