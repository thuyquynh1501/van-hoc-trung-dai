import os
import re

def update_file(filepath, pattern, replacement):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {filepath}")

# 1. Update app.js
app_js_path = r"C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\app.js"

app_js_replacement = """
  loadAllStorageData() {
    try {
      const storedWorks = localStorage.getItem('CUSTOM_MEDIEVAL_WORKS');
      if (storedWorks) {
        const customWorks = JSON.parse(storedWorks);
        customWorks.forEach(w => {
          if (!MEDIEVAL_DATA.works.find(existing => existing.id === w.id)) {
            MEDIEVAL_DATA.works.unshift(w);
          }
        });
      }

      const storedAuthors = localStorage.getItem('CUSTOM_MEDIEVAL_AUTHORS');
      if (storedAuthors) {
        const customAuthors = JSON.parse(storedAuthors);
        customAuthors.forEach(a => {
          if (!MEDIEVAL_DATA.authors.find(existing => existing.id === a.id)) {
            MEDIEVAL_DATA.authors.unshift(a);
          }
        });
      }

      const storedPeriods = localStorage.getItem('CUSTOM_MEDIEVAL_PERIODS');
      if (storedPeriods) {
        const customPeriods = JSON.parse(storedPeriods);
        customPeriods.forEach(p => {
          if (!MEDIEVAL_DATA.periods.find(existing => existing.id === p.id)) {
            MEDIEVAL_DATA.periods.push(p);
          }
        });
      }

      const storedWriting = localStorage.getItem('CUSTOM_MEDIEVAL_WRITING');
      if (storedWriting) {
        const customWriting = JSON.parse(storedWriting);
        customWriting.forEach(wp => {
          if (!MEDIEVAL_DATA.writingPromptsList.find(existing => existing.id === wp.id)) {
            MEDIEVAL_DATA.writingPromptsList.unshift(wp);
          }
        });
      }
    } catch (e) {
      console.warn("Could not load storage data", e);
    }
    
    // Firebase Real-time Listeners
    if (window.FirestoreSync) {
      FirestoreSync.listen('CUSTOM_MEDIEVAL_WORKS', (data) => {
        if (!data) return;
        MEDIEVAL_DATA.works = MEDIEVAL_DATA.works.filter(w => !w.id.startsWith('custom-work-'));
        MEDIEVAL_DATA.works.unshift(...data);
        if(this.currentView === 'library') this.renderWorksGrid();
      });

      FirestoreSync.listen('CUSTOM_MEDIEVAL_AUTHORS', (data) => {
        if (!data) return;
        MEDIEVAL_DATA.authors = MEDIEVAL_DATA.authors.filter(a => !a.id.startsWith('custom-author-'));
        MEDIEVAL_DATA.authors.unshift(...data);
        if(this.currentView === 'authors') this.renderView('authors');
      });

      FirestoreSync.listen('CUSTOM_MEDIEVAL_PERIODS', (data) => {
        if (!data) return;
        MEDIEVAL_DATA.periods = MEDIEVAL_DATA.periods.filter(p => !p.id.startsWith('custom-period-'));
        MEDIEVAL_DATA.periods.push(...data);
        if(this.currentView === 'periods') this.renderView('periods');
      });

      FirestoreSync.listen('CUSTOM_MEDIEVAL_WRITING', (data) => {
        if (!data) return;
        MEDIEVAL_DATA.writingPromptsList = MEDIEVAL_DATA.writingPromptsList.filter(wp => !wp.id.startsWith('custom-wp-'));
        MEDIEVAL_DATA.writingPromptsList.unshift(...data);
        if(this.currentView === 'writing') this.filterWriting(this.writingSearchQuery || '');
      });
    }
  }

  saveStorageData(key, dataFilter) {
    try {
      localStorage.setItem(key, JSON.stringify(dataFilter));
      if(window.FirestoreSync) {
        window.FirestoreSync.save(key, dataFilter);
      }
    } catch (e) {
      console.warn(`Could not save data for ${key}`, e);
    }
  }
"""
app_pattern = r"  loadAllStorageData\(\) \{.*?\n  \}\n\n  saveStorageData\(key, dataFilter\) \{.*?\n  \}"
update_file(app_js_path, app_pattern, app_js_replacement.strip("\n"))

