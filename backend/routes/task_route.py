from flask import Blueprint, request
from services.supabase import supabase
from services.email_service import send_email

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
            "assigned_to": data["assigned_to"],
            "product_image_url": data["product_image_url"],
            "status": "assigned"
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

    print("ASSIGN ROUTE HIT\n")
    print("TASK ID:", task_id)

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

    user = (
        supabase
        .table("users")
        .select("*")
        .eq("id", assigned_user_id)
        .single()
        .execute()
    )

    user_email = user.data["email"]
    print("ABOUT TO SEND EMAIL")
    send_email(
        user_email,
        "New Task Assigned",
        f"""
        <div style="font-family: Arial; max-width: 600px; margin: auto;">
            <h2>📋 New Task Assigned</h2>

            <p>
                A new task has been assigned to you in TaskHub.
            </p>

            <p>
                Task ID:
                <b>{task_id}</b>
            </p>

            <a
                href="http://localhost:3000/dashboard"
                style="
                    background:#000;
                    color:white;
                    padding:12px 20px;
                    border-radius:8px;
                    text-decoration:none;
                    display:inline-block;
                "
            >
                Open Dashboard
            </a>

            <hr>

            <p style="color:gray;">
                TaskHub Notification
            </p>
        </div>
        """
    )
    print("ABOUT TO SEND EMAIL end \n")
    return {
        "message": "Task assigned",
        "task": updated_task.data
    }
    
@task_bp.route("/<task_id>", methods=["GET"])
def get_task(task_id):

    task = (
        supabase
        .table("tasks")
        .select("*")
        .eq("id", task_id)
        .single()
        .execute()
    )

    return task.data

@task_bp.route("/<task_id>/status", methods=["PATCH"])
def update_task_status(task_id):

    data = request.json

    task = (
        supabase
        .table("tasks")
        .update({
            "status": data["status"]
        })
        .eq("id", task_id)
        .execute()
    )

    return {
        "message": "Status updated",
        "task": task.data
    }

@task_bp.route("/user/<user_id>", methods=["GET"])
def get_user_tasks(user_id):

    print("USER ID:", user_id)

    tasks = (
        supabase
        .table("tasks")
        .select("*")
        .eq("assigned_to", user_id)
        .execute()
    )

    print(tasks.data)

    return tasks.data

@task_bp.route("/<task_id>/approve",methods=["PATCH"])
def approve_task(task_id):

    task = (
        supabase
        .table("tasks")
        .select("*")
        .eq("id", task_id)
        .single()
        .execute()
    )

    user = (
        supabase
        .table("users")
        .select("*")
        .eq(
            "id",
            task.data["assigned_to"]
        )
        .single()
        .execute()
    )

    supabase.table(
        "tasks"
    ).update({
        "status": "completed"
    }).eq(
        "id",
        task_id
    ).execute()

    send_email(
        user.data["email"],
        "Task Approved",
        f"""
        <div style="font-family: Arial;">
            <h2>✅ Task Approved</h2>

            <p>
                Your task has been approved.
            </p>

            <p>
                Task ID:
                <b>{task_id}</b>
            </p>

            <a
                href="http://localhost:3000/dashboard"
                style="
                    background:#16a34a;
                    color:white;
                    padding:12px 20px;
                    border-radius:8px;
                    text-decoration:none;
                "
            >
                View Dashboard
            </a>
        </div>
        """
    )

    return {
        "message": "Approved"
    }
       
@task_bp.route("/<task_id>/revision", methods=["PATCH"])
def request_revision(task_id):

    data = request.json

    task = (
        supabase
        .table("tasks")
        .select("*")
        .eq("id", task_id)
        .single()
        .execute()
    )

    user = (
        supabase
        .table("users")
        .select("*")
        .eq(
            "id",
            task.data["assigned_to"]
        )
        .single()
        .execute()
    )

    supabase.table(
        "tasks"
    ).update({
        "status": "review",
        "review_feedback":
        data.get("feedback", "")
    }).eq(
        "id",
        task_id
    ).execute()

    send_email(
        user.data["email"],
        "Revision Requested",
        f"""
        <div style="font-family: Arial;">
            <h2>⚠️ Revision Requested</h2>

            <p>
                Your submission needs changes.
            </p>

            <div
                style="
                    background:#fff8db;
                    padding:15px;
                    border-radius:8px;
                "
            >
                {data.get("feedback", "")}
            </div>

            <br>

            <a
                href="http://localhost:3000/dashboard"
                style="
                    background:#f59e0b;
                    color:white;
                    padding:12px 20px;
                    border-radius:8px;
                    text-decoration:none;
                "
            >
                Review Feedback
            </a>
        </div>
        """
    )

    return {
        "message":
        "Revision requested"
    }

    data = request.json

    supabase.table(
        "tasks"
    ).update({
        "status": "review",
        "review_feedback":
        data.get("feedback", "")
    }).eq(
        "id",
        task_id
    ).execute()

    supabase.table(
        "generated_images"
    ).update({
        "submitted_for_review": False
    }).eq(
        "task_id",
        task_id
    ).execute()
    
    return {
        "message":
        "Revision requested"
    }