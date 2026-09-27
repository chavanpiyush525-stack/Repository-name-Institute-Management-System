# System Maintenance Guide

## Overview

This guide outlines the regular maintenance procedures for the Institute Management System to ensure optimal performance, security, and reliability.

## Maintenance Schedule

### Daily Tasks (Automated)
- System health monitoring
- Log rotation and cleanup
- Database backup
- Security monitoring
- Performance metrics collection

### Weekly Tasks
- Review system logs
- Check disk space and cleanup
- Update system packages
- Review security alerts
- Performance analysis

### Monthly Tasks
- SSL certificate renewal check
- Database optimization
- Security audit
- Backup verification
- Documentation updates

### Quarterly Tasks
- Full system backup
- Disaster recovery testing
- Performance optimization
- Security penetration testing
- Infrastructure review

## Daily Maintenance

### Automated Health Monitoring

Create monitoring script:
```bash
#!/bin/bash
# /opt/institute-system/scripts/daily-health-check.sh

LOG_FILE="/var/log/institute-system/health-check.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting daily health check" >> $LOG_FILE

# Check Docker services
echo "[$DATE] Checking Docker services..." >> $LOG_FILE
docker-compose -f /opt/institute-system/docker-compose.production.yml ps >> $LOG_FILE 2>&1

# Check service health endpoints
echo "[$DATE] Checking service health endpoints..." >> $LOG_FILE
curl -f http://localhost/health >> $LOG_FILE 2>&1
curl -f http://localhost:8080/actuator/health >> $LOG_FILE 2>&1

# Check disk space
echo "[$DATE] Checking disk space..." >> $LOG_FILE
df -h >> $LOG_FILE 2>&1

# Check memory usage
echo "[$DATE] Checking memory usage..." >> $LOG_FILE
free -h >> $LOG_FILE 2>&1

# Check database connectivity
echo "[$DATE] Checking database connectivity..." >> $LOG_FILE
docker-compose -f /opt/institute-system/docker-compose.production.yml exec -T database pg_isready -U $DATABASE_USERNAME >> $LOG_FILE 2>&1

# Alert if issues found
if [ $? -ne 0 ]; then
    echo "[$DATE] Health check failed - sending alert" >> $LOG_FILE
    echo "System health check failed at $DATE" | mail -s "System Alert" admin@yourdomain.com
fi

echo "[$DATE] Daily health check completed" >> $LOG_FILE
```

### Database Backup Script
```bash
#!/bin/bash
# /opt/institute-system/scripts/daily-backup.sh

BACKUP_DIR="/opt/backups/daily"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
echo "Starting database backup at $(date)"
docker-compose -f /opt/institute-system/docker-compose.production.yml exec -T database pg_dump -U $DATABASE_USERNAME $DATABASE_NAME | gzip > $BACKUP_DIR/database_$DATE.sql.gz

# Verify backup
if [ $? -eq 0 ]; then
    echo "Database backup completed successfully: database_$DATE.sql.gz"
else
    echo "Database backup failed" | mail -s "Backup Alert" admin@yourdomain.com
    exit 1
fi

# Clean old backups
find $BACKUP_DIR -name "database_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Log backup size
BACKUP_SIZE=$(du -h $BACKUP_DIR/database_$DATE.sql.gz | cut -f1)
echo "Backup size: $BACKUP_SIZE"
```

### Log Cleanup Script
```bash
#!/bin/bash
# /opt/institute-system/scripts/log-cleanup.sh

# Clean Docker logs
docker system prune -f --filter "until=24h"

# Clean application logs older than 30 days
find /var/log/institute-system -name "*.log" -mtime +30 -delete

# Rotate large log files
find /var/lib/docker/containers -name "*.log" -size +100M -exec truncate -s 50M {} \;

# Clean temporary files
find /tmp -name "institute-*" -mtime +1 -delete

echo "Log cleanup completed at $(date)"
```

## Weekly Maintenance

### System Update Script
```bash
#!/bin/bash
# /opt/institute-system/scripts/weekly-update.sh

LOG_FILE="/var/log/institute-system/weekly-update.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting weekly system update" >> $LOG_FILE

# Update system packages
echo "[$DATE] Updating system packages..." >> $LOG_FILE
apt update && apt upgrade -y >> $LOG_FILE 2>&1

# Update Docker images
echo "[$DATE] Updating Docker images..." >> $LOG_FILE
cd /opt/institute-system
docker-compose -f docker-compose.production.yml pull >> $LOG_FILE 2>&1

# Restart services with new images
echo "[$DATE] Restarting services..." >> $LOG_FILE
docker-compose -f docker-compose.production.yml up -d >> $LOG_FILE 2>&1

# Verify services are running
sleep 30
echo "[$DATE] Verifying services..." >> $LOG_FILE
docker-compose -f docker-compose.production.yml ps >> $LOG_FILE 2>&1

# Clean up unused Docker resources
echo "[$DATE] Cleaning up Docker resources..." >> $LOG_FILE
docker system prune -f >> $LOG_FILE 2>&1

echo "[$DATE] Weekly system update completed" >> $LOG_FILE
```

