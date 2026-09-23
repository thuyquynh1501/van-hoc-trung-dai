import re
path = r'C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\index.html'
with open(path, 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('class="btn btn-outline" onclick="app.renderView(\'slide-builder\')"', 'class="btn btn-outline teacher-only" onclick="app.renderView(\'slide-builder\')"')

with open(path, 'w', encoding='utf-8') as f:
    f.write(html)
