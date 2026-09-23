import os
import re

def update_file(filepath, pattern, replacement):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {filepath}")

games_js_path = r"C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\games.js"

games_js_replacement = """
  loadGamesFromStorage() {
    try {
      const stored = localStorage.getItem('MEDIEVAL_GAMES');
      if (stored) {
        const storedGames = JSON.parse(stored);
        if (storedGames && storedGames.length > 0) {
          this.games = storedGames;
        }
      }
    } catch (e) {
      console.warn("Could not load games", e);
    }
    
    if (window.FirestoreSync) {
      FirestoreSync.listen('MEDIEVAL_GAMES', (data) => {
        if (data) {
          this.games = data;
          this.renderGamesView();
        }
      });
    }
  }

  saveGamesToStorage() {
    try {
      localStorage.setItem('MEDIEVAL_GAMES', JSON.stringify(this.games));
      if (window.FirestoreSync) {
        FirestoreSync.save('MEDIEVAL_GAMES', this.games);
      }
    } catch (e) {
      console.warn("Could not save games", e);
    }
  }
"""

games_pattern = r"  loadGamesFromStorage\(\) \{.*?\n  \}\n\n  saveGamesToStorage\(\) \{.*?\n  \}"
update_file(games_js_path, games_pattern, games_js_replacement.strip("\n"))
