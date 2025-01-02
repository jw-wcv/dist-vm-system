from flask import Flask, request
import os

app = Flask(__name__)

@app.route('/sync', methods=['POST'])
def sync_file():
    file = request.files['file']
    file.save(os.path.join('/shared', file.filename))
    return 'File synced successfully', 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)