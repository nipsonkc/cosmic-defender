// API Communication Module
class API {
    static BASE_URL = '/api';
    
    static async request(endpoint, method = 'GET', data = null) {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(`${API.BASE_URL}${endpoint}`, options);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'API request failed');
            }
            
            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    // Game endpoints
    static async startGame(level) {
        return await this.request('/game/start', 'POST', { level });
    }
    
    static async getWave(sessionId) {
        return await this.request(`/game/wave/${sessionId}`);
    }
    
    static async nextWave(sessionId) {
        return await this.request(`/game/next-wave/${sessionId}`, 'POST');
    }
    
    static async enemyKilled(sessionId, enemyType, x, y) {
        return await this.request(`/game/enemy-killed/${sessionId}`, 'POST', {
            enemyType, x, y
        });
    }
    
    static async bossKilled(sessionId) {
        return await this.request(`/game/boss-killed/${sessionId}`, 'POST');
    }
    
    static async updateBossPhase(sessionId, currentHealth, maxHealth, shootTimer) {
        return await this.request(`/game/boss-phase/${sessionId}`, 'POST', {
            currentHealth, maxHealth, shootTimer
        });
    }
    
    static async shotFired(sessionId) {
        return await this.request(`/game/shot-fired/${sessionId}`, 'POST');
    }
    
    static async powerupCollected(sessionId, type) {
        return await this.request(`/game/powerup-collected/${sessionId}`, 'POST', { type });
    }
    
    static async playerHit(sessionId) {
        return await this.request(`/game/player-hit/${sessionId}`, 'POST');
    }
    
    static async updatePowerup(sessionId) {
        return await this.request(`/game/update-powerup/${sessionId}`, 'POST');
    }
    
    static async getStats(sessionId) {
        return await this.request(`/game/stats/${sessionId}`);
    }
    
    static async getLevels() {
        return await this.request('/game/levels');
    }
    
    static async endSession(sessionId) {
        return await this.request(`/game/session/${sessionId}`, 'DELETE');
    }
    
    // Score endpoints
    static async getScores(limit = 10) {
        return await this.request(`/scores?limit=${limit}`);
    }
    
    static async saveScore(scoreData) {
        return await this.request('/scores', 'POST', scoreData);
    }
    
    static async getScoresByLevel(level) {
        return await this.request(`/scores/level/${level}`);
    }
}