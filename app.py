from flask import Flask, render_template, request, jsonify
from core import VirtualOS

app = Flask(__name__)
virtual_os = VirtualOS()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/execute', methods=['POST'])
def execute():
    data = request.json
    command = data.get('command', '').strip()
    
    if not command:
        return jsonify({'error': 'No command provided'})
    
    try:
        output = virtual_os.execute(command)
        return jsonify({'output': output})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)