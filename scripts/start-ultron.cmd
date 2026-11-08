@echo off
setlocal enabledelayedexpansion

echo ============================================
echo   🤖 Ultron / Jarvis Agent Launcher
echo "Smart Planning + Context Memory Manager"
echo ============================================

REM Check if .env exists, create from example if not
if not exist ".env" (
    echo Creating .env from example...
    copy .env.example .env > nul 2>&1
)

REM Load environment variables
set "OLLAMA_MODEL=qwen3.5:4b"
set "CLAUDE_CODE_DIR=~/.claude"
set "PERMISSION_MODE=auto"

REM Navigate to project root
cd /d "%~dp0.."

REM Install dependencies first time if needed
echo Installing dependencies...
call npm install > nul 2>&1

REM Start interactive session with brain (Claude Code)
echo.
echo Starting Ultron/Jarvis Brain Session...
echo Type your requests and observe the planning process.
echo Press Ctrl+C to stop the session.
echo.

REM Run TypeScript CLI
start "Ultron Brain Session" cmd /c "npx ts-node src\cli.ts"
timeout /t 5 > nul

REM Cleanup on exit
exit
