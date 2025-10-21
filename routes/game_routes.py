from flask import jsonify, request
from routes import game_bp
from game_logic import (
    GameSession, LevelManager, EnemyManager,
    BossManager, PowerupManager, ScoreCalculator
)

# In-memory storage for active game sessions
active_sessions = {}

@game_bp.route('/start', methods=['POST'])
def start_game():
    """Initialize a new game session"""
    data = request.json
    level = data.get('level', 1)
    
    if not LevelManager.validate_level(level):
        return jsonify({'error': 'Invalid level'}), 400
    
    # Create new game session
    game = GameSession(level)
    active_sessions[game.id] = game
    
    # Get level configuration
    level_config = LevelManager.get_level_config(level)
    
    # Generate first wave
    enemies = EnemyManager.generate_wave_enemies(level, 1)
    is_boss = LevelManager.is_boss_wave(1)
    boss_data = BossManager.generate_boss(level, 1) if is_boss else None
    
    wave_config = {
        'enemies': enemies,
        'isBossWave': is_boss,
        'boss': boss_data
    }
    
    return jsonify({
        'success': True,
        'sessionId': game.id,
        'gameState': game.to_dict(),
        'levelConfig': level_config,
        'waveConfig': wave_config
    })

@game_bp.route('/wave/<session_id>', methods=['GET'])
def get_wave(session_id):
    """Get current wave configuration"""
    if session_id not in active_sessions:
        return jsonify({'error': 'Invalid session'}), 404
    
    game = active_sessions[session_id]
    
    # Generate wave enemies
    enemies = EnemyManager.generate_wave_enemies(game.level, game.wave)
    is_boss = LevelManager.is_boss_wave(game.wave)
    boss_data = BossManager.generate_boss(game.level, game.wave) if is_boss else None
    
    wave_config = {
        'enemies': enemies,
        'isBossWave': is_boss,
        'boss': boss_data
    }
    
    return jsonify({
        'success': True,
        'waveConfig': wave_config,
        'gameState': game.to_dict()
    })

@game_bp.route('/next-wave/<session_id>', methods=['POST'])
def next_wave(session_id):
    """Advance to next wave"""
    if session_id not in active_sessions:
        return jsonify({'error': 'Invalid session'}), 404
    
    game = active_sessions[session_id]
    wave_bonus = LevelManager.calculate_wave_bonus(game.wave)
    game.next_wave(wave_bonus)
    
    # Generate next wave
    enemies = EnemyManager.generate_wave_enemies(game.level, game.wave)
    is_boss = LevelManager.is_boss_wave(game.wave)
    boss_data = BossManager.generate_boss(game.level, game.wave) if is_boss else None
    
    wave_config = {
        'enemies': enemies,
        'isBossWave': is_boss,
        'boss': boss_data
    }
    
    return jsonify({
        'success': True,
        'waveConfig': wave_config,
        'gameState': game.to_dict(),
        'waveBonus': wave_bonus
    })

@game_bp.route('/enemy-killed/<session_id>', methods=['POST'])
def enemy_killed(session_id):
    """Handle enemy kill event"""
    if session_id not in active_sessions:
        return jsonify({'error': 'Invalid session'}), 404
    
    data = request.json
    enemy_type = data.get('enemyType')
    enemy_x = data.get('x', 0)
    enemy_y = data.get('y', 0)
    
    game = active_sessions[session_id]
    score_value = ScoreCalculator.calculate_enemy_score(enemy_type)
    game.record_kill(score_value)
    
    # Check for powerup drop
    powerup_drop = PowerupManager.generate_powerup(enemy_x, enemy_y)
    
    return jsonify({
        'success': True,
        'scoreAdded': score_value,
        'powerupDrop': powerup_drop,
        'gameState': game.to_dict()
    })

@game_bp.route('/boss-killed/<session_id>', methods=['POST'])
def boss_killed(session_id):
    """Handle boss kill event"""
    if session_id not in active_sessions:
        return jsonify({'error': 'Invalid session'}), 404
    
    game = active_sessions[session_id]
    score_value = ScoreCalculator.calculate_boss_score()
    game.record_kill(score_value)
    
    return jsonify({
        'success': True,
        'scoreAdded': score_value,
        'gameState': game.to_dict()
    })

@game_bp.route('/boss-phase/<session_id>', methods=['POST'])
def update_boss_phase(session_id):
    """Calculate boss phase based on health"""
    if session_id not in active_sessions:
        return jsonify({'error': 'Invalid session'}), 404
    
    data = request.json
    current_health = data.get('currentHealth')
    max_health = data.get('maxHealth')
    shoot_timer = data.get('shootTimer', 0)
    
    phase = BossManager.calculate_boss_phase(current_health, max_health)
    attack_pattern = BossManager.get_attack_pattern(phase, shoot_timer)
    
    return jsonify({
        'success': True,
        'phase': phase,
        'attackPattern': attack_pattern
    })

@game_bp.route('/shot-fired/<session_id>', methods=['POST'])
def shot_fired(session_id):
    """Record bullet fired"""
    if session_id not in active_sessions:
        return jsonify({'error': 'Invalid session'}), 404
    
    game = active_sessions[session_id]
    game.record_shot()
    
    return jsonify({
        'success': True,
        'gameState': game.to_dict()
    })

@game_bp.route('/powerup-collected/<session_id>', methods=['POST'])
def powerup_collected(session_id):
    """Handle powerup collection"""
    if session_id not in active_sessions:
        return jsonify({'error': 'Invalid session'}), 404
    
    data = request.json
    powerup_type = data.get('type')
    
    game = active_sessions[session_id]
    result = PowerupManager.apply_powerup_effect(game, powerup_type)
    
    return jsonify({
        'success': True,
        'effect': result,
        'gameState': game.to_dict()
    })

@game_bp.route('/player-hit/<session_id>', methods=['POST'])
def player_hit(session_id):
    """Handle player taking damage"""
    if session_id not in active_sessions:
        return jsonify({'error': 'Invalid session'}), 404
    
    game = active_sessions[session_id]
    is_game_over = game.take_damage()
    
    return jsonify({
        'success': True,
        'gameState': game.to_dict(),
        'gameOver': is_game_over
    })

@game_bp.route('/update-powerup/<session_id>', methods=['POST'])
def update_powerup(session_id):
    """Update powerup timer"""
    if session_id not in active_sessions:
        return jsonify({'error': 'Invalid session'}), 404
    
    game = active_sessions[session_id]
    game.update_powerup_timer()
    
    return jsonify({
        'success': True,
        'gameState': game.to_dict()
    })

@game_bp.route('/stats/<session_id>', methods=['GET'])
def get_stats(session_id):
    """Get final game statistics"""
    if session_id not in active_sessions:
        return jsonify({'error': 'Invalid session'}), 404
    
    game = active_sessions[session_id]
    stats = ScoreCalculator.calculate_final_stats(game)
    rating = ScoreCalculator.calculate_performance_rating(
        stats['accuracy'],
        stats['wave'],
        stats['enemiesKilled']
    )
    stats['rating'] = rating
    
    return jsonify({
        'success': True,
        'stats': stats
    })

@game_bp.route('/levels', methods=['GET'])
def get_levels():
    """Get all level configurations"""
    levels = LevelManager.get_all_levels()
    
    return jsonify({
        'success': True,
        'levels': levels
    })

@game_bp.route('/session/<session_id>', methods=['DELETE'])
def end_session(session_id):
    """End and cleanup game session"""
    if session_id in active_sessions:
        del active_sessions[session_id]
    
    return jsonify({
        'success': True,
        'message': 'Session ended'
    })