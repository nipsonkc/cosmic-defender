import random
from .constants import ENEMY_TYPES
from .level_manager import LevelManager

class EnemyManager:
    """Manages enemy generation and AI logic"""
    
    @staticmethod
    def generate_enemy_type(level, wave):
        """Generate random enemy type based on level distribution"""
        distribution = LevelManager.get_enemy_distribution(level)
        rand = random.random()
        cumulative = 0
        
        for enemy_type, probability in distribution.items():
            cumulative += probability
            if rand < cumulative:
                return enemy_type
        
        return 'BASIC'
    
    @staticmethod
    def get_enemy_config(enemy_type):
        """Get configuration for enemy type"""
        if enemy_type not in ENEMY_TYPES:
            raise ValueError(f"Invalid enemy type: {enemy_type}")
        return ENEMY_TYPES[enemy_type].copy()
    
    @staticmethod
    def calculate_enemy_speed(enemy_type, level, wave):
        """Calculate enemy speed with level and wave modifiers"""
        base_speed = ENEMY_TYPES[enemy_type]['baseSpeed']
        level_multiplier = LevelManager.get_speed_multiplier(level)
        wave_multiplier = 1 + (wave * 0.1)
        
        return base_speed * level_multiplier * wave_multiplier
    
    @staticmethod
    def generate_wave_enemies(level, wave):
        """Generate all enemies for a wave"""
        cols, rows = LevelManager.calculate_wave_dimensions(wave)
        enemies = []
        
        for row in range(rows):
            for col in range(cols):
                enemy_type = EnemyManager.generate_enemy_type(level, wave)
                enemy_config = EnemyManager.get_enemy_config(enemy_type)
                
                # Calculate position
                x = col * 90 + 60
                y = row * 60 + 50
                
                # Calculate speed with modifiers
                speed = EnemyManager.calculate_enemy_speed(enemy_type, level, wave)
                enemy_config['speed'] = speed
                
                enemy_data = {
                    'type': enemy_type,
                    'x': x,
                    'y': y,
                    'config': enemy_config
                }
                enemies.append(enemy_data)
        
        return enemies
    
    @staticmethod
    def get_enemy_score(enemy_type):
        """Get score value for killing an enemy"""
        return ENEMY_TYPES[enemy_type]['score']
    
    @staticmethod
    def should_enemy_shoot(enemy_type):
        """Determine if enemy should shoot"""
        shoot_chance = ENEMY_TYPES[enemy_type]['shootChance']
        return random.random() < shoot_chance