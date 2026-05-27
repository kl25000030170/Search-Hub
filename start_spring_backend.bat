@echo off
REM Start Spring Boot Backend
cd %~dp0\backend
echo Starting Spring Boot Backend on http://localhost:8080...
mvn spring-boot:run
