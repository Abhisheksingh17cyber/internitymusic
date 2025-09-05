#!/bin/bash
# Database backup script

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="musicstream"

echo "Starting backup at $(date)"

# Create backup directory
mkdir -p $BACKUP_DIR

# MongoDB backup
if command -v mongodump &> /dev/null; then
    echo "Creating MongoDB backup..."
    mongodump --db $DB_NAME --out $BACKUP_DIR/mongodb_$DATE
    tar -czf $BACKUP_DIR/mongodb_$DATE.tar.gz -C $BACKUP_DIR mongodb_$DATE
    rm -rf $BACKUP_DIR/mongodb_$DATE
    echo "MongoDB backup completed: mongodb_$DATE.tar.gz"
fi

# File system backup
echo "Creating uploads backup..."
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C ./backend uploads/
echo "Uploads backup completed: uploads_$DATE.tar.gz"

# Cleanup old backups (keep last 7 days)
find $BACKUP_DIR -name "*.tar.gz" -type f -mtime +7 -delete

echo "Backup process completed at $(date)"
