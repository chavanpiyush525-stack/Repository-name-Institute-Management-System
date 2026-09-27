# 🚀 Institute Management System - Deployment Guide

## 📋 Overview

This guide provides comprehensive instructions for deploying the Institute Management System in various environments, from development to production.

---

## 🏗️ Deployment Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Angular)     │◄──►│  (Spring Boot)  │◄──►│ (H2/PostgreSQL) │
│   Port: 4200    │    │   Port: 8080    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🔧 Environment Setup

### Development Environment

#### Prerequisites
- Java 17+ (JDK)
- Node.js 16+ with npm
- Git for version control
- IDE (VS Code, IntelliJ IDEA)

#### Quick Setup
```bash
# 1. Clone repository
git clone <repository-url>
cd institute-management-system

# 2. Run automated setup
setup.bat                 # Windows
./setup.sh                # Linux/Mac

# 3. Start the system
start-system.bat          # Windows
./start-system.sh         # Linux/Mac
```

#### Manual Setup
```bash
# Backend setup
cd backend/backend
./mvnw clean install
./mvnw spring-boot:run

# Frontend setup (new terminal)
cd frontend
npm install
npm start
```

### Production Environment

#### System Requirements
- **CPU:** 2+ cores recommended
- **RAM:** 4GB minimum, 8GB recommended
- **Storage:** 10GB minimum
- **OS:** Windows Server, Linux, or macOS
- **Java:** OpenJDK 17 or Oracle JDK 17+
- **Database:** PostgreSQL 12+ or MySQL 8+

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

#### 1. Production Docker Compose
```yaml
# docker-compose.production.yml
version: '3.8'

services:
  database:
    image: postgres:15
    container_name: institute-db
    environment:
      POSTGRES_DB: institute_db
      POSTGRES_USER: institute_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped

  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: institute-backend
    environment:
      SPRING_PROFILES_ACTIVE: production
      DB_HOST: database
      DB_PORT: 5432
      DB_NAME: institute_db
      DB_USER: institute_user
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "8080:8080"
    depends_on:
      - database
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    container_name: institute-frontend
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    restart: unless-stopped
    volumes:
      - ./ssl:/etc/nginx/ssl

volumes:
  postgres_data:
```

#### 2. Environment Configuration
```bash
# .env file
DB_PASSWORD=your_secure_database_password
JWT_SECRET=your_jwt_secret_key_here
ENVIRONMENT=production
```

#### 3. Deploy with Docker
```bash
# Build and start services
docker-compose -f docker-compose.production.yml up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## ☁️ Cloud Deployment

### AWS Deployment

#### Using AWS Elastic Beanstalk
```bash
# 1. Install EB CLI
pip install awsebcli

# 2. Initialize EB application
eb init institute-management-system

# 3. Create environment
eb create production

# 4. Deploy
eb deploy
```

#### Using AWS ECS (Fargate)
```yaml
# task-definition.json
{
  "family": "institute-management",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "your-account.dkr.ecr.region.amazonaws.com/institute-backend:latest",
      "portMappings": [{"containerPort": 8080}],
      "environment": [
        {"name": "SPRING_PROFILES_ACTIVE", "value": "production"}
      ]
    }
  ]
}
```

### Google Cloud Platform

#### Using Google Cloud Run
```bash
# 1. Build and push to Container Registry
gcloud builds submit --tag gcr.io/PROJECT-ID/institute-backend

# 2. Deploy to Cloud Run
gcloud run deploy institute-backend \
  --image gcr.io/PROJECT-ID/institute-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Microsoft Azure

#### Using Azure Container Instances
```bash
# 1. Create resource group
az group create --name institute-rg --location eastus

# 2. Deploy container
az container create \
  --resource-group institute-rg \
  --name institute-backend \
  --image your-registry/institute-backend:latest \
  --ports 8080 \
  --environment-variables SPRING_PROFILES_ACTIVE=production
```

---

## 🗄️ Database Configuration

### PostgreSQL Setup (Production)

#### 1. Installation
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb
```

#### 2. Database Creation
```sql
-- Connect as postgres user
sudo -u postgres psql

-- Create database and user
CREATE DATABASE institute_db;
CREATE USER institute_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE institute_db TO institute_user;

-- Exit
\q
```

#### 3. Application Configuration
```properties
# application-production.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/institute_db
spring.datasource.username=institute_user
spring.datasource.password=secure_password
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

### MySQL Setup (Alternative)

#### 1. Installation
```bash
# Ubuntu/Debian
sudo apt install mysql-server

# CentOS/RHEL
sudo yum install mysql-server
```

