# emotli-chat
Emotli Chat
A full-featured, real-time communication platform built with React.js, Node.js, Express, and MySQL, designed for global user connectivity and volunteer-based therapy sessions. Emotli Chat supports OTP Gmail verification, private messaging, groups, volunteer modes, and a profanity-blocking system.

🌍 Features
User signup with Gmail + OTP verification (auto email via Nodemailer).

Global user search and friend request system.

Real-time private and group chat with Socket.IO.

Volunteer Mode — users can switch to assist others in therapy chat.

Therapy Tab for session-based volunteer matching.

Profanity Filter middleware blocks offensive or banned words.

Modern React UI with instant chat updates.

Deployed on AWS EC2 (Amazon Linux 2) with Nginx + PM2.

🏗️ Architecture Overview
text
 ┌─────────────────────────┐
 │      React Frontend     │
 │   (Chat UI, Auth Flow)  │
 └────────┬────────────────┘
          │ HTTPS/WSS
 ┌────────▼────────────────┐
 │     Node.js Backend     │
 │ (Auth API + Socket.IO)  │
 └────────┬────────────────┘
          │
 ┌────────▼────────────────┐
 │      MySQL Database      │
 │   (Users, Chats, Groups) │
 └─────────────────────────┘
⚙️ Stack Overview
Layer	Technology	Purpose
Frontend	React + Redux	UI, chat, and real-time socket control
Backend	Node.js + Express	API management, socket handling
Database	MySQL	Structured data persistence
Realtime	Socket.IO	Messaging layer
Email	Nodemailer + Gmail SMTP	OTP delivery
Hosting	AWS EC2 (Amazon Linux 2)	Production environment
Reverse Proxy	Nginx	Routing and SSL
Process Manager	PM2	Keep server alive
Security	JWT + CORS	Authentication and access control
🧩 Folder Structure
Frontend
text
frontend/
 ├── public/
 ├── src/
 │   ├── components/
 │   ├── pages/
 │   ├── api/
 │   ├── context/
 │   ├── hooks/
 │   └── utils/
 ├── package.json
 └── .env
Backend
text
backend/
 ├── src/
 │   ├── config/
 │   ├── controllers/
 │   ├── middlewares/
 │   ├── models/
 │   ├── sockets/
 │   ├── routes/
 │   ├── services/
 │   ├── utils/
 │   ├── app.js
 │   └── server.js
 ├── package.json
 ├── .env
 └── README.md
🔑 Environment Variables
Create a .env file in both backend/ and frontend/ directories with the following:

Backend .env
text
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=emotli_chat
JWT_SECRET=emotli_secret_key
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=yourapppassword
CLIENT_URL=http://localhost:3000
Frontend .env
text
REACT_APP_API_URL=http://localhost:5000
🚀 Setup Instructions
1. Clone the Repository
text
git clone https://github.com/yourusername/emotli-chat.git
cd emotli-chat
2. Install Dependencies
Backend:

text
cd backend
npm install
Frontend:

text
cd frontend
npm install
3. Database Setup
Run MySQL and create the database:

text
CREATE DATABASE emotli_chat;
4. Start Local Servers
Backend:

text
npm run dev
Frontend:

text
npm start
Access the app at:
http://localhost:3000

🧠 Core Functional Modules
Module	Description
AuthController	Handles registration, OTP verification, login, and JWT sessions.
ChatController	Manages messages, requests, and conversations.
VolunteerController	Matches users to volunteers in therapy sessions.
ProfanityFilter	Filters bad words dynamically from user messages.
Socket Layer	Handles real-time events: connections, typing, status updates.
☁️ AWS EC2 Deployment Steps
Launch Amazon Linux 2 (t3.medium).

Install Node.js, NPM, Nginx, MySQL, and Git.

Configure reverse proxy in /etc/nginx/nginx.conf.

Add SSL using Certbot.

Use PM2 for process management:

text
pm2 start server.js --name emotli
pm2 startup
pm2 save
Build and serve React frontend using Nginx.

🧹 To-Do (Future Enhancements)
Add media uploads with AWS S3 integration.

Integrate AI-based mood detection for therapy chats.

Implement push notifications (Firebase or OneSignal).

Support real-time translation between chats.

📜 License
This project is licensed under MIT License.

# Emotli 🧠💬

**Emotli** is a private Gen-Z–focused emotional support app for safe peer therapy and expression. Built with privacy-first principles, self-hosted storage options, and human-first design.

---

## 🚧 Status
Under active development by [Operman.in](https://operman.in). Not open source. All rights reserved.

---

## 📦 Tech Stack (Planned)
- **Frontend:** React / React Native (TBD)
- **Backend:** Node.js (Express) – optional
- **Database:** Local storage (with optional user cloud backups)
- **Storage:** User-side (OneDrive, Gmail, etc.)

---

## ⚠️ License
This is a **private, closed-source** application. All rights reserved. Do not copy, reuse, or redistribute any part of this code without permission.
