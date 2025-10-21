# Level Configurations
LEVELS = {
    1: {
        'name': 'ASTEROID FIELD',
        'theme': {
            'bgColor': '#0a0e27',
            'accentColor': '#4169e1',
            'particleColor': '#6495ed'
        },
        'enemyDistribution': {
            'BASIC': 0.50,
            'FAST': 0.25,
            'TANK': 0.15,
            'SHOOTER': 0.10
        },
        'speedMultiplier': 1.0,
        'bossHealth': 60,
        'description': 'Navigate through the rocky asteroid belt'
    },
    2: {
        'name': 'NEBULA STORM',
        'theme': {
            'bgColor': '#1a0a2e',
            'accentColor': '#ff6b35',
            'particleColor': '#ff9966'
        },
        'enemyDistribution': {
            'BASIC': 0.30,
            'FAST': 0.35,
            'TANK': 0.20,
            'SHOOTER': 0.15
        },
        'speedMultiplier': 1.3,
        'bossHealth': 80,
        'description': 'Fight in the heart of cosmic storms'
    },
    3: {
        'name': 'BLACK HOLE',
        'theme': {
            'bgColor': '#0f0520',
            'accentColor': '#9d00ff',
            'particleColor': '#cc66ff'
        },
        'enemyDistribution': {
            'BASIC': 0.20,
            'FAST': 0.30,
            'TANK': 0.25,
            'SHOOTER': 0.25
        },
        'speedMultiplier': 1.6,
        'bossHealth': 100,
        'description': 'Survive near the event horizon'
    }
}

# Enemy Type Configurations
ENEMY_TYPES = {
    'BASIC': {
        'color': '#4169e1',
        'health': 1,
        'baseSpeed': 1.0,
        'score': 10,
        'shootChance': 0.004,
        'size': 36
    },
    'FAST': {
        'color': '#ffa500',
        'health': 1,
        'baseSpeed': 2.4,
        'score': 20,
        'shootChance': 0.008,
        'size': 36
    },
    'TANK': {
        'color': '#9400d3',
        'health': 3,
        'baseSpeed': 0.7,
        'score': 30,
        'shootChance': 0.006,
        'size': 36
    },
    'SHOOTER': {
        'color': '#ff1493',
        'health': 2,
        'baseSpeed': 1.2,
        'score': 25,
        'shootChance': 0.018,
        'size': 36
    }
}

# Powerup Configurations
POWERUP_TYPES = {
    'SHIELD': {
        'duration': 540,
        'color': '#00ffff',
        'icon': '🛡️',
        'name': 'Shield'
    },
    'RAPID': {
        'duration': 720,
        'color': '#ffff00',
        'icon': '⚡',
        'name': 'Rapid Fire'
    },
    'SPREAD': {
        'duration': 540,
        'color': '#ff00ff',
        'icon': '💥',
        'name': 'Spread Shot'
    },
    'HEALTH': {
        'duration': 0,
        'color': '#00ff60',
        'icon': '❤️',
        'name': 'Extra Life'
    }
}

# Boss Configurations
BOSS_CONFIG = {
    'width': 220,
    'height': 120,
    'baseSpeed': 1.6,
    'baseHealth': 60,
    'healthPerWave': 18,
    'scoreReward': 200,
    'phases': {
        1: {'speedMultiplier': 1.0, 'attackPattern': 'single'},
        2: {'speedMultiplier': 1.2, 'attackPattern': 'spread'},
        3: {'speedMultiplier': 1.4, 'attackPattern': 'spiral'}
    }
}

# Player Configuration
PLAYER_CONFIG = {
    'width': 40,
    'height': 40,
    'speed': 8,
    'shootCooldown': 14,
    'rapidCooldown': 6,
    'spreadCooldown': 14
}

# Wave Configuration
WAVE_CONFIG = {
    'minCols': 5,
    'maxCols': 8,
    'minRows': 2,
    'maxRows': 5,
    'colsPerWave': 0.5,
    'rowsPerWave': 0.5,
    'waveBonus': 50
}