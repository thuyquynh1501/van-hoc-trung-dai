# Script để đẩy trang web lên GitHub và bật GitHub Pages
$git = "C:\Program Files\Git\cmd\git.exe"
$gh = "C:\Program Files\GitHub CLI\gh.exe"

$env:PATH = "C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;" + $env:PATH

Write-Host "Initializing Git Repository..."
& $git init
& $git config user.name "VanHoc"
& $git config user.email "teacher@vanhoc.edu.vn"
& $git add .
& $git commit -m "Initial commit for Van Hoc Trung Dai teaching platform"

Write-Host "Creating Public GitHub Repository and Pushing..."
& $gh repo create van-hoc-trung-dai --public --source=. --remote=origin --push

Write-Host "Enabling GitHub Pages..."
& $gh api -X POST repos/thuyquynh1501/van-hoc-trung-dai/pages -f source='{"branch":"master","path":"/"}'
