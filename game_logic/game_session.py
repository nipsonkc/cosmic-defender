import uuid
from datetime import datetime

class GameSession:
    """Manages individual game session state"""
    
    def __init__(self, level):
        self.id = str(uuid.uuid4())
        self.level = level
        self.wave = 1
        self.score = 0
        self.lives = 3
        self.enemies_killed = 0
        self.shots_fired = 0
        self.shots_hit = 0
        self.active_powerup = None
        self.powerup_timer = 0
        self.created_at = datetime.now()
        self.last_updated = datetime.now()
        
    def update_timestamp(self):
        """Update last modified timestamp"""
        self.last_updated = datetime.now()
    
    def add_score(self, points):
        """Add points to score"""
        self.score += points
        self.update_timestamp()
    
    def next_wave(self, bonus):
        """Advance to next wave"""
        self.wave += 1
        self.score += bonus
        self.update_timestamp()
    
    def record_kill(self, score_value):
        """Record enemy kill"""
        self.enemies_killed += 1
        self.score += score_value
        self.shots_hit += 1
        self.update_timestamp()
    
    def record_shot(self):
        """Record bullet fired"""
        self.shots_fired += 1
        self.update_timestamp()
    
    def record_hit(self):
        """Record bullet hit"""
        self.shots_hit += 1
        self.update_timestamp()
    
    def take_damage(self):
        """Player takes damage"""
        self.lives -= 1
        self.update_timestamp()
        return self.lives <= 0
    
    def add_life(self):
        """Add extra life"""
        self.lives = min(9, self.lives + 1)
        self.update_timestamp()
    
    def activate_powerup(self, powerup_type, duration):
        """Activate a powerup"""
        self.active_powerup = powerup_type
        self.powerup_timer = duration
        self.update_timestamp()
    
    def update_powerup_timer(self):
        """Decrement powerup timer"""
        if self.powerup_timer > 0:
            self.powerup_timer -= 1
            if self.powerup_timer <= 0:
                self.active_powerup = None
            self.update_timestamp()
    
    def calculate_accuracy(self):
        """Calculate shooting accuracy"""
        if self.shots_fired == 0:
            return 0
        return round((self.shots_hit / self.shots_fired) * 100)
    
    def to_dict(self):
        """Convert session to dictionary"""
        return {
            'id': self.id,
            'level': self.level,
            'wave': self.wave,
            'score': self.score,
            'lives': self.lives,
            'enemiesKilled': self.enemies_killed,
            'shotsFired': self.shots_fired,
            'shotsHit': self.shots_hit,
            'accuracy': self.calculate_accuracy(),
            'activePowerup': self.active_powerup,
            'powerupTimer': self.powerup_timer,
            'createdAt': self.created_at.isoformat(),
            'lastUpdated': self.last_updated.isoformat()
        }
    
    def is_game_over(self):
        """Check if game is over"""
        return self.lives <= 0