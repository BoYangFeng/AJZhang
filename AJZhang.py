
from flask import Flask
from flask import url_for
app = Flask(__name__)

@app.route('/')
def index():
    return "Index page"

@app.route('/hello')
def hello_world():
    return 'Hello World!'


if __name__ == '__main__':
    app.run(debug=True)
