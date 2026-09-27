# Deployment Troubleshooting Guide

## Overview

This guide provides solutions to common issues encountered during deployment of the Institute Management System. It covers problems with Docker, services, networking, and application-specific issues.

## Quick Diagnosis

### System Health Check
```bash
# Check Docker status
docker --version
docker-compose --version
systemctl status docker

# Check available resources
df -h
free -h
docker system df

# Check running containers
docker ps -a
docker-compose -f docker-compose.production.yml ps
```

### Service Status Check
```bash
# Check all services
docker-compose -f docker-compose.production.yml ps

# Check specific service logs
docker-compose -f docker-compose.production.yml logs service-name

# Check service health
docker-compose -f docker-compose.production.yml exec service-name curl -f http://localhost/health
```

## Common Issues and Solutions

### 1. Docker and Container Issues

#### Issue: Docker service not running
```bash
# Symptoms
docker: Cannot connect to the Docker daemon

# Solution
sudo systemctl start docker
sudo systemctl enable docker

# Verify
sudo systemctl status docker
```

#### Issue: Permission denied accessing Docker
```bash
# Symptoms
permission denied while trying to connect to the Docker daemon socket

# Solution
sudo usermod -aG docker $USER
# Logout and login again, or:
newgrp docker

# Verify
docker ps
```

#### Issue: Container fails to start
```bash
# Diagnosis
docker-compose -f docker-compose.production.yml logs service-name

# Common solutions
# 1. Check environment variables
docker-compose -f docker-compose.production.yml config

# 2. Check port conflicts
netstat -tulpn | grep :port-number

# 3. Remove and recreate container
docker-compose -f docker-compose.production.yml rm -f service-name
docker-compose -f docker-compose.production.yml up -d service-name
```

#### Issue: Out of disk space
```bash
# Diagnosis
df -h
docker system df

# Solution
# Clean up Docker resources
docker system prune -a -f
docker volume prune -f

# Remove unused images
docker image prune -a -f

# Clean up logs
sudo truncate -s 0 /var/lib/docker/containers/*/*-json.log
```

### 2. Database Issues

#### Issue: Database connection failed
```bash
# Symptoms
Connection refused to database:5432

# Diagnosis
docker-compose -f docker-compose.production.yml logs database
docker-compose -f docker-compose.production.yml exec database pg_isready -U $DATABASE_USERNAME

# Solutions
# 1. Check database is running
docker-compose -f docker-compose.production.yml ps database

# 2. Check environment variables
echo $DATABASE_URL
echo $DATABASE_USERNAME
echo $DATABASE_PASSWORD

# 3. Restart database service
docker-compose -f docker-compose.production.yml restart database

# 4. Check database logs for errors
docker-compose -f docker-compose.production.yml logs database | tail -50
```

#### Issue: Database initialization failed
```bash
# Symptoms
Database schema not created, migration errors

# Solution
# 1. Stop all services
docker-compose -f docker-compose.production.yml down

# 2. Remove database volume (WARNING: This deletes all data)
docker volume rm $(docker volume ls -q | grep postgres_data)

# 3. Restart services
docker-compose -f docker-compose.production.yml up -d

# 4. Check initialization logs
docker-compose -f docker-compose.production.yml logs database
```

#### Issue: Database performance issues
```bash
# Diagnosis
docker-compose -f docker-compose.production.yml exec database psql -U $DATABASE_USERNAME $DATABASE_NAME -c "SELECT * FROM pg_stat_activity;"

# Solutions
# 1. Optimize database
docker-compose -f docker-compose.production.yml exec database psql -U $DATABASE_USERNAME $DATABASE_NAME -c "VACUUM ANALYZE;"

# 2. Check for long-running queries
docker-compose -f docker-compose.production.yml exec database psql -U $DATABASE_USERNAME $DATABASE_NAME -c "SELECT query, state, query_start FROM pg_stat_activity WHERE state = 'active';"

# 3. Restart database if needed
docker-compose -f docker-compose.production.yml restart database
```

### 3. Network and Connectivity Issues

#### Issue: Services cannot communicate
```bash
# Symptoms
Connection refused between services

# Diagnosis
# Check network configuration
docker network ls
docker-compose -f docker-compose.production.yml config

# Test connectivity between services
docker-compose -f docker-compose.production.yml exec public-website ping backend
docker-compose -f docker-compose.production.yml exec backend ping database

# Solutions
# 1. Restart all services
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d

# 2. Check service dependencies
docker-compose -f docker-compose.production.yml ps

# 3. Verify network configuration
docker network inspect $(docker network ls -q | head -1)
```

