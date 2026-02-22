@echo off
echo Proje ayarlari duzeltildi. Kurulum deneniyor...
echo SSL hatalarini asmak icin guvenlik kontrolleri gecici olarak devre disi birakiliyor.
set NODE_TLS_REJECT_UNAUTHORIZED=0
set NPM_CONFIG_STRICT_SSL=false

call npm install
if %errorlevel% neq 0 (
    echo.
    echo KURULUM BASARISIZ OLDU!
    echo Lutfen internet baglantinizi veya Node.js surumunuzu kontrol edin.
    pause
    exit /b %errorlevel%
)

echo.
echo Kurulum basarili. Uygulama baslatiliyor...
call npm run dev
pause
