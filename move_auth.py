import re

path = r'C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\index.html'
with open(path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Remove from sidebar footer
auth_btn_sidebar = """
        <button class="theme-toggle-btn" style="margin-top: 10px; border-color: var(--primary); color: var(--primary);" onclick="toggleTeacherMode()">
          <i class="fa-solid fa-user-shield"></i>
          <span id="auth-label"></span>
        </button>
        <script>document.getElementById('auth-label').innerText = window.isTeacher ? 'Đăng xuất Giáo viên' : 'Đăng nhập Giáo viên';</script>"""
html = html.replace(auth_btn_sidebar, "")

# 2. Add to top header actions
auth_btn_header = """
          <button class="btn btn-outline" style="border-color: #8854D0; color: #8854D0; font-weight: bold; margin-left: 10px;" onclick="toggleTeacherMode()">
            <i class="fa-solid fa-user-shield"></i> <span id="auth-label">Đăng Nhập</span>
          </button>
          <script>document.getElementById('auth-label').innerText = window.isTeacher ? 'Thoát' : 'Giáo viên';</script>"""

header_target = """<button class="btn btn-primary" onclick="app.renderView('library')">
            <i class="fa-solid fa-house"></i> Trang Chủ
          </button>"""

if header_target in html:
    html = html.replace(header_target, header_target + auth_btn_header)

with open(path, 'w', encoding='utf-8') as f:
    f.write(html)