#### Issue: External connectivity problems
```bash
# Symptoms
Cannot access website from outside

# Diagnosis
# Check port binding
docker-compose -f docker-compose.production.yml ps
netstat -tulpn | grep :80
netstat -tulpn | grep :443

# Check firewall
sudo ufw status
iptables -L

# Solutions
# 1. Check port mapping in docker-compose.yml
# 2. Open firewall ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 3. Check if services are binding to correct interfaces
docker-compose -f docker-compose.production.yml logs nginx
```

### 4. SSL Certificate Issues

#### Issue: SSL certificate not working
```bash
# Symptoms
SSL certificate errors in browser

# Diagnosis
# Check certificate files
ls -la ssl/
openssl x509 -in ssl/cert.pem -text -noout

# Test SSL connection
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Solutions
# 1. Verify certificate files exist and are readable
chmod 644 ssl/cert.pem
chmod 600 ssl/key.pem

# 2. Check certificate validity
openssl x509 -in ssl/cert.pem -noout -dates

# 3. Restart nginx service
docker-compose -f docker-compose.production.yml restart nginx
```

#### Issue: Let's Encrypt certificate renewal failed
```bash
# Diagnosis
sudo certbot certificates

# Solution
# 1. Stop nginx temporarily
docker-compose -f docker-compose.production.yml stop nginx

# 2. Renew certificates
sudo certbot renew --standalone

# 3. Copy new certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/*

# 4. Restart nginx
docker-compose -f docker-compose.production.yml start nginx
```

### 5. Application-Specific Issues

#### Issue: Backend API not responding
```bash
# Symptoms
502 Bad Gateway, API endpoints not accessible

# Diagnosis
docker-compose -f docker-compose.production.yml logs backend
curl -I http://localhost:8080/actuator/health

# Solutions
# 1. Check backend service status
docker-compose -f docker-compose.production.yml ps backend

# 2. Check application logs
docker-compose -f docker-compose.production.yml logs backend | tail -100

# 3. Restart backend service
docker-compose -f docker-compose.production.yml restart backend

# 4. Check Java heap memory
docker-compose -f docker-compose.production.yml exec backend java -XX:+PrintFlagsFinal -version | grep HeapSize
```

#### Issue: Frontend not loading
```bash
# Symptoms
White screen, JavaScript errors

# Diagnosis
# Check nginx logs
docker-compose -f docker-compose.production.yml logs public-website

# Check browser console for errors
# Check network tab for failed requests

# Solutions
# 1. Verify build completed successfully
docker-compose -f docker-compose.production.yml logs public-website | grep "build"

# 2. Check nginx configuration
docker-compose -f docker-compose.production.yml exec public-website nginx -t

# 3. Restart frontend service
docker-compose -f docker-compose.production.yml restart public-website

# 4. Clear browser cache and service worker
```

#### Issue: Environment variables not loaded
```bash
# Symptoms
Application using default/wrong configuration

# Diagnosis
# Check environment file
cat .env.production

# Check if variables are loaded in container
docker-compose -f docker-compose.production.yml exec backend env | grep DATABASE
docker-compose -f docker-compose.production.yml exec public-website env | grep API_URL

# Solutions
# 1. Verify environment file syntax
# 2. Restart services to reload environment
docker-compose -f docker-compose.production.yml down
source .env.production
docker-compose -f docker-compose.production.yml up -d

# 3. Check docker-compose.yml environment section
```

### 6. Performance Issues

#### Issue: Slow application response
```bash
# Diagnosis
# Check resource usage
docker stats

# Check database performance
docker-compose -f docker-compose.production.yml exec database psql -U $DATABASE_USERNAME $DATABASE_NAME -c "SELECT * FROM pg_stat_activity;"

# Check application logs for slow queries
docker-compose -f docker-compose.production.yml logs backend | grep -i "slow\|timeout"

# Solutions
# 1. Optimize database
docker-compose -f docker-compose.production.yml exec database psql -U $DATABASE_USERNAME $DATABASE_NAME -c "VACUUM ANALYZE;"

# 2. Restart services
docker-compose -f docker-compose.production.yml restart

# 3. Check for memory leaks
docker stats --no-stream

# 4. Scale services if needed (add more replicas)
```

