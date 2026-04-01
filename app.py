from flask import Flask, jsonify

app = Flask(__name__, static_folder="static")


@app.route("/")
def index():
    return """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Catch Me If You Can</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="/static/style.css" />
</head>
<body>
  <div id="instruction" class="instruction-banner">
    Move the cursor to start the challenge
  </div>

  <div id="secretMessage" style="display:none;"></div>

  <button id="resButton">CLICK</button>

  <script src="/static/script.js"></script>
</body>
</html>
    """



@app.route("/secret-message")
def secret_message():
    return jsonify({"message": "is_even_working}"})


if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=1337)