# 2. Update documents.js
docs_js_path = r"C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\documents.js"
docs_js_replacement = """
  loadFromStorage() {
    try {
      const storedDocs = localStorage.getItem('MEDIEVAL_DOCUMENTS');
      if (storedDocs) this.documents = JSON.parse(storedDocs);

      const storedMethods = localStorage.getItem('MEDIEVAL_TEACHING_METHODS');
      if (storedMethods) this.teachingMethods = JSON.parse(storedMethods);
    } catch (e) {
      console.warn("Could not load docs from LocalStorage", e);
    }
    
    if (window.FirestoreSync) {
      FirestoreSync.listen('MEDIEVAL_DOCUMENTS', (data) => {
        if (data) {
          this.documents = data;
          this.renderDocumentsView();
        }
      });
      FirestoreSync.listen('MEDIEVAL_TEACHING_METHODS', (data) => {
        if (data) {
          this.teachingMethods = data;
          this.renderDocumentsView();
        }
      });
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('MEDIEVAL_DOCUMENTS', JSON.stringify(this.documents));
      localStorage.setItem('MEDIEVAL_TEACHING_METHODS', JSON.stringify(this.teachingMethods));
      
      if (window.FirestoreSync) {
        FirestoreSync.save('MEDIEVAL_DOCUMENTS', this.documents);
        FirestoreSync.save('MEDIEVAL_TEACHING_METHODS', this.teachingMethods);
      }
    } catch (e) {
      console.warn("Could not save docs to LocalStorage", e);
    }
  }
"""
docs_pattern = r"  loadFromStorage\(\) \{.*?\n  \}\n\n  saveToStorage\(\) \{.*?\n  \}"
update_file(docs_js_path, docs_pattern, docs_js_replacement.strip("\n"))

# 3. Update mindmap.js
mindmap_js_path = r"C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\mindmap.js"
mindmap_js_replacement = """
  loadCustomComparativePairsFromStorage() {
    try {
      const stored = localStorage.getItem('MEDIEVAL_COMPARATIVE_PAIRS');
      if (stored) {
        const customPairs = JSON.parse(stored);
        customPairs.forEach(p => {
          if (!MEDIEVAL_DATA.comparativePairs.find(existing => existing.id === p.id)) {
            MEDIEVAL_DATA.comparativePairs.push(p);
          }
        });
      }
    } catch (e) {
      console.warn("Could not load comparative pairs from LocalStorage", e);
    }
    
    if (window.FirestoreSync) {
      FirestoreSync.listen('MEDIEVAL_COMPARATIVE_PAIRS', (data) => {
        if (!data) return;
        MEDIEVAL_DATA.comparativePairs = MEDIEVAL_DATA.comparativePairs.filter(p => !p.id.startsWith('custom-comp-'));
        MEDIEVAL_DATA.comparativePairs.push(...data);
        this.renderComparativeList();
      });
    }
  }

  saveCustomComparativePairsToStorage() {
    try {
      const customPairs = MEDIEVAL_DATA.comparativePairs.filter(p => p.id.startsWith('custom-comp-'));
      localStorage.setItem('MEDIEVAL_COMPARATIVE_PAIRS', JSON.stringify(customPairs));
      if (window.FirestoreSync) {
        FirestoreSync.save('MEDIEVAL_COMPARATIVE_PAIRS', customPairs);
      }
    } catch (e) {
      console.warn("Could not save custom pairs", e);
    }
  }
"""
mindmap_pattern = r"  loadCustomComparativePairsFromStorage\(\) \{.*?\n  \}\n\n  saveCustomComparativePairsToStorage\(\) \{.*?\n  \}"
update_file(mindmap_js_path, mindmap_pattern, mindmap_js_replacement.strip("\n"))

