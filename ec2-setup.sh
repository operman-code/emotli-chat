#!/bin/bash

# Emotli Chat - EC2 Quick Setup Script
# Run this script on your Amazon Linux 2 EC2 instance

echo "🚀 Starting Emotli Chat deployment on EC2..."

# Update system
echo "📦 Updating system packages..."
sudo yum update -y

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install MySQL
echo "📦 Installing MySQL..."
sudo yum install -y mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Install Nginx
echo "📦 Installing Nginx..."
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install PM2
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Git
echo "📦 Installing Git..."
sudo yum install -y git

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/emotli-chat
sudo chown ec2-user:ec2-user /var/www/emotli-chat

echo "✅ Basic software installation complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Clone your repository: git clone https://github.com/yourusername/emotli-chat.git /var/www/emotli-chat"
echo "2. Set up MySQL database and user"
echo "3. Configure .env files with production values"
echo "4. Install dependencies: npm install (in both Backend and Frontend folders)"
echo "5. Build frontend: npm run build (in Frontend folder)"
echo "6. Configure Nginx"
echo "7. Start backend with PM2"
echo ""
echo "📖 See DEPLOYMENT_CHECKLIST.md for detailed instructions"