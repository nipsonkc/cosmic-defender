from flask import Flask
from config import Config
from routes import game_bp, score_bp

def create_app(config_class=Config):
    """Application factory pattern"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Register blueprints
    app.register_blueprint(game_bp)
    app.register_blueprint(score_bp)
    
    # Root route
    @app.route('/')
    def index():
        from flask import render_template
        return render_template('index.html')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(
        debug=app.config['DEBUG'],
        port=app.config['PORT']
    )