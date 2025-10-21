from .constants import LEVELS, WAVE_CONFIG

class LevelManager:
    """Manages level configurations and wave generation"""
    
    @staticmethod
    def get_level_config(level):
        """Get configuration for a specific level"""
        if level not in LEVELS:
            raise ValueError(f"Invalid level: {level}")
        return LEVELS[level]
    
    @staticmethod
    def get_all_levels():
        """Get all level configurations"""
        return LEVELS
    
    @staticmethod
    def calculate_wave_dimensions(wave):
        """Calculate grid dimensions for a wave"""
        cols = min(
            WAVE_CONFIG['maxCols'],
            int(WAVE_CONFIG['minCols'] + wave * WAVE_CONFIG['colsPerWave'])
        )
        rows = min(
            WAVE_CONFIG['maxRows'],
            int(WAVE_CONFIG['minRows'] + wave * WAVE_CONFIG['rowsPerWave'])
        )
        return cols, rows
    
    @staticmethod
    def is_boss_wave(wave):
        """Check if current wave is a boss wave"""
        return wave % 5 == 0
    
    @staticmethod
    def calculate_wave_bonus(wave):
        """Calculate bonus score for completing a wave"""
        return wave * WAVE_CONFIG['waveBonus']
    
    @staticmethod
    def get_speed_multiplier(level):
        """Get speed multiplier for level"""
        return LEVELS[level]['speedMultiplier']
    
    @staticmethod
    def get_enemy_distribution(level):
        """Get enemy type distribution for level"""
        return LEVELS[level]['enemyDistribution']
    
    @staticmethod
    def validate_level(level):
        """Validate if level exists"""
        return level in LEVELS