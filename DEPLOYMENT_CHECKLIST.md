# 🚀 Emotli Chat - Complete Deployment Checklist

## ✅ Pre-Deployment Verification

### 1. **All Files Present** ✅
- ✅ Backend server files
- ✅ Frontend React files  
- ✅ Database schema
- ✅ Environment configurations
- ✅ Docker configurations
- ✅ Documentation files

### 2. **Dependencies Check** ✅
- ✅ Backend: Express, MySQL2, Socket.IO, JWT, Nodemailer, etc.
- ✅ Frontend: React, React Router, Socket.IO Client, Axios
- ✅ All packages.json files complete

### 3. **Database Schema** ✅
- ✅ Users table with username and phone fields
- ✅ All relationships and indexes
- ✅ Proper constraints and defaults

### 4. **API Endpoints** ✅
- ✅ Authentication routes
- ✅ Chat routes (private, group, therapy)
- ✅ User search and friend management
- ✅ Username availability checking

### 5. **Frontend Components** ✅
- ✅ All pages (Login, Register, Dashboard, Chat, etc.)
- ✅ Normal Chat tab with global search
- ✅ Context providers (Auth, Socket)
- ✅ API integration files

## 🔧 Environment Configuration

### Backend .env (Production)
```env
PORT=5000
DB_HOST=localhost
DB_USER=emotli_user
DB_PASSWORD=your_secure_password
DB_NAME=emotli_chat
JWT_SECRET=your_super_secure_jwt_secret_key_2024
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=https://yourdomain.com
```

### Frontend .env (Production)
```env
REACT_APP_API_URL=https://yourdomain.com/api
```

## 🚀 EC2 Deployment Steps

### Step 1: Launch EC2 Instance
```bash
# Launch Amazon Linux 2 (t3.medium)
# Security Groups: HTTP(80), HTTPS(443), SSH(22), Custom(3000), Custom(5000)
```

### Step 2: Connect and Update
```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
sudo yum update -y
```

### Step 3: Install Software
```bash
# Node.js 18+
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# MySQL
sudo yum install -y mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Nginx
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# PM2
sudo npm install -g pm2
```

### Step 4: Database Setup
```bash
# Secure MySQL
sudo mysql_secure_installation

# Create database and user
mysql -u root -p
CREATE DATABASE emotli_chat;
CREATE USER 'emotli_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON emotli_chat.* TO 'emotli_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema
mysql -u emotli_user -p emotli_chat < /path/to/schema.sql
```

### Step 5: Deploy Application
```bash
# Clone repository
git clone https://github.com/yourusername/emotli-chat.git
cd emotli-chat

# Backend setup
cd Backend
npm install
cp example.env .env
# Edit .env with production values
npm start

# Frontend setup (new terminal)
cd ../Frontend
npm install
cp example.env .env
# Edit .env with production values
npm run build
```

### Step 6: Nginx Configuration
```bash
sudo nano /etc/nginx/conf.d/emotli.conf
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Frontend
    location / {
        root /path/to/Frontend/build;
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

### Step 7: SSL Certificate
```bash
# Install Certbot
sudo yum install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Step 8: Start Services
```bash
# Restart Nginx
sudo systemctl restart nginx

# Start backend with PM2
cd /path/to/Backend
pm2 start server.js --name "emotli-backend"
pm2 save
pm2 startup

# Verify services
pm2 status
sudo systemctl status nginx
```

## 🔍 Post-Deployment Verification

### 1. **Test Frontend**
- ✅ Visit https://yourdomain.com
- ✅ Registration with username/phone
- ✅ Login functionality
- ✅ Normal Chat search
- ✅ All tabs working

### 2. **Test Backend API**
- ✅ https://yourdomain.com/api/auth/register
- ✅ https://yourdomain.com/api/auth/login
- ✅ https://yourdomain.com/api/chat/search
- ✅ Socket.IO connection

### 3. **Test Database**
- ✅ User registration creates records
- ✅ Search functionality works
- ✅ Real-time features working

## 🛠️ Maintenance Commands

### PM2 Management
```bash
pm2 status
pm2 logs emotli-backend
pm2 restart emotli-backend
pm2 stop emotli-backend
```

### Nginx Management
```bash
sudo systemctl status nginx
sudo systemctl restart nginx
sudo nginx -t
```

### Database Management
```bash
mysql -u emotli_user -p emotli_chat
# Check tables, users, etc.
```

## 🔒 Security Checklist

- ✅ SSL certificate installed
- ✅ Firewall configured
- ✅ Database user with limited privileges
- ✅ Strong JWT secret
- ✅ Gmail app password for emails
- ✅ Regular security updates

## 📊 Monitoring

### Logs
```bash
# Application logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx
```

### Performance
```bash
# Check system resources
htop
df -h
free -h

# Check database performance
mysql -u emotli_user -p emotli_chat
SHOW PROCESSLIST;
```

## 🎯 Success Criteria

- ✅ Application accessible via HTTPS
- ✅ User registration works with username/phone
- ✅ Normal Chat search functional
- ✅ Real-time messaging working
- ✅ All features accessible
- ✅ Mobile responsive
- ✅ SSL certificate valid
- ✅ Database queries optimized

## 🚨 Troubleshooting

### Common Issues
1. **Port conflicts**: Check if ports 80, 443, 5000 are free
2. **Database connection**: Verify MySQL service and credentials
3. **SSL issues**: Check certificate installation
4. **Socket.IO**: Verify proxy configuration
5. **CORS errors**: Check CLIENT_URL in .env

### Debug Commands
```bash
# Check processes
ps aux | grep node
ps aux | grep nginx

# Check ports
netstat -tlnp | grep :80
netstat -tlnp | grep :443
netstat -tlnp | grep :5000

# Check logs
pm2 logs --lines 100
sudo journalctl -u nginx --lines 50
```

Your Emotli Chat application is now ready for production deployment! 🎉