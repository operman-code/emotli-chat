#!/usr/bin/env node

// Emotli Chat - Deployment Verification Script
// Run this to check if everything is ready for deployment

import fs from 'fs';
import path from 'path';

console.log('🔍 Emotli Chat - Deployment Verification\n');

const checks = [];
let allPassed = true;

// Check Backend files
const backendFiles = [
  'Backend/server.js',
  'Backend/package.json',
  'Backend/.env',
  'Backend/src/app.js',
  'Backend/src/controllers/authController.js',
  'Backend/src/controllers/chatController.js',
  'Backend/src/controllers/groupController.js',
  'Backend/src/controllers/volunteerController.js',
  'Backend/src/middlewares/auth.js',
  'Backend/src/middlewares/profanityFilter.js',
  'Backend/src/routes/authRoutes.js',
  'Backend/src/routes/chatRoutes.js',
  'Backend/src/routes/groupRoutes.js',
  'Backend/src/routes/volunteerRoutes.js',
  'Backend/src/sockets/chatSocket.js',
  'Backend/database/schema.sql'
];

// Check Frontend files
const frontendFiles = [
  'Frontend/package.json',
  'Frontend/.env',
  'Frontend/src/App.js',
  'Frontend/src/index.js',
  'Frontend/src/context/AuthContext.js',
  'Frontend/src/context/SocketContext.js',
  'Frontend/src/pages/Login.js',
  'Frontend/src/pages/Register.js',
  'Frontend/src/pages/Dashboard.js',
  'Frontend/src/pages/Chat.js',
  'Frontend/src/pages/Groups.js',
  'Frontend/src/pages/Therapy.js',
  'Frontend/src/pages/Settings.js',
  'Frontend/src/pages/NormalChat.js',
  'Frontend/api/auth.js',
  'Frontend/api/chat.js',
  'Frontend/api/groups.js',
  'Frontend/api/therapy.js'
];

// Check CSS files
const cssFiles = [
  'Frontend/src/App.css',
  'Frontend/src/pages/Login.css',
  'Frontend/src/pages/Register.css',
  'Frontend/src/pages/Dashboard.css',
  'Frontend/src/pages/Chat.css',
  'Frontend/src/pages/Groups.css',
  'Frontend/src/pages/Therapy.css',
  'Frontend/src/pages/Settings.css',
  'Frontend/src/pages/NormalChat.css'
];

// Check documentation files
const docFiles = [
  'README.md',
  'DEPLOYMENT.md',
  'DEPLOYMENT_CHECKLIST.md',
  'FEATURES.md',
  'NEW_FEATURES.md'
];

function checkFile(filePath, category) {
  const exists = fs.existsSync(filePath);
  const status = exists ? '✅' : '❌';
  checks.push({ file: filePath, exists, category });
  if (!exists) allPassed = false;
  console.log(`${status} ${filePath}`);
  return exists;
}

console.log('📁 Checking Backend Files:');
backendFiles.forEach(file => checkFile(file, 'backend'));

console.log('\n📁 Checking Frontend Files:');
frontendFiles.forEach(file => checkFile(file, 'frontend'));

console.log('\n🎨 Checking CSS Files:');
cssFiles.forEach(file => checkFile(file, 'css'));

console.log('\n📚 Checking Documentation Files:');
docFiles.forEach(file => checkFile(file, 'docs'));

// Check package.json dependencies
console.log('\n📦 Checking Dependencies:');

try {
  const backendPkg = JSON.parse(fs.readFileSync('Backend/package.json', 'utf8'));
  const frontendPkg = JSON.parse(fs.readFileSync('Frontend/package.json', 'utf8'));
  
  const requiredBackendDeps = ['express', 'mysql2', 'jsonwebtoken', 'nodemailer', 'bcryptjs', 'socket.io', 'dotenv', 'cors', 'helmet', 'cookie-parser'];
  const requiredFrontendDeps = ['react', 'react-dom', 'react-scripts', 'react-router-dom', 'socket.io-client', 'axios'];
  
  console.log('Backend Dependencies:');
  requiredBackendDeps.forEach(dep => {
    const exists = backendPkg.dependencies && backendPkg.dependencies[dep];
    console.log(`${exists ? '✅' : '❌'} ${dep}`);
    if (!exists) allPassed = false;
  });
  
  console.log('\nFrontend Dependencies:');
  requiredFrontendDeps.forEach(dep => {
    const exists = frontendPkg.dependencies && frontendPkg.dependencies[dep];
    console.log(`${exists ? '✅' : '❌'} ${dep}`);
    if (!exists) allPassed = false;
  });
} catch (error) {
  console.log('❌ Error reading package.json files');
  allPassed = false;
}

// Check .env files
console.log('\n🔐 Checking Environment Files:');
const backendEnv = fs.readFileSync('Backend/.env', 'utf8');
const frontendEnv = fs.readFileSync('Frontend/.env', 'utf8');

const requiredEnvVars = {
  backend: ['PORT', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS', 'CLIENT_URL'],
  frontend: ['REACT_APP_API_URL']
};

console.log('Backend Environment Variables:');
requiredEnvVars.backend.forEach(envVar => {
  const exists = backendEnv.includes(envVar);
  console.log(`${exists ? '✅' : '❌'} ${envVar}`);
  if (!exists) allPassed = false;
});

console.log('\nFrontend Environment Variables:');
requiredEnvVars.frontend.forEach(envVar => {
  const exists = frontendEnv.includes(envVar);
  console.log(`${exists ? '✅' : '❌'} ${envVar}`);
  if (!exists) allPassed = false;
});

// Summary
console.log('\n' + '='.repeat(50));
if (allPassed) {
  console.log('🎉 ALL CHECKS PASSED! Your Emotli Chat app is ready for deployment!');
  console.log('\n📋 Next Steps:');
  console.log('1. Push all files to your GitHub repository');
  console.log('2. Launch your EC2 instance (Amazon Linux 2, t3.medium)');
  console.log('3. Run the ec2-setup.sh script on your EC2 instance');
  console.log('4. Follow the DEPLOYMENT_CHECKLIST.md for detailed setup');
  console.log('5. Update .env files with your production values');
  console.log('6. Configure your domain and SSL certificate');
} else {
  console.log('❌ Some checks failed. Please fix the issues above before deploying.');
}
console.log('='.repeat(50));