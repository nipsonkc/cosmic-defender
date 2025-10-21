import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'cosmic_defender_secret_2024'
    DEBUG = True
    PORT = 5000
    
    # Game configuration
    INITIAL_LIVES = 3
    MAX_LIVES = 9
    BOSS_WAVE_INTERVAL = 5
    POWERUP_DROP_CHANCE = 0.28
    
    # Canvas dimensions
    CANVAS_WIDTH = 900
    CANVAS_HEIGHT = 600