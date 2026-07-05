@echo off
REM Double-click file nay de tao ban production trong thu muc dist\
REM (Tuong duong: npm run bundle)

cd /d "%~dp0"
echo ============================================
echo   Dang build + gom ban production (dist\) ...
echo ============================================
echo.

call npm run bundle

echo.
if %ERRORLEVEL% NEQ 0 (
  echo [LOI] Build that bai. Xem thong bao ben tren.
) else (
  echo [XONG] Ban production da nam trong thu muc: dist\
  echo Copy thu muc dist\ len server IIS la chay duoc.
)
echo.
pause
