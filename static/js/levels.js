// Level Configuration
const LEVELS = {
    1: {
        name: 'ASTEROID FIELD',
        theme: {
            bgColor: '#0a0e27',
            accentColor: '#4169e1',
            particleColor: '#6495ed'
        },
        enemyDistribution: {
            BASIC: 0.50,
            FAST: 0.25,
            TANK: 0.15,
            SHOOTER: 0.10
        },
        bossColor: '#ff1493'
    },
    2: {
        name: 'NEBULA STORM',
        theme: {
            bgColor: '#1a0a2e',
            accentColor: '#ff6b35',
            particleColor: '#ff9966'
        },
        enemyDistribution: {
            BASIC: 0.30,
            FAST: 0.35,
            TANK: 0.20,
            SHOOTER: 0.15
        },
        bossColor: '#ff6b35'
    },
    3: {
        name: 'BLACK HOLE',
        theme: {
            bgColor: '#0f0520',
            accentColor: '#9d00ff',
            particleColor: '#cc66ff'
        },
        enemyDistribution: {
            BASIC: 0.20,
            FAST: 0.30,
            TANK: 0.25,
            SHOOTER: 0.25
        },
        bossColor: '#9d00ff'
    }
};

function getEnemyTypeForLevel(level, wave) {
    const dist = LEVELS[level].enemyDistribution;
    const rand = Math.random();
    let cumulative = 0;
    
    for (const [type, probability] of Object.entries(dist)) {
        cumulative += probability;
        if (rand < cumulative) {
            return type;
        }
    }
    return 'BASIC';
}