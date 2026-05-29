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
    
@task_bp.route("", methods=["GET"])
def get_tasks():

    tasks = (
        supabase
        .table("tasks")
        .select("*")
        .execute()
    )

    return tasks.data

@task_bp.route("/<task_id>/assign", methods=["POST"])
def assign_task(task_id):

    data = request.json

    assigned_user_id = data["user_id"]

    updated_task = (
        supabase
        .table("tasks")
        .update({
            "assigned_to": assigned_user_id,
            "status": "assigned"
        })
        .eq("id", task_id)
        .execute()
    )

    return {
        "message": "Task assigned",
        "task": updated_task.data
    }