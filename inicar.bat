@echo off
echo 🟢 Iniciando backend...
start cmd /k "cd /d C:\Users\David Monterroso\Desktop\PROYECT\backend && npm install && npm run dev"

timeout /t 2 >nul

echo 🟢 Iniciando frontend...
start cmd /k "cd /d C:\Users\David Monterroso\Desktop\PROYECT\frontend && npm install && ng serve"
