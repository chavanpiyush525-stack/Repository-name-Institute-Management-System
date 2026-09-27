# Institute Management System - Deployment Guide

## Overview

This guide covers the deployment of the complete Institute Management System, including the public website, admin dashboard, and backend API services.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Public Web    │    │   Admin Panel   │    │   Backend API   │
│   (Angular)     │    │   (Angular)     │    │   (Spring Boot) │
│   Port: 80/443  │    │   Port: 4200    │    │   Port: 8080    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Database      │
                    │   (PostgreSQL)  │
                    │   Port: 5432    │
                    └─────────────────┘
```

## Prerequisites

### System Requirements
- Docker 20.10+ and Docker Compose 2.0+
- Minimum 4GB RAM, 20GB disk space
- Ubuntu 20.04+ or CentOS 8+ (recommended)
- SSL certificates for HTTPS (production)

### Domain Setup
- Main domain: `yourdomain.com` (public website)
- Admin subdomain: `admin.yourdomain.com` (admin dashboard)
- API subdomain: `api.yourdomain.com` (backend API)
- Staging: `staging.yourdomain.com`

## Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd institute-management-system
```

### 2. Environment Configuration
```bash
# Copy environment templates
cp .env.production.example .env.production
cp .env.staging.example .env.staging

# Edit configuration files
nano .env.production
nano .env.staging
```

### 3. SSL Certificates (Production)
```bash
# Create SSL directory
mkdir -p ssl

# Copy your SSL certificates
cp your-cert.pem ssl/cert.pem
cp your-key.pem ssl/key.pem

# Or use Let's Encrypt
certbot certonly --standalone -d yourdomain.com -d admin.yourdomain.com -d api.yourdomain.com
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem
```

### 4. Deploy to Production
```bash
# Load environment variables
source .env.production

# Build and start services
docker-compose -f docker-compose.production.yml up -d

# Check service status
docker-compose -f docker-compose.production.yml ps
```

### 5. Deploy to Staging
```bash
# Load environment variables
source .env.staging

# Build and start services
docker-compose -f docker-compose.staging.yml up -d
```

## Detailed Deployment Steps

### Production Deployment

#### Step 1: Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login to apply group changes
```

#### Step 2: Application Setup
```bash
# Create application directory
sudo mkdir -p /opt/institute-system
cd /opt/institute-system

# Clone repository
git clone <repository-url> .

# Set permissions
sudo chown -R $USER:$USER /opt/institute-system
```

#### Step 3: Configuration
```bash
# Configure production environment
cp .env.production.example .env.production

# Edit configuration (replace with actual values)
nano .env.production
```

**Required Configuration:**
- Database credentials
- JWT secret (minimum 256 bits)
- SSL certificate paths
- SMTP settings for email
- Domain names
- Monitoring service keys

#### Step 4: SSL Setup
```bash
# Option 1: Use existing certificates
mkdir -p ssl
cp /path/to/your/cert.pem ssl/cert.pem
cp /path/to/your/key.pem ssl/key.pem

