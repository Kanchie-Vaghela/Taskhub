from flask import Flask
from flask_cors import CORS

from routes.auth_route import auth_bp
from routes.task_route import task_bp

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/*": {
            "origins": "http://localhost:3000"
        }
    }
)

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(
    task_bp,
    url_prefix="/api/tasks"
)


@app.route("/")
def home():
    
    return {"message": "Backend Running"}

if __name__ == "__main__":
    app.run(debug=True)