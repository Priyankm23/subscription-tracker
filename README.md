# 📆 Subscription Tracker API

A full-featured **Node.js + Express** backend for tracking user subscriptions, sending automated **email renewal reminders** using **Upstash Workflows**, **Nodemailer**, and **Google OAuth** for authentication. Built with security using **Arcjet API protection**.

---

## 🚀 Features

- 🔐 **Google OAuth login** via Passport.js
- 🧠 **Upstash Workflows** to automate email reminders before renewal dates
- 📬 **Nodemailer** integration to send reminder emails
- 🗓️ Create, update, cancel, and delete subscriptions
- 👮 **Arcjet API protection** to secure routes from abuse and malicious access
- 🧾 MongoDB + Mongoose for data storage

---


---

## ⚙️ Tech Stack

### 🧰 Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" />
  <img src="https://img.shields.io/badge/Nodemailer-yellow?style=for-the-badge&logo=gmail&logoColor=white" />
  <img src="https://img.shields.io/badge/Upstash-00DC82?style=for-the-badge&logo=upstash&logoColor=white" />
  <img src="https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge&logo=passport&logoColor=black" />
  <img src="https://img.shields.io/badge/Google OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Arcjet-000000?style=for-the-badge&logo=shield&logoColor=white" />
  <img src="https://img.shields.io/badge/Day.js-FF2D20?style=for-the-badge&logo=javascript&logoColor=white" />
</p>


## 🔑 API Authentication

- All routes require valid **JWT** cookie.
- Arcjet is used for **API rate-limiting and bot protection**.
- Admin-only routes are guarded by role-based checks.

---

## 📨 Email Reminder Logic

- Reminder emails are sent:
  - 7 days before renewal
  - 3 days before
  - 1 day before
- Powered by **Upstash Workflow**
- Emails sent via **Nodemailer**
- Uses `sleepUntil()` and `ctx.run()` for workflow steps

---

## 🔐 Arcjet Integration

- All protected routes use Arcjet middleware
- DDoS prevention and token-based access management
- Easy to extend with Arcjet dashboards and metrics

---

## 🛠️ Setup Instructions

### 1. Clone the repo

git clone https://github.com/yourusername/subscription-tracker-api.git
cd subscription-tracker-api

### 2. Install dependencies
npm install

### 3. Setup environment variables
Create a .env.development and .env.production as needed:

PORT=5000
MONGO_URI=mongodb://localhost:27017/subtracker
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
QSTASH_TOKEN=your_upstash_token
QSTASH_URL=https://qstash.upstash.io
SERVER_URL=http://localhost:5000


Use npx @upstash/qstash-cli dev during local dev and switch to production tokens later.

### 4. Run the App

npm run dev


### 📡 Testing with Ngrok
For webhook or Upstash integration:

npx ngrok http 5000
Update SERVER_URL in .env with the generated public URL for Upstash to call your workflow.

### 🧪 Testing with Postman
Use cookies to authenticate

Add jwt cookie manually or use login flow

Attach Authorization if needed for Arcjet headers

Roles & Permissions
User: Can manage own subscriptions

Admin: Can view all subscriptions, upcoming renewals, and system-level actions

📬 Contribution
PRs and issues welcome! Please open one for bugs, ideas, or improvements.

📄 License
MIT License

🧠 Credits
Upstash QStash

Nodemailer

Arcjet

Google Developers




