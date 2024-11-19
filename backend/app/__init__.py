# app/__init__.py
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from .config import Config

# Initialize the SQLAlchemy instance globally
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)

    # Import routes here to register them
    from .routes import (admin_bp, auth_bp, schedule_bp, station_bp, ticket_bp,
                         train_bp)

    # Register blueprints
    app.register_blueprint(admin_bp, url_prefix='/admin')
    # app.register_blueprint(passenger_bp, url_prefix='/passenger')
    app.register_blueprint(station_bp, url_prefix='/station')
    app.register_blueprint(train_bp, url_prefix='/train')
    app.register_blueprint(ticket_bp, url_prefix='/ticket')
    app.register_blueprint(schedule_bp, url_prefix='/schedule')
    app.register_blueprint(auth_bp, url_prefix='/auth')

    return app