### Performance Analysis Script
```bash
#!/bin/bash
# /opt/institute-system/scripts/performance-analysis.sh

REPORT_FILE="/var/log/institute-system/performance-$(date +%Y%m%d).log"

echo "Performance Analysis Report - $(date)" > $REPORT_FILE
echo "========================================" >> $REPORT_FILE

# System resources
echo -e "\nSystem Resources:" >> $REPORT_FILE
echo "CPU Usage:" >> $REPORT_FILE
top -bn1 | grep "Cpu(s)" >> $REPORT_FILE

echo -e "\nMemory Usage:" >> $REPORT_FILE
free -h >> $REPORT_FILE

echo -e "\nDisk Usage:" >> $REPORT_FILE
df -h >> $REPORT_FILE

# Docker container stats
echo -e "\nDocker Container Stats:" >> $REPORT_FILE
docker stats --no-stream >> $REPORT_FILE

# Database performance
echo -e "\nDatabase Performance:" >> $REPORT_FILE
docker-compose -f /opt/institute-system/docker-compose.production.yml exec -T database psql -U $DATABASE_USERNAME $DATABASE_NAME -c "
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public' 
ORDER BY n_distinct DESC 
LIMIT 10;" >> $REPORT_FILE 2>&1

# Application response times
echo -e "\nApplication Response Times:" >> $REPORT_FILE
curl -w "Public Website: %{time_total}s\n" -o /dev/null -s http://localhost/
curl -w "API Health: %{time_total}s\n" -o /dev/null -s http://localhost:8080/actuator/health

# Send report if performance issues detected
if grep -q "high\|slow\|error" $REPORT_FILE; then
    mail -s "Performance Alert" admin@yourdomain.com < $REPORT_FILE
fi
```

## Monthly Maintenance

### SSL Certificate Management
```bash
#!/bin/bash
# /opt/institute-system/scripts/ssl-maintenance.sh

LOG_FILE="/var/log/institute-system/ssl-maintenance.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting SSL certificate maintenance" >> $LOG_FILE

# Check certificate expiration
CERT_FILE="/opt/institute-system/ssl/cert.pem"
if [ -f "$CERT_FILE" ]; then
    EXPIRY_DATE=$(openssl x509 -enddate -noout -in $CERT_FILE | cut -d= -f2)
    EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)
    CURRENT_EPOCH=$(date +%s)
    DAYS_UNTIL_EXPIRY=$(( ($EXPIRY_EPOCH - $CURRENT_EPOCH) / 86400 ))
    
    echo "[$DATE] Certificate expires in $DAYS_UNTIL_EXPIRY days" >> $LOG_FILE
    
    # Alert if certificate expires within 30 days
    if [ $DAYS_UNTIL_EXPIRY -lt 30 ]; then
        echo "SSL certificate expires in $DAYS_UNTIL_EXPIRY days" | mail -s "SSL Certificate Alert" admin@yourdomain.com
    fi
    
    # Auto-renew if using Let's Encrypt and expires within 7 days
    if [ $DAYS_UNTIL_EXPIRY -lt 7 ]; then
        echo "[$DATE] Auto-renewing SSL certificate" >> $LOG_FILE
        certbot renew --quiet >> $LOG_FILE 2>&1
        
        if [ $? -eq 0 ]; then
            # Copy new certificates
            cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /opt/institute-system/ssl/cert.pem
            cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /opt/institute-system/ssl/key.pem
            
            # Restart nginx
            docker-compose -f /opt/institute-system/docker-compose.production.yml restart nginx
            
            echo "[$DATE] SSL certificate renewed successfully" >> $LOG_FILE
        else
            echo "SSL certificate renewal failed" | mail -s "SSL Renewal Alert" admin@yourdomain.com
        fi
    fi
else
    echo "[$DATE] SSL certificate file not found" >> $LOG_FILE
fi
```

