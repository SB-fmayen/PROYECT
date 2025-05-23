@echo off
echo 🟢 Iniciando backend...
start cmd /k "cd /d C:\Users\jerka\Desktop\mi proyecto 3.0\backend && npm run dev"

timeout /t 2 >nul

echo 🟢 Iniciando frontend...
start cmd /k "cd /d C:\Users\jerka\Desktop\mi proyecto 3.0\frontend && ng serve"
