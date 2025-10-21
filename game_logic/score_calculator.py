from .enemy_manager import EnemyManager
from .boss_manager import BossManager
from .level_manager import LevelManager

class ScoreCalculator:
    """Handles all score and statistics calculations"""
    
    @staticmethod
    def calculate_enemy_score(enemy_type):
        """Calculate score for killing an enemy"""
        return EnemyManager.get_enemy_score(enemy_type)
    
    @staticmethod
    def calculate_boss_score():
        """Calculate score for defeating a boss"""
        return BossManager.get_boss_score()
    
    @staticmethod
    def calculate_wave_bonus(wave):
        """Calculate bonus for completing a wave"""
        return LevelManager.calculate_wave_bonus(wave)
    
    @staticmethod
    def calculate_accuracy(shots_fired, shots_hit):
        """Calculate shooting accuracy percentage"""
        if shots_fired == 0:
            return 0
        return round((shots_hit / shots_fired) * 100)
    
    @staticmethod
    def calculate_final_stats(game_session):
        """Calculate final game statistics"""
        accuracy = ScoreCalculator.calculate_accuracy(
            game_session.shots_fired,
            game_session.shots_hit
        )
        
        return {
            'score': game_session.score,
            'level': game_session.level,
            'levelName': LevelManager.get_level_config(game_session.level)['name'],
            'wave': game_session.wave,
            'enemiesKilled': game_session.enemies_killed,
            'shotsFired': game_session.shots_fired,
            'shotsHit': game_session.shots_hit,
            'accuracy': accuracy,
            'lives': game_session.lives
        }
    
    @staticmethod
    def calculate_performance_rating(accuracy, wave, enemies_killed):
        """Calculate performance rating (S, A, B, C, D, F)"""
        score = 0
        
        # Accuracy scoring
        if accuracy >= 80:
            score += 40
        elif accuracy >= 60:
            score += 30
        elif accuracy >= 40:
            score += 20
        elif accuracy >= 20:
            score += 10
        
        # Wave scoring
        score += min(wave * 3, 30)
        
        # Kills scoring
        score += min(enemies_killed * 0.5, 30)
        
        # Determine rating
        if score >= 90:
            return 'S'
        elif score >= 80:
            return 'A'
        elif score >= 70:
            return 'B'
        elif score >= 60:
            return 'C'
        elif score >= 50:
            return 'D'
        else:
            return 'F'