### Database Optimization
```bash
#!/bin/bash
# /opt/institute-system/scripts/database-optimization.sh

LOG_FILE="/var/log/institute-system/db-optimization.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting database optimization" >> $LOG_FILE

# Database vacuum and analyze
echo "[$DATE] Running VACUUM ANALYZE..." >> $LOG_FILE
docker-compose -f /opt/institute-system/docker-compose.production.yml exec -T database psql -U $DATABASE_USERNAME $DATABASE_NAME -c "VACUUM ANALYZE;" >> $LOG_FILE 2>&1

# Reindex database
echo "[$DATE] Reindexing database..." >> $LOG_FILE
docker-compose -f /opt/institute-system/docker-compose.production.yml exec -T database psql -U $DATABASE_USERNAME $DATABASE_NAME -c "REINDEX DATABASE $DATABASE_NAME;" >> $LOG_FILE 2>&1

# Update table statistics
echo "[$DATE] Updating table statistics..." >> $LOG_FILE
docker-compose -f /opt/institute-system/docker-compose.production.yml exec -T database psql -U $DATABASE_USERNAME $DATABASE_NAME -c "ANALYZE;" >> $LOG_FILE 2>&1

# Check for unused indexes
echo "[$DATE] Checking for unused indexes..." >> $LOG_FILE
docker-compose -f /opt/institute-system/docker-compose.production.yml exec -T database psql -U $DATABASE_USERNAME $DATABASE_NAME -c "
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE idx_tup_read = 0 AND idx_tup_fetch = 0
ORDER BY schemaname, tablename;" >> $LOG_FILE 2>&1

echo "[$DATE] Database optimization completed" >> $LOG_FILE
```

### Security Audit Script
```bash
#!/bin/bash
# /opt/institute-system/scripts/security-audit.sh

AUDIT_FILE="/var/log/institute-system/security-audit-$(date +%Y%m%d).log"

echo "Security Audit Report - $(date)" > $AUDIT_FILE
echo "==============================" >> $AUDIT_FILE

# Check for failed login attempts
echo -e "\nFailed Login Attempts:" >> $AUDIT_FILE
grep "Failed password" /var/log/auth.log | tail -20 >> $AUDIT_FILE

# Check open ports
echo -e "\nOpen Ports:" >> $AUDIT_FILE
netstat -tulpn | grep LISTEN >> $AUDIT_FILE

# Check Docker security
echo -e "\nDocker Security:" >> $AUDIT_FILE
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
    -v /usr/local/bin/docker:/usr/local/bin/docker \
    -v /usr/bin/docker:/usr/bin/docker \
    aquasec/trivy image --severity HIGH,CRITICAL \
    $(docker images --format "{{.Repository}}:{{.Tag}}" | head -5) >> $AUDIT_FILE 2>&1

# Check file permissions
echo -e "\nCritical File Permissions:" >> $AUDIT_FILE
ls -la /opt/institute-system/.env.production >> $AUDIT_FILE
ls -la /opt/institute-system/ssl/ >> $AUDIT_FILE

# Check for security updates
echo -e "\nSecurity Updates Available:" >> $AUDIT_FILE
apt list --upgradable 2>/dev/null | grep -i security >> $AUDIT_FILE

# Send audit report
mail -s "Security Audit Report" admin@yourdomain.com < $AUDIT_FILE
```

## Quarterly Maintenance

### Full System Backup
```bash
#!/bin/bash
# /opt/institute-system/scripts/quarterly-backup.sh

BACKUP_DIR="/opt/backups/quarterly"
DATE=$(date +%Y%m%d)

mkdir -p $BACKUP_DIR

echo "Starting quarterly full system backup..."

# Database backup
docker-compose -f /opt/institute-system/docker-compose.production.yml exec -T database pg_dump -U $DATABASE_USERNAME $DATABASE_NAME | gzip > $BACKUP_DIR/database_full_$DATE.sql.gz

# Application files backup
tar -czf $BACKUP_DIR/application_$DATE.tar.gz \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='.git' \
    /opt/institute-system/

# System configuration backup
tar -czf $BACKUP_DIR/system_config_$DATE.tar.gz \
    /etc/nginx/ \
    /etc/ssl/ \
    /etc/systemd/system/institute* \
    /etc/cron.d/institute*

# Docker volumes backup
docker run --rm -v institute_postgres_data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/postgres_volume_$DATE.tar.gz -C /data .

# Create backup manifest
cat > $BACKUP_DIR/manifest_$DATE.txt << EOF
Quarterly Backup Manifest - $DATE
================================

Files included:
- database_full_$DATE.sql.gz (Database dump)
- application_$DATE.tar.gz (Application files)
- system_config_$DATE.tar.gz (System configuration)
- postgres_volume_$DATE.tar.gz (Database volume)

Backup created: $(date)
System version: $(cat /opt/institute-system/VERSION 2>/dev/null || echo "Unknown")
Docker version: $(docker --version)
EOF

echo "Quarterly backup completed. Files saved to $BACKUP_DIR"
```

