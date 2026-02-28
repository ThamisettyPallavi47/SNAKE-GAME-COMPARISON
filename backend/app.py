
from flask import Flask, request, jsonify
from flask_cors import CORS
from ai import get_next_move

app = Flask(__name__)
CORS(app)

# ✅ Add this
@app.route("/")
def home():
    return "AI Snake Backend Running 🚀"

@app.route("/next-move-bfs", methods=["POST"])
def next_move_bfs():
    data = request.json
    move = get_next_move(data, "bfs")
    return jsonify({"move": move})


@app.route("/next-move-astar", methods=["POST"])
def next_move_astar():
    data = request.json
    move = get_next_move(data, "astar")
    return jsonify({"move": move})


if __name__ == "__main__":
    app.run(debug=True)