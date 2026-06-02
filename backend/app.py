from flask import Flask
from flask_cors import CORS

from routes.auth_route import auth_bp
from routes.task_route import task_bp
from routes.ai_route import ai_bp
from extensions import limiter
import threading
from workers.ai_worker import start_worker

app = Flask(__name__)
threading.Thread(
    target=start_worker,
    daemon=True
).start()

limiter.init_app(app)

CORS(
    app,
    resources={
        r"/*": {
            "origins": "http://localhost:3000"
        }
    }
)

app.register_blueprint(
    auth_bp, 
    url_prefix="/api/auth"
)
app.register_blueprint(
    task_bp,
    url_prefix="/api/tasks"
)
app.register_blueprint(
    ai_bp,
    url_prefix="/api"
)


@app.route("/")
def home():
    
    return {"message": "Backend Running"}

if __name__ == "__main__":
    app.run(debug=True)