@echo off
REM ULTRON Release Script - Versioning automation for Windows

setlocal enabledelayedexpansion

echo ===========================================
echo   🚀 ULTRON Release Automation
echo "Smart Planning + Context Memory Manager"
echo ===========================================

cd /d "%~dp0.."

REM Check if version argument provided
if "%~1"=="" (
    echo.
    echo Usage: create-release.bat <version>
    echo Example: create-release.bat 1.0.0
    pause
    exit /b 1
)

set VERSION=%~1

echo Creating version !VERSION!...
cd "D:\Users\garci\Desktop\Ollama Claude Code Project XCore" || (
    echo.
    echo Error: Failed to change directory. Check path permissions.
    pause
    exit /b 1
)

REM Update package.json version
npm version !VERSION! --no-git-tag-version

REM Get current date
for /f "tokens=2 delims==" %%a in ('wmic os get installdate') do set DATE=%%a

echo Creating commit with version !VERSION!...

REM Create commit message
set COMMIT_MSG=v!VERSION!: Release ULTRON !VERSION!

if "!VERSION!"==*"beta" (
    set COMMIT_MSG=!COMMIT_MSG! - Beta release (feature development)
)

git commit -m "!COMMIT_MSG!"

echo.
echo ===========================================
echo   ✅ Version !VERSION! released successfully!
echo ===========================================
echo.
echo Next steps:
echo 1. Review the commit message above
echo 2. Push to GitHub: git push origin main
echo 3. Create release on GitHub
pause
