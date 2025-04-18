from flask import Flask
from routes.nlp_routes import nlp_bp

app = Flask(__name__)
app.register_blueprint(nlp_bp, url_prefix="/nlp")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