# Option 2: Generate Let's Encrypt certificates
sudo apt install certbot
sudo certbot certonly --standalone \
  -d yourdomain.com \
  -d admin.yourdomain.com \
  -d api.yourdomain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/*
```

#### Step 5: Database Initialization
```bash
# Start database service first
docker-compose -f docker-compose.production.yml up -d database

# Wait for database to be ready
docker-compose -f docker-compose.production.yml logs -f database

# Run database migrations (if needed)
docker-compose -f docker-compose.production.yml exec backend java -jar app.jar --spring.profiles.active=production --spring.jpa.hibernate.ddl-auto=update
```

#### Step 6: Application Deployment
```bash
# Build and start all services
docker-compose -f docker-compose.production.yml up -d

# Monitor startup
docker-compose -f docker-compose.production.yml logs -f

# Check service health
docker-compose -f docker-compose.production.yml ps
```

#### Step 7: Verification
```bash
# Test public website
curl -I https://yourdomain.com

# Test admin dashboard
curl -I https://admin.yourdomain.com

# Test API health
curl https://api.yourdomain.com/actuator/health

# Check SSL certificates
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

### Staging Deployment

#### Step 1: Staging Environment Setup
```bash
# Configure staging environment
cp .env.staging.example .env.staging
nano .env.staging

# Deploy to staging
source .env.staging
docker-compose -f docker-compose.staging.yml up -d
```

#### Step 2: Staging Verification
```bash
# Test staging services
curl -I https://staging.yourdomain.com
curl https://staging-api.yourdomain.com/actuator/health
```

## Service Management

### Starting Services
```bash
# Production
docker-compose -f docker-compose.production.yml up -d

# Staging
docker-compose -f docker-compose.staging.yml up -d

# Development
docker-compose up -d
```

### Stopping Services
```bash
# Production
docker-compose -f docker-compose.production.yml down

# Staging
docker-compose -f docker-compose.staging.yml down
```

### Updating Services
```bash
# Pull latest images
docker-compose -f docker-compose.production.yml pull

# Rebuild and restart
docker-compose -f docker-compose.production.yml up -d --build

# Or update specific service
docker-compose -f docker-compose.production.yml up -d --build public-website
```

### Viewing Logs
```bash
# All services
docker-compose -f docker-compose.production.yml logs -f

# Specific service
docker-compose -f docker-compose.production.yml logs -f public-website

# Last 100 lines
docker-compose -f docker-compose.production.yml logs --tail=100 backend
```

## Monitoring and Maintenance

### Health Checks
```bash
# Check all services
docker-compose -f docker-compose.production.yml ps

# Check specific service health
docker-compose -f docker-compose.production.yml exec public-website curl -f http://localhost/health
docker-compose -f docker-compose.production.yml exec backend curl -f http://localhost:8080/actuator/health
```

### Database Backup
```bash
# Create backup
docker-compose -f docker-compose.production.yml exec database pg_dump -U $DATABASE_USERNAME $DATABASE_NAME > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker-compose -f docker-compose.production.yml exec -T database psql -U $DATABASE_USERNAME $DATABASE_NAME < backup_file.sql
```

### Log Management
```bash
# Rotate logs
docker system prune -f
docker volume prune -f

# Archive old logs
tar -czf logs_$(date +%Y%m%d).tar.gz /var/lib/docker/volumes/*_logs/
```

### SSL Certificate Renewal
```bash
# Renew Let's Encrypt certificates
sudo certbot renew --dry-run
sudo certbot renew

# Update certificates in containers
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem

# Restart nginx
docker-compose -f docker-compose.production.yml restart nginx
```

## Performance Optimization

### Database Optimization
```bash
# Database performance tuning
docker-compose -f docker-compose.production.yml exec database psql -U $DATABASE_USERNAME $DATABASE_NAME -c "VACUUM ANALYZE;"

# Index optimization
docker-compose -f docker-compose.production.yml exec database psql -U $DATABASE_USERNAME $DATABASE_NAME -c "REINDEX DATABASE $DATABASE_NAME;"
```

### Cache Management
```bash
# Clear Redis cache
docker-compose -f docker-compose.production.yml exec redis redis-cli FLUSHALL

# Check cache usage
docker-compose -f docker-compose.production.yml exec redis redis-cli INFO memory
```

### Resource Monitoring
```bash
# Monitor resource usage
docker stats

# Check disk usage
df -h
docker system df

# Monitor specific service
docker-compose -f docker-compose.production.yml exec public-website top
```

## Troubleshooting

### Common Issues

#### Service Won't Start
```bash
# Check logs
docker-compose -f docker-compose.production.yml logs service-name

# Check configuration
docker-compose -f docker-compose.production.yml config

# Restart service
docker-compose -f docker-compose.production.yml restart service-name
```

#### Database Connection Issues
```bash
# Check database status
docker-compose -f docker-compose.production.yml exec database pg_isready -U $DATABASE_USERNAME

# Test connection from backend
docker-compose -f docker-compose.production.yml exec backend nc -zv database 5432

# Check database logs
docker-compose -f docker-compose.production.yml logs database
```

#### SSL Certificate Issues
```bash
# Check certificate validity
openssl x509 -in ssl/cert.pem -text -noout

# Test SSL connection
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Check nginx configuration
docker-compose -f docker-compose.production.yml exec nginx nginx -t
```

#### Performance Issues
```bash
# Check resource usage
docker stats

# Monitor database performance
docker-compose -f docker-compose.production.yml exec database psql -U $DATABASE_USERNAME $DATABASE_NAME -c "SELECT * FROM pg_stat_activity;"

# Check application logs for errors
docker-compose -f docker-compose.production.yml logs backend | grep ERROR
```

### Emergency Procedures

#### Service Recovery
```bash
# Stop all services
docker-compose -f docker-compose.production.yml down

# Remove problematic containers
docker-compose -f docker-compose.production.yml rm -f service-name

# Rebuild and restart
docker-compose -f docker-compose.production.yml up -d --build
```

#### Database Recovery
```bash
# Stop application services
docker-compose -f docker-compose.production.yml stop backend admin-dashboard public-website

# Restore database from backup
docker-compose -f docker-compose.production.yml exec -T database psql -U $DATABASE_USERNAME $DATABASE_NAME < latest_backup.sql

# Restart services
docker-compose -f docker-compose.production.yml start backend admin-dashboard public-website
```

## Security Considerations

### Firewall Configuration
```bash
# Allow only necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### Regular Security Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose -f docker-compose.production.yml pull
docker-compose -f docker-compose.production.yml up -d
```

### Backup Strategy
```bash
# Daily database backup
0 2 * * * /opt/institute-system/scripts/backup-database.sh

# Weekly full system backup
0 3 * * 0 /opt/institute-system/scripts/backup-system.sh
```

## Support and Maintenance

### Regular Maintenance Tasks
- Daily: Check service status and logs
- Weekly: Update system packages and Docker images
- Monthly: Review and rotate logs, update SSL certificates
- Quarterly: Performance review and optimization

### Contact Information
- System Administrator: admin@yourdomain.com
- Technical Support: support@yourdomain.com
- Emergency Contact: +1-XXX-XXX-XXXX

### Documentation Updates
This documentation should be updated whenever:
- New services are added
- Configuration changes are made
- New deployment procedures are implemented
- Security updates are applied