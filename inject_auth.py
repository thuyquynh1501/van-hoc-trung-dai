import os
import re

css_path = r"C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\css\styles.css"
with open(css_path, "a", encoding="utf-8") as f:
    f.write("""
/* Teacher Mode Auth Classes */
.teacher-only, .teacher-only-flex, .teacher-only-block {
    display: none !important;
}
html.teacher-mode .teacher-only {
    display: inline-flex !important;
}
html.teacher-mode .teacher-only-flex {
    display: flex !important;
}
html.teacher-mode .teacher-only-block {
    display: block !important;
}
""")
print("CSS updated")

html_path = r"C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\index.html"
with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

# Inject script in head
head_script = """  <script>
    window.isTeacher = localStorage.getItem('IS_TEACHER') === 'true';
    if (window.isTeacher) document.documentElement.classList.add('teacher-mode');
    
    function toggleTeacherMode() {
      if (window.isTeacher) {
        localStorage.removeItem('IS_TEACHER');
        alert("Đã thoát chế độ Giáo viên. Hiện đang ở góc nhìn Học sinh.");
        location.reload();
      } else {
        const pass = prompt("Nhập mật khẩu Giáo viên (Mặc định: giaovien123):");
        if (pass === "giaovien123") {
          localStorage.setItem('IS_TEACHER', 'true');
          alert("Xác thực thành công! Đã mở khóa các tính năng quản lý.");
          location.reload();
        } else if (pass !== null) {
          alert("Sai mật khẩu!");
        }
      }
    }
  </script>
  <!-- FontAwesome Icons -->"""
html = html.replace("<!-- FontAwesome Icons -->", head_script)

# Add teacher-only-flex to Slide Builder nav
html = html.replace('<a class="nav-item" data-view="slide-builder">', '<a class="nav-item teacher-only-flex" data-view="slide-builder">')

# Add Auth Button in Sidebar footer
auth_btn = """
        <button class="theme-toggle-btn" style="margin-top: 10px; border-color: var(--primary); color: var(--primary);" onclick="toggleTeacherMode()">
          <i class="fa-solid fa-user-shield"></i>
          <span id="auth-label"></span>
        </button>
        <script>document.getElementById('auth-label').innerText = window.isTeacher ? 'Đăng xuất Giáo viên' : 'Đăng nhập Giáo viên';</script>
      </div>
"""
html = html.replace("</div>\n    </aside>", auth_btn + "    </aside>")

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html)
print("HTML updated")

def add_teacher_only_class(js_path):
    with open(js_path, "r", encoding="utf-8") as f:
        js = f.read()
    
    # Hide all delete buttons
    js = re.sub(r'(<button[^>]+onclick="[^"]*\bdelete[A-Za-z0-9_]+\([^"]*")[^>]*>', 
                lambda m: m.group(0).replace('class="btn', 'class="btn teacher-only').replace("class='btn", "class='btn teacher-only") if "teacher-only" not in m.group(0) else m.group(0), 
                js)
    
    # Hide all Add modals / create buttons
    js = re.sub(r'(<button[^>]+onclick="[^"]*\bopenAdd[A-Za-z0-9_]+\([^"]*")[^>]*>', 
                lambda m: m.group(0).replace('class="btn', 'class="btn teacher-only').replace("class='btn", "class='btn teacher-only") if "teacher-only" not in m.group(0) else m.group(0), 
                js)
                
    # Hide specific specific buttons
    js = js.replace('onclick="app.openNewSlideBuilder()"', 'class="btn btn-outline teacher-only" onclick="app.openNewSlideBuilder()"')
    js = js.replace('onclick="app.editSlideDeck(', 'class="btn btn-outline teacher-only" onclick="app.editSlideDeck(')
    js = js.replace('onclick="docManager.attachFileToMethod(', 'class="btn btn-outline teacher-only" onclick="docManager.attachFileToMethod(')

    with open(js_path, "w", encoding="utf-8") as f:
        f.write(js)
    print(f"JS updated: {js_path}")

add_teacher_only_class(r"C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\app.js")
add_teacher_only_class(r"C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\documents.js")
add_teacher_only_class(r"C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\games.js")

# Now inject JS security checks into the beginning of functions
def inject_security_check(js_path, func_names):
    with open(js_path, "r", encoding="utf-8") as f:
        js = f.read()
    
    for func in func_names:
        pattern = rf"({func}\(.*?\)\s*{{)"
        replacement = r"\1\n    if (!window.isTeacher) { alert('Chỉ giáo viên mới có quyền thao tác!'); return; }"
        js = re.sub(pattern, replacement, js)
        
    with open(js_path, "w", encoding="utf-8") as f:
        f.write(js)
    print(f"Security injected: {js_path}")

app_funcs = ['saveCustomAuthor', 'deleteCustomAuthor', 'saveCustomPeriod', 'deleteCustomPeriod', 'saveNewWritingPrompt', 'deleteWritingPrompt', 'saveSlideDeck', 'deleteSlideDeck']
inject_security_check(r"C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\app.js", app_funcs)

doc_funcs = ['saveNewMethod', 'deleteMethod', 'attachFileToMethod']
inject_security_check(r"C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\documents.js", doc_funcs)

game_funcs = ['saveNewGame', 'deleteGame']
inject_security_check(r"C:\Users\balabalabala\.gemini\antigravity\scratch\van-hoc-trung-dai\js\games.js", game_funcs)