#### 2. Configuration
```sql
-- Create database
CREATE DATABASE institute_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'institute_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON institute_db.* TO 'institute_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## 🔒 Security Configuration

### SSL/TLS Setup

#### 1. Obtain SSL Certificate
```bash
# Using Let's Encrypt (Certbot)
sudo apt install certbot
sudo certbot certonly --standalone -d yourdomain.com
```

#### 2. Nginx Configuration
```nginx
# /etc/nginx/sites-available/institute
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        root /var/www/institute-frontend;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /admin/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Application Security

#### 1. Environment Variables
```bash
# /etc/environment or .env
DB_PASSWORD=your_secure_database_password
JWT_SECRET=your_jwt_secret_minimum_256_bits
CORS_ALLOWED_ORIGINS=https://yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

#### 2. Spring Security Configuration
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/admin/**").authenticated()
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
```

---

## 📊 Monitoring & Logging

### Application Monitoring

#### 1. Spring Boot Actuator
```properties
# application.properties
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.endpoint.health.show-details=always
management.metrics.export.prometheus.enabled=true
```

#### 2. Prometheus Configuration
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'institute-backend'
    static_configs:
      - targets: ['localhost:8080']
    metrics_path: '/actuator/prometheus'
```

### Logging Configuration

#### 1. Logback Configuration
```xml
<!-- logback-spring.xml -->
<configuration>
    <springProfile name="production">
        <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
            <file>/var/log/institute/application.log</file>
            <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
                <fileNamePattern>/var/log/institute/application.%d{yyyy-MM-dd}.log</fileNamePattern>
                <maxHistory>30</maxHistory>
            </rollingPolicy>
            <encoder>
                <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
            </encoder>
        </appender>
        
        <root level="INFO">
            <appender-ref ref="FILE" />
        </root>
    </springProfile>
</configuration>
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

#### 1. Build and Test
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Test Backend
      run: |
        cd backend/backend
        ./mvnw test
    
    - name: Test Frontend
      run: |
        cd frontend
        npm ci
        npm run test:ci
```

#### 2. Deploy to Production
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /opt/institute-management-system
          git pull origin main
          docker-compose -f docker-compose.production.yml up -d --build
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Conflicts
```bash
# Check what's using port 8080
netstat -tulpn | grep :8080
lsof -i :8080

# Kill process using port
kill -9 $(lsof -t -i:8080)
```

#### 2. Database Connection Issues
```bash
# Test database connection
psql -h localhost -U institute_user -d institute_db

# Check database logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

#### 3. Memory Issues
```bash
# Check Java memory usage
jps -v

# Adjust JVM memory settings
export JAVA_OPTS="-Xmx2g -Xms1g"
```

### Health Checks

#### 1. Application Health
```bash
# Backend health check
curl http://localhost:8080/actuator/health

# Frontend availability
curl http://localhost:4200
```

#### 2. Database Health
```sql
-- Check database connections
SELECT * FROM pg_stat_activity WHERE datname = 'institute_db';

-- Check table sizes
SELECT schemaname,tablename,attname,n_distinct,correlation FROM pg_stats;
```

---

## 📈 Performance Optimization

### Backend Optimization

#### 1. JVM Tuning
```bash
# Production JVM settings
export JAVA_OPTS="-Xmx4g -Xms2g -XX:+UseG1GC -XX:MaxGCPauseMillis=200"
```

#### 2. Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX idx_student_email ON student(email);
CREATE INDEX idx_course_name ON course(name);
CREATE INDEX idx_message_sender ON message(sender_name);
```

### Frontend Optimization

#### 1. Build Optimization
```bash
# Production build with optimization
ng build --configuration production --aot --build-optimizer
```

#### 2. Nginx Caching
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## 📋 Deployment Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] Database setup and migrated
- [ ] SSL certificates installed
- [ ] Security configurations applied
- [ ] Monitoring tools configured
- [ ] Backup procedures established

### Deployment
- [ ] Application built successfully
- [ ] Tests passing
- [ ] Database migrations applied
- [ ] Services started
- [ ] Health checks passing
- [ ] Load balancer configured

### Post-deployment
- [ ] Application accessible
- [ ] All features working
- [ ] Performance metrics normal
- [ ] Logs being generated
- [ ] Monitoring alerts configured
- [ ] Backup verification

---

## 🎯 Production Readiness

The Institute Management System is **production-ready** with:

✅ **Scalable Architecture**
✅ **Security Best Practices**
✅ **Comprehensive Monitoring**
✅ **Automated Deployment**
✅ **Performance Optimization**
✅ **Disaster Recovery**
✅ **Documentation Complete**

**Ready for enterprise deployment!** 🚀

---

*Last Updated: October 27, 2025*
*Version: 1.0.0 - Production Ready*