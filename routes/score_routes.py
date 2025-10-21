from flask import jsonify, request
from datetime import datetime
from routes import score_bp

# In-memory high scores storage
high_scores = []

@score_bp.route('/', methods=['GET'])
def get_scores():
    """Get top high scores"""
    limit = request.args.get('limit', 10, type=int)
    sorted_scores = sorted(high_scores, key=lambda x: x['score'], reverse=True)[:limit]
    
    return jsonify({
        'success': True,
        'scores': sorted_scores,
        'total': len(high_scores)
    })

@score_bp.route('/', methods=['POST'])
def save_score():
    """Save a new high score"""
    data = request.json
    
    score_entry = {
        'id': len(high_scores) + 1,
        'player': data.get('player', 'Anonymous')[:20],
        'score': data.get('score', 0),
        'level': data.get('level', 1),
        'levelName': data.get('levelName', 'Unknown'),
        'wave': data.get('wave', 0),
        'accuracy': data.get('accuracy', 0),
        'rating': data.get('rating', 'F'),
        'enemiesKilled': data.get('enemiesKilled', 0),
        'timestamp': datetime.now().isoformat()
    }
    
    high_scores.append(score_entry)
    
    return jsonify({
        'success': True,
        'entry': score_entry,
        'rank': calculate_rank(score_entry['score'])
    })

@score_bp.route('/level/<int:level>', methods=['GET'])
def get_scores_by_level(level):
    """Get high scores for a specific level"""
    level_scores = [s for s in high_scores if s['level'] == level]
    sorted_scores = sorted(level_scores, key=lambda x: x['score'], reverse=True)[:10]
    
    return jsonify({
        'success': True,
        'level': level,
        'scores': sorted_scores
    })

@score_bp.route('/player/<player_name>', methods=['GET'])
def get_player_scores(player_name):
    """Get scores for a specific player"""
    player_scores = [s for s in high_scores if s['player'].lower() == player_name.lower()]
    sorted_scores = sorted(player_scores, key=lambda x: x['score'], reverse=True)
    
    return jsonify({
        'success': True,
        'player': player_name,
        'scores': sorted_scores,
        'bestScore': sorted_scores[0] if sorted_scores else None
    })

def calculate_rank(score):
    """Calculate rank of a score"""
    sorted_scores = sorted(high_scores, key=lambda x: x['score'], reverse=True)
    for i, s in enumerate(sorted_scores):
        if s['score'] == score:
            return i + 1
    return len(high_scores)