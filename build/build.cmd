rem @echo off

setlocal

set HZ_VERSION=4.11.3
set SRC_DIR=..\src
set DEST_DIR=%~dp0releases\hoverzoom_%HZ_VERSION%

java -jar tools\compiler.jar --js "%SRC_DIR%\js\affiliate.js" --js_output_file "%SRC_DIR%\js\affiliate.min.js"

del /s /q "%DEST_DIR%"
md "%DEST_DIR%"
xcopy /s /y "%SRC_DIR%\*.*" "%DEST_DIR%\*.*"
del "%DEST_DIR%\js\affiliate.js"
del "%DEST_DIR%\js\amstats.js"

tools\7za.exe a -r -tzip "releases\hoverzoom_%HZ_VERSION%.zip" "%DEST_DIR%\*.*"

%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe --pack-extension="%DEST_DIR%" --pack-extension-key="%~dp0hoverzoom.pem" 
rem --no-message-box

copy /y "%DEST_DIR%.crx" "releases\hoverzoom.crx"

endlocal