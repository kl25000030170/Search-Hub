#!/bin/bash
# Start Spring Boot Backend
cd "$(dirname "$0")/backend"
echo "Starting Spring Boot Backend on http://localhost:8080..."
mvn spring-boot:run
