from flask import Flask, render_template, jsonify, request
from datetime import datetime

app = Flask(__name__)

# Store high scores in memory
high_scores = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/scores', methods=['GET'])
def get_scores():
    """Get top 10 high scores"""
    sorted_scores = sorted(high_scores, key=lambda x: x['score'], reverse=True)[:10]
    return jsonify(sorted_scores)

@app.route('/api/scores', methods=['POST'])
def save_score():
    """Save a new high score"""
    data = request.json
    score_entry = {
        'player': data.get('player', 'Anonymous'),
        'score': data.get('score', 0),
        'level': data.get('level', 1),
        'wave': data.get('wave', 0),
        'timestamp': datetime.now().isoformat()
    }
    high_scores.append(score_entry)
    return jsonify({'success': True, 'entry': score_entry})

if __name__ == '__main__':
    app.run(debug=True, port=5000)