#### Issue: High memory usage
```bash
# Diagnosis
free -h
docker stats --no-stream

# Solutions
# 1. Restart memory-intensive services
docker-compose -f docker-compose.production.yml restart backend

# 2. Adjust JVM heap size for backend
# Edit docker-compose.yml and add:
# environment:
#   - JAVA_OPTS=-Xmx1g -Xms512m

# 3. Clean up Docker resources
docker system prune -f
```

## Emergency Recovery Procedures

### Complete System Recovery
```bash
# 1. Stop all services
docker-compose -f docker-compose.production.yml down

# 2. Backup current state (if possible)
docker-compose -f docker-compose.production.yml exec database pg_dump -U $DATABASE_USERNAME $DATABASE_NAME > emergency_backup.sql

# 3. Clean up Docker system
docker system prune -a -f
docker volume prune -f

# 4. Restore from backup
# Copy backup files to server
# Restore database if needed

# 5. Restart services
docker-compose -f docker-compose.production.yml up -d

# 6. Verify all services are running
docker-compose -f docker-compose.production.yml ps
```

### Database Recovery
```bash
# 1. Stop application services
docker-compose -f docker-compose.production.yml stop backend public-website admin-dashboard

# 2. Create database backup (if possible)
docker-compose -f docker-compose.production.yml exec database pg_dump -U $DATABASE_USERNAME $DATABASE_NAME > current_backup.sql

# 3. Restore from known good backup
docker-compose -f docker-compose.production.yml exec -T database psql -U $DATABASE_USERNAME $DATABASE_NAME < good_backup.sql

# 4. Restart application services
docker-compose -f docker-compose.production.yml start backend public-website admin-dashboard
```

## Monitoring and Prevention

### Set up Monitoring
```bash
# 1. Create monitoring script
cat > /opt/institute-system/monitor.sh << 'EOF'
#!/bin/bash
# Check service health
docker-compose -f docker-compose.production.yml ps | grep -v "Up" && echo "Service down detected" | mail -s "Service Alert" admin@yourdomain.com

# Check disk space
df -h | awk '$5 > 80 {print $0}' | mail -s "Disk Space Alert" admin@yourdomain.com

# Check memory usage
free | awk 'NR==2{printf "Memory Usage: %s/%sMB (%.2f%%)\n", $3,$2,$3*100/$2 }' | awk '$3 > 80 {print $0}' | mail -s "Memory Alert" admin@yourdomain.com
EOF

chmod +x /opt/institute-system/monitor.sh

# 2. Add to crontab
echo "*/5 * * * * /opt/institute-system/monitor.sh" | crontab -
```

### Log Rotation
```bash
# Set up log rotation
cat > /etc/logrotate.d/docker-containers << 'EOF'
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}
EOF
```

### Automated Backups
```bash
# Create backup script
cat > /opt/institute-system/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
docker-compose -f docker-compose.production.yml exec database pg_dump -U $DATABASE_USERNAME $DATABASE_NAME > $BACKUP_DIR/database_$DATE.sql

# Configuration backup
tar -czf $BACKUP_DIR/config_$DATE.tar.gz .env.production docker-compose.production.yml ssl/

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
EOF

chmod +x /opt/institute-system/backup.sh

# Add to crontab for daily backups
echo "0 2 * * * /opt/institute-system/backup.sh" | crontab -
```

## Getting Help

### Log Collection for Support
```bash
# Collect all relevant logs
mkdir -p /tmp/support-logs
docker-compose -f docker-compose.production.yml logs > /tmp/support-logs/docker-compose.log
docker system info > /tmp/support-logs/docker-info.txt
docker system df > /tmp/support-logs/docker-disk-usage.txt
free -h > /tmp/support-logs/memory-usage.txt
df -h > /tmp/support-logs/disk-usage.txt
cat .env.production | sed 's/PASSWORD=.*/PASSWORD=***REDACTED***/g' > /tmp/support-logs/environment.txt

# Create archive
tar -czf support-logs-$(date +%Y%m%d_%H%M%S).tar.gz -C /tmp support-logs/
```

### Contact Information
- **Technical Support:** support@yourdomain.com
- **Emergency Contact:** +1-XXX-XXX-XXXX
- **Documentation:** https://docs.yourdomain.com
- **Issue Tracker:** https://github.com/yourinstitute/issues

### Before Contacting Support
1. Check this troubleshooting guide
2. Review application logs
3. Try basic recovery steps
4. Collect relevant log files
5. Document steps that led to the issue
6. Note any recent changes made to the system

Remember to never share sensitive information like passwords or API keys when requesting support.