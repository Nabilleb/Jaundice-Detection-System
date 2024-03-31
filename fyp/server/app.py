from flask import Flask, jsonify
import subprocess

app = Flask(__name__)

@app.route('/run-main', methods=['POST'])
def run_main():

    result = subprocess.run(['python', 'main.py'], capture_output=True, text=True)
    return jsonify({"output": result.stdout, "error": result.stderr})

if __name__ == '__main__':

    app.run(host='0.0.0.0', port=8000, debug=True)
    print("lisening on port 8000")
