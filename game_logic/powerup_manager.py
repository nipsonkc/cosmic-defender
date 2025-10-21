import random
from .constants import POWERUP_TYPES

class PowerupManager:
    """Manages powerup generation and effects"""
    
    @staticmethod
    def should_drop_powerup(drop_chance=0.28):
        """Determine if a powerup should drop"""
        return random.random() < drop_chance
    
    @staticmethod
    def get_random_powerup_type():
        """Get a random powerup type"""
        return random.choice(list(POWERUP_TYPES.keys()))
    
    @staticmethod
    def get_powerup_config(powerup_type):
        """Get configuration for a powerup type"""
        if powerup_type not in POWERUP_TYPES:
            raise ValueError(f"Invalid powerup type: {powerup_type}")
        return POWERUP_TYPES[powerup_type].copy()
    
    @staticmethod
    def generate_powerup(x, y):
        """Generate a powerup drop"""
        if not PowerupManager.should_drop_powerup():
            return None
        
        powerup_type = PowerupManager.get_random_powerup_type()
        config = PowerupManager.get_powerup_config(powerup_type)
        
        return {
            'type': powerup_type,
            'x': x,
            'y': y,
            'config': config
        }
    
    @staticmethod
    def apply_powerup_effect(game_session, powerup_type):
        """Apply powerup effect to game session"""
        config = PowerupManager.get_powerup_config(powerup_type)
        
        if powerup_type == 'HEALTH':
            game_session.add_life()
            return {
                'applied': True,
                'message': 'Extra life gained!',
                'duration': 0
            }
        else:
            game_session.activate_powerup(powerup_type, config['duration'])
            return {
                'applied': True,
                'message': f"{config['name']} activated!",
                'duration': config['duration']
            }
    
    @staticmethod
    def get_all_powerup_types():
        """Get all available powerup types"""
        return POWERUP_TYPES