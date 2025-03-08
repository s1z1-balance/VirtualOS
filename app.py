from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

# Enable debug mode and auto-reloading
app.debug = True

# Configure static files with cache busting
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['TEMPLATES_AUTO_RELOAD'] = True

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    # Get all files in the static directory to watch
    static_dir = 'static'
    extra_files = []
    
    if os.path.exists(static_dir):
        for root, dirs, files in os.walk(static_dir):
            for file in files:
                extra_files.append(os.path.join(root, file))
    
    # Run with debug mode and watch static files
    app.run(
        debug=True,
        extra_files=extra_files,
        host='0.0.0.0',
        port=5000
    )