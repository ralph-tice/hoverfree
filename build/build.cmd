rem @echo off

setlocal

set HZ_VERSION=4.6.2
set SRC_DIR=..\src
set DEST_DIR=%~dp0releases\hoverzoom_%HZ_VERSION%

java -jar tools\compiler.jar --js "%SRC_DIR%\js\affiliate.js" --js_output_file "%SRC_DIR%\js\affiliate.min.js"

md "%DEST_DIR%"
xcopy /s /y "%SRC_DIR%\*.*" "%DEST_DIR%\*.*"
del "%DEST_DIR%\js\affiliate.js"

%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe --pack-extension="%DEST_DIR%" --pack-extension-key="%~dp0hoverzoom.pem" --no-message-box

copy /y "%DEST_DIR%.crx" "releases\hoverzoom.crx"

endlocal