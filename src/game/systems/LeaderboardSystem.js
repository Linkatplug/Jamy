/**
 * LeaderboardSystem - Manages high scores with player names
 */
export default class LeaderboardSystem {
  constructor() {
    this.storageKey = 'jamy_leaderboard';
    this.maxEntries = 10;
  }

  /**
   * Save a new score to the leaderboard
   * @param {string} playerName - Player name
   * @param {number} score - Score achieved
   * @param {string} missionName - Mission name
   * @returns {number} - Rank (1-10) or 0 if not in top 10
   */
  saveScore(playerName, score, missionName = 'Standard') {
    if (!playerName || score === undefined) return 0;
    
    const scores = this.getScores();
    
    // Add new entry
    scores.push({
      name: playerName.substring(0, 20), // Limit name length
      score: score,
      mission: missionName,
      date: new Date().toISOString(),
      timestamp: Date.now()
    });
    
    // Sort by score (descending)
    scores.sort((a, b) => b.score - a.score);
    
    // Keep only top entries
    const topScores = scores.slice(0, this.maxEntries);
    
    // Save to localStorage
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(topScores));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
    
    // Find rank of current score
    const rank = topScores.findIndex(entry => 
      entry.score === score && 
      entry.name === playerName && 
      entry.timestamp === topScores[topScores.length - 1].timestamp
    ) + 1;
    
    return rank;
  }

  /**
   * Get all scores from leaderboard
   * @returns {Array} - Array of score entries
   */
  getScores() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
    }
    return [];
  }

  /**
   * Check if score qualifies for leaderboard
   * @param {number} score - Score to check
   * @returns {boolean} - True if score makes top 10
   */
  qualifiesForLeaderboard(score) {
    const scores = this.getScores();
    if (scores.length < this.maxEntries) return true;
    return score > scores[scores.length - 1].score;
  }

  /**
   * Clear all scores
   */
  clearScores() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }

  /**
   * Get rank for a specific score
   * @param {number} score - Score to check
   * @returns {number} - Rank (1-10+)
   */
  getRank(score) {
    const scores = this.getScores();
    const sortedScores = [...scores].sort((a, b) => b.score - a.score);
    return sortedScores.findIndex(entry => entry.score <= score) + 1;
  }
}
