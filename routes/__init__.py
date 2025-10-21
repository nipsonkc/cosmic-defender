from flask import Blueprint

game_bp = Blueprint('game', __name__, url_prefix='/api/game')
score_bp = Blueprint('score', __name__, url_prefix='/api/scores')

from . import game_routes, score_routes

__all__ = ['game_bp', 'score_bp']