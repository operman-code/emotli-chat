# Emotli Chat - AWS EC2 Deployment Guide

## Prerequisites
- AWS EC2 instance (Amazon Linux 2, t3.medium recommended)
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt recommended)

## Step 1: Launch EC2 Instance
1. Launch Amazon Linux 2 (t3.medium)
2. Configure security groups:
   - HTTP (80)
   - HTTPS (443)
   - SSH (22)
   - Custom TCP (3000) - for development
   - Custom TCP (5000) - for backend API

## Step 2: Connect and Update System
```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
sudo yum update -y
```

## Step 3: Install Required Software

### Install Node.js (v18+)
```bash
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
node --version
npm --version
```

### Install MySQL
```bash
sudo yum install -y mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld
sudo mysql_secure_installation
```

### Install Nginx
```bash
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Install PM2
```bash
sudo npm install -g pm2
```

## Step 4: Database Setup
```bash
mysql -u root -p
```

```sql
CREATE DATABASE emotli_chat;
USE emotli_chat;
SOURCE /path/to/your/schema.sql;
```

## Step 5: Deploy Application

### Clone Repository
```bash
cd /home/ec2-user
git clone <your-repository-url> emotli-chat
cd emotli-chat
```

### Backend Setup
```bash
cd Backend
npm install
cp example.env .env
# Edit .env with your configuration
nano .env
```

Update `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=emotli_chat
JWT_SECRET=your_very_secure_jwt_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=https://yourdomain.com
```

### Frontend Setup
```bash
cd ../Frontend
npm install
cp example.env .env
# Edit .env
nano .env
```

Update `.env`:
```env
REACT_APP_API_URL=https://yourdomain.com/api
```

Build frontend:
```bash
npm run build
```

## Step 6: Configure Nginx

Create nginx configuration:
```bash
sudo nano /etc/nginx/conf.d/emotli.conf
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Frontend
    location / {
        root /home/ec2-user/emotli-chat/Frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Socket.IO
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Test nginx configuration:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Step 7: SSL Certificate (Let's Encrypt)

Install Certbot:
```bash
sudo yum install -y certbot python3-certbot-nginx
```

Get SSL certificate:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Step 8: Start Application with PM2

### Start Backend
```bash
cd /home/ec2-user/emotli-chat/Backend
pm2 start server.js --name emotli-backend
```

### Configure PM2
```bash
pm2 startup
pm2 save
```

## Step 9: Configure Gmail SMTP

1. Enable 2-Factor Authentication on your Gmail account
2. Generate App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Update `.env` with the app password

## Step 10: Firewall Configuration

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
```

## Step 11: Monitoring and Maintenance

### Check Application Status
```bash
pm2 status
pm2 logs emotli-backend
```

### Monitor Nginx
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Database Backup
```bash
mysqldump -u root -p emotli_chat > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Step 12: Environment Variables Summary

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=emotli_chat
JWT_SECRET=your_very_secure_jwt_secret_key_here
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=https://yourdomain.com
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://yourdomain.com/api
```

## Troubleshooting

### Common Issues:
1. **Database Connection**: Check MySQL service and credentials
2. **Email Not Sending**: Verify Gmail app password
3. **Socket.IO Issues**: Check nginx proxy configuration
4. **Build Errors**: Ensure all dependencies are installed

### Logs Location:
- Application: `pm2 logs`
- Nginx: `/var/log/nginx/`
- MySQL: `/var/log/mysqld.log`

### Restart Services:
```bash
pm2 restart emotli-backend
sudo systemctl restart nginx
sudo systemctl restart mysqld
```

## Security Considerations

1. **Firewall**: Only open necessary ports
2. **SSL**: Always use HTTPS in production
3. **Database**: Use strong passwords
4. **JWT Secret**: Use a long, random secret
5. **Regular Updates**: Keep system and dependencies updated
6. **Backups**: Regular database backups
7. **Monitoring**: Set up monitoring and alerts

## Performance Optimization

1. **PM2 Clustering**: Use `pm2 start server.js -i max`
2. **Nginx Caching**: Configure static file caching
3. **Database Indexing**: Ensure proper database indexes
4. **CDN**: Consider using CloudFront for static assets
5. **Load Balancing**: For high traffic, use multiple instances

## Scaling

For high traffic:
1. Use Application Load Balancer
2. Multiple EC2 instances
3. RDS for database
4. ElastiCache for Redis
5. S3 for file storage
6. CloudFront for CDN

This deployment guide ensures a secure, scalable, and production-ready Emotli Chat application on AWS EC2.