#!/bin/bash

# Database initialization script for Docker container

echo "Initializing Budget Tracker database..."

# Create data directory if it doesn't exist
mkdir -p /app/data

# Set proper permissions
chmod 755 /app/data

# Check if database file exists
if [ ! -f "/app/data/budget_tracker.db" ]; then
    echo "Database file not found. It will be created when the server starts."
    echo "Make sure the /app/data directory is properly mounted as a volume."
else
    echo "Database file found at /app/data/budget_tracker.db"
fi

# List directory contents for debugging
echo "Contents of /app/data directory:"
ls -la /app/data/

echo "Database initialization complete."
