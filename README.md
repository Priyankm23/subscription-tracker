# 📆 Subscription Tracker API

A full-featured **Node.js + Express** backend for tracking user subscriptions, sending automated **email renewal reminders** using **Upstash Workflows**, **Nodemailer**, and **Google OAuth** for authentication. Built with security using **Arcjet API protection**.

## 📚 Table of Contents

- [🚀 Features](#-features)
- [⚙️ Tech Stack](#️-tech-stack)
- [🔑 API Authentication](#-api-authentication)
- [📨 Email Reminder Logic](#-email-reminder-logic)
- [🔐 Arcjet Integration](#-arcjet-integration)
- [🛠️ Setup Instructions](#️-setup-instructions)
- [📡 Testing with Ngrok](#-testing-with-ngrok)
- [🧪 Testing with Postman](#-testing-with-postman)
- [🔀 API Endpoints](#-api-endpoints)
- [Roles & Permissions](#roles--permissions)
- [📬 Contribution](#-contribution)
- [📄 License](#-license)
- [🧠 Credits](#-credits)

---

## 🚀 Features

- 🔐 **Google OAuth login** via Passport.js
- 🧠 **Upstash Workflows** to automate email reminders before renewal dates
- 📬 **Nodemailer** integration to send reminder emails
- 🗓️ Create, update, cancel, and delete subscriptions
- 👮 **Arcjet API protection** to secure routes from abuse and malicious access
- 🧾 MongoDB + Mongoose for data storage

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

---

## 🔑 API Authentication

- All routes require a valid **JWT** cookie.
- Arcjet is used for **API rate-limiting and bot protection**.
- Admin-only routes are guarded by role-based checks.

---

## 📨 Email Reminder Logic

- Reminder emails are sent:
  - 7 days before renewal
  - 5 days before
  - 2 days before
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

```bash
git clone https://github.com/Priyankm23/subscription-tracker.git
cd subscription-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the root of the project and add the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
QSTASH_TOKEN=your_upstash_token
QSTASH_URL=https://qstash.upstash.io
SERVER_URL=http://localhost:5000
```

**Note:** For local development, you can use `npx @upstash/qstash-cli dev` and switch to production tokens later.

### 4. Run the App

```bash
npm run dev
```

---

## 📡 Testing with Ngrok

For webhook or Upstash integration, you can use Ngrok to expose your local server to the internet.

```bash
npx ngrok http 5000
```

Update `SERVER_URL` in your `.env` file with the generated public URL for Upstash to call your workflow.

---

## 🧪 Testing with Postman

- Use cookies to authenticate.
- Add the `jwt` cookie manually or use the login flow.
- Attach the `Authorization` header if needed for Arcjet headers.

---

## 🔀 API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| POST | /api/v1/auth/sign-up | Register a new user |
| POST | /api/v1/auth/sign-in | Login an existing user |
| GET | /auth/google | Initiate Google OAuth |
| GET | /auth/google/callback | Google OAuth callback |
| GET | /api/v1/users | Get all users (Admin only) |
| GET | /api/v1/users/:id | Get a single user (Admin only) |
| POST | /api/v1/subscriptions | Create a new subscription |
| GET | /api/v1/subscriptions | Get all subscriptions for the logged in user |
| GET | /api/v1/subscriptions/:id | Get a single subscription |
| PUT | /api/v1/subscriptions/:id | Update a subscription |
| DELETE | /api/v1/subscriptions/:id | Delete a subscription |
| POST | /api/v1/workflows/subscription/reminder| Trigger a reminder workflow |

---

### Roles & Permissions

- **User:** Can manage their own subscriptions.
- **Admin:** Can view all subscriptions, upcoming renewals, and system-level actions.

---

### 📬 Contribution

PRs and issues are welcome! Please open one for bugs, ideas, or improvements.

---

### 📄 License

MIT License

---

### 🧠 Credits

- [Upstash QStash](https://upstash.com/qstash)
- [Nodemailer](https://nodemailer.com)
- [Arcjet](https://arcjet.com)
- [Google Developers](https://developers.google.com)
