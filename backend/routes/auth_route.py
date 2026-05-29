from flask import Blueprint, request

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/sync-user", methods=["POST"])
def sync_user():
    data = request.json

    print(data)

    return {
        "message": "User received",
        "user": data
    }