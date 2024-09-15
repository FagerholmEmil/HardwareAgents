from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/crew', methods=['POST'])
def run_crew():
    return jsonify({'status': 'success'}), 200

@app.route('/api/crew/<job_id>', methods=['GET'])
def get_status(job_id):
    return jsonify({'status': f"Getting status for {job_id}"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=3001)