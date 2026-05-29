from flask import Blueprint, request
from services.supabase import supabase

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/sync-user", methods=["POST"])
def sync_user():

    data = request.json

    user_id = data["id"]

    existing_user = (
        supabase
        .table("users")
        .select("*")
        .eq("id", user_id)
        .execute()
    )

    if not existing_user.data:

        new_user = (
            supabase
            .table("users")
            .insert({
                "id": data["id"],
                "email": data["email"],
                "name": data["name"],
                "role": "user"
            })
            .execute()
        )

        return {
            "message": "User created",
            "role": "user"
        }

    return {
        "message": "User exists",
        "role": existing_user.data[0]["role"]
    }
    
@auth_bp.route("/users", methods=["GET"])
def get_users():
    


    users = (
        supabase
        .table("users")
        .select("*")
        .execute()
    )

    return users.data