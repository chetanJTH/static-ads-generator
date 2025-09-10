@echo off
echo ========================================
echo  Deployment Monitor
echo ========================================
echo.

:menu
echo Choose an option:
echo 1. Check service status
echo 2. View logs
echo 3. Test endpoints
echo 4. Restart services
echo 5. Stop services
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto status
if "%choice%"=="2" goto logs
if "%choice%"=="3" goto test
if "%choice%"=="4" goto restart
if "%choice%"=="5" goto stop
if "%choice%"=="6" goto exit
goto menu

:status
echo.
echo === Service Status ===
pm2 status
echo.
pause
goto menu

:logs
echo.
echo === Service Logs ===
pm2 logs --lines 50
echo.
pause
goto menu

:test
echo.
echo === Testing Endpoints ===
echo Testing frontend...
curl -s http://localhost:3000 > nul
if %errorlevel% equ 0 (
    echo ✓ Frontend is running
) else (
    echo ✗ Frontend is not responding
)

echo Testing backend...
curl -s http://localhost:8000/health > nul
if %errorlevel% equ 0 (
    echo ✓ Backend is running
) else (
    echo ✗ Backend is not responding
)

echo Testing backend health endpoint...
curl -s http://localhost:8000/health/detailed
echo.
pause
goto menu

:restart
echo.
echo === Restarting Services ===
pm2 restart all
echo Services restarted!
pause
goto menu

:stop
echo.
echo === Stopping Services ===
pm2 stop all
echo Services stopped!
pause
goto menu

:exit
echo.
echo Goodbye!
exit