### Disaster Recovery Test
```bash
#!/bin/bash
# /opt/institute-system/scripts/disaster-recovery-test.sh

TEST_DIR="/tmp/dr-test-$(date +%Y%m%d)"
LOG_FILE="/var/log/institute-system/dr-test.log"

echo "Starting disaster recovery test at $(date)" > $LOG_FILE

# Create test environment
mkdir -p $TEST_DIR
cd $TEST_DIR

# Test database restore
echo "Testing database restore..." >> $LOG_FILE
# This would involve creating a test database and restoring from backup
# Implementation depends on your specific backup strategy

# Test application deployment
echo "Testing application deployment..." >> $LOG_FILE
# This would involve deploying to a test environment
# Implementation depends on your deployment strategy

# Test SSL certificate installation
echo "Testing SSL certificate..." >> $LOG_FILE
openssl x509 -in /opt/institute-system/ssl/cert.pem -text -noout >> $LOG_FILE 2>&1

# Cleanup test environment
rm -rf $TEST_DIR

echo "Disaster recovery test completed at $(date)" >> $LOG_FILE

# Send test results
mail -s "Disaster Recovery Test Results" admin@yourdomain.com < $LOG_FILE
```

## Automation Setup

### Cron Job Configuration
```bash
# Add to root crontab: sudo crontab -e

# Daily tasks
0 2 * * * /opt/institute-system/scripts/daily-backup.sh
0 3 * * * /opt/institute-system/scripts/daily-health-check.sh
0 4 * * * /opt/institute-system/scripts/log-cleanup.sh

# Weekly tasks
0 1 * * 0 /opt/institute-system/scripts/weekly-update.sh
0 5 * * 0 /opt/institute-system/scripts/performance-analysis.sh

# Monthly tasks
0 2 1 * * /opt/institute-system/scripts/ssl-maintenance.sh
0 3 1 * * /opt/institute-system/scripts/database-optimization.sh
0 4 1 * * /opt/institute-system/scripts/security-audit.sh

# Quarterly tasks
0 1 1 1,4,7,10 * /opt/institute-system/scripts/quarterly-backup.sh
0 2 15 1,4,7,10 * /opt/institute-system/scripts/disaster-recovery-test.sh
```

### Systemd Service for Monitoring
```bash
# Create service file: /etc/systemd/system/institute-monitor.service
[Unit]
Description=Institute System Monitor
After=docker.service

[Service]
Type=simple
ExecStart=/opt/institute-system/scripts/continuous-monitor.sh
Restart=always
RestartSec=30
User=root

[Install]
WantedBy=multi-user.target
```

### Continuous Monitoring Script
```bash
#!/bin/bash
# /opt/institute-system/scripts/continuous-monitor.sh

while true; do
    # Check critical services every 5 minutes
    if ! docker-compose -f /opt/institute-system/docker-compose.production.yml ps | grep -q "Up"; then
        echo "Critical service down detected at $(date)" | mail -s "CRITICAL: Service Down" admin@yourdomain.com
    fi
    
    # Check disk space
    DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ $DISK_USAGE -gt 90 ]; then
        echo "Disk usage critical: ${DISK_USAGE}%" | mail -s "CRITICAL: Disk Space" admin@yourdomain.com
    fi
    
    # Check memory usage
    MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    if [ $MEMORY_USAGE -gt 90 ]; then
        echo "Memory usage critical: ${MEMORY_USAGE}%" | mail -s "CRITICAL: Memory Usage" admin@yourdomain.com
    fi
    
    sleep 300  # Wait 5 minutes
done
```

## Maintenance Checklist

### Daily Checklist
- [ ] Review automated health check results
- [ ] Verify backup completion
- [ ] Check system alerts
- [ ] Monitor resource usage
- [ ] Review application logs for errors

### Weekly Checklist
- [ ] Review system update results
- [ ] Analyze performance reports
- [ ] Check security alerts
- [ ] Verify SSL certificate status
- [ ] Review user feedback and issues

### Monthly Checklist
- [ ] Complete database optimization
- [ ] Review security audit results
- [ ] Update documentation
- [ ] Test backup restoration
- [ ] Review and update monitoring thresholds

### Quarterly Checklist
- [ ] Complete full system backup
- [ ] Perform disaster recovery test
- [ ] Review and update security policies
- [ ] Conduct performance optimization
- [ ] Update maintenance procedures

## Emergency Contacts

- **System Administrator:** admin@yourdomain.com
- **Technical Support:** support@yourdomain.com
- **Emergency Hotline:** +1-XXX-XXX-XXXX
- **Hosting Provider:** provider-support@hosting.com

## Documentation Updates

This maintenance guide should be reviewed and updated:
- After any system changes
- Following security incidents
- Based on lessons learned from maintenance activities
- At least quarterly during regular reviews

Keep all maintenance scripts in version control and test them in a staging environment before deploying to production.