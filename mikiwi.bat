@echo off
REM Get the directory of this batch file
set "PROJECT_DIR=%~dp0"

REM Check if the first argument is "start"
if /I "%1"=="start" (
    echo ========================================
    echo Starting MiKiwi Project
    echo ========================================
    cd /d "%PROJECT_DIR%"
    
    REM Show current branch
    echo.
    echo Current Git Branch:
    git branch --show-current
    echo.
    
    REM Clear Laravel caches
    echo Clearing Laravel caches...
    php artisan optimize:clear
    
    REM Remove old compiled assets
    echo.
    echo Removing old compiled assets...
    powershell -Command "Remove-Item -Recurse -Force public/build -ErrorAction SilentlyContinue"
    
    REM Clear and rebuild Vite assets
    echo.
    echo Rebuilding frontend assets...
    call npm run build
    
    echo.
    echo ========================================
    echo Starting servers...
    echo ========================================
    
    REM Generate timestamp for cache busting
    set timestamp=%date:~-4%%date:~3,2%%date:~0,2%%time:~0,2%%time:~3,2%%time:~6,2%
    set timestamp=%timestamp: =0%
    
    echo Opening browser at http://localhost:8000?v=%timestamp%
    echo.
    echo IMPORTANT: Press Ctrl+Shift+R in the browser to force reload!
    echo.
    
    REM Open browser with cache-busting parameter
    start "" "http://localhost:8000?v=%timestamp%"
    
    REM Start Laravel and Vite dev server
    npm run start
) else (
    echo Usage: mikiwi start
    echo.
    echo This will:
    echo  - Show current Git branch
    echo  - Clear all Laravel caches
    echo  - Remove old compiled assets
    echo  - Rebuild frontend assets
    echo  - Start Laravel server on port 8000
    echo  - Start Vite dev server
    echo  - Open browser with cache-busting
)
