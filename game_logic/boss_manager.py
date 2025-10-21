from .constants import BOSS_CONFIG
from .level_manager import LevelManager

class BossManager:
    """Manages boss generation and behavior patterns"""
    
    @staticmethod
    def generate_boss(level, wave):
        """Generate boss configuration for a wave"""
        level_config = LevelManager.get_level_config(level)
        
        # Calculate health
        base_health = level_config['bossHealth']
        health = base_health + (wave * BOSS_CONFIG['healthPerWave'])
        
        # Calculate speed
        base_speed = BOSS_CONFIG['baseSpeed']
        speed_multiplier = level_config['speedMultiplier']
        speed = base_speed * speed_multiplier
        
        boss_data = {
            'x': 450 - (BOSS_CONFIG['width'] // 2),
            'y': 60,
            'width': BOSS_CONFIG['width'],
            'height': BOSS_CONFIG['height'],
            'health': health,
            'maxHealth': health,
            'speed': speed,
            'baseSpeed': base_speed,
            'color': level_config['theme']['accentColor'],
            'level': level,
            'wave': wave,
            'phase': 1
        }
        
        return boss_data
    
    @staticmethod
    def calculate_boss_phase(current_health, max_health):
        """Calculate boss phase based on health percentage"""
        health_percent = current_health / max_health
        
        if health_percent > 0.66:
            return 1
        elif health_percent > 0.33:
            return 2
        else:
            return 3
    
    @staticmethod
    def get_phase_config(phase):
        """Get configuration for boss phase"""
        return BOSS_CONFIG['phases'].get(phase, BOSS_CONFIG['phases'][1])
    
    @staticmethod
    def get_attack_pattern(phase, shoot_timer):
        """Generate attack pattern based on phase"""
        phase_config = BossManager.get_phase_config(phase)
        attacks = []
        
        # Phase 1: Single bullet
        if shoot_timer % 40 == 0:
            attacks.append({
                'type': 'single',
                'offsetX': 0,
                'offsetY': BOSS_CONFIG['height'],
                'vx': 0,
                'vy': 6,
                'width': 6,
                'height': 14
            })
        
        # Phase 2+: Spread shot
        if phase >= 2 and shoot_timer % 60 == 0:
            for i in range(-3, 4):
                attacks.append({
                    'type': 'spread',
                    'offsetX': 0,
                    'offsetY': BOSS_CONFIG['height'],
                    'vx': i * 1.2,
                    'vy': 5,
                    'width': 5,
                    'height': 12
                })
        
        # Phase 3: Spiral attack
        if phase >= 3 and shoot_timer % 15 == 0:
            import math
            angle = shoot_timer * 0.2
            attacks.append({
                'type': 'spiral',
                'offsetX': BOSS_CONFIG['width'] // 2,
                'offsetY': BOSS_CONFIG['height'],
                'vx': math.cos(angle) * 3,
                'vy': 4 + math.sin(angle) * 2,
                'width': 5,
                'height': 12
            })
        
        return attacks
    
    @staticmethod
    def get_boss_score():
        """Get score reward for defeating boss"""
        return BOSS_CONFIG['scoreReward']
    
    @staticmethod
    def calculate_boss_speed(phase, base_speed):
        """Calculate boss speed based on phase"""
        phase_config = BossManager.get_phase_config(phase)
        return base_speed * phase_config['speedMultiplier']