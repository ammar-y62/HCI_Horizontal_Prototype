from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify({"message": "Hello from Flask backend!"})

if __name__ == "__main__":
    # You can set debug=False for production
    app.run(debug=True)
