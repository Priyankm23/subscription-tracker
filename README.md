# 📆 Subscription Tracker API
    2
    3 A full-featured **Node.js + Express** backend for tracking user subscriptions, sending
      automated **email renewal reminders** using **Upstash Workflows**, **Nodemailer**, and **Google
      OAuth** for authentication. Built with security using **Arcjet API protection**.
    4
    5 ## 📚 Table of Contents
    6
    7 - [🚀 Features](#-features)
    8 - [⚙️ Tech Stack](#️-tech-stac)
    9 - [🔑 API Authentication](#-api-authentication)
   10 - [📨 Email Reminder Logic](#-email-reminder-logic)
   11 - [🔐 Arcjet Integration](#-arcjet-integration)
   12 - [🛠️ Setup Instruction](#️-setup-instruction)
   13 - [📡 Testing with Ngrok](#-testing-with-ngrok)
   14 - [🧪 Testing with Postman](#-testing-with-postman)
   15 - [🔀 API Endpoints](#-api-endpoints)
   16 - [Roles & Permissions](#roles--permissions)
   17 - [📬 Contribution](#-contribution)
   18 - [📄 License](#-license)
   19 - [🧠 Credits](#-credits)
   20
   21 ---
   22
   23 ## 🚀 Features
   24
   25 - 🔐 **Google OAuth login** via Passport.js
   26 - 🧠 **Upstash Workflows** to automate email reminders before renewal dates
   27 - 📬 **Nodemailer** integration to send reminder emails
   28 - 🗓️ Create, update, cancel, and delete subscriptions
   29 - 👮 **Arcjet API protection** to secure routes from abuse and malicious access
   30 - 🧾 MongoDB + Mongoose for data storage
   31
   32 ---
   33
   34 ## ⚙️ Tech Stack
   35
   36 ### 🧰 Tech Stack
   37
   38 <p align="left">
   39   <img src=
      "https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"
      />
   40   <img src=
      "https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=whit
      e" />
   41   <img src=
      "https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white"
      />
   42   <img src=
      "https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white
      " />
   43   <img src=
      "https://img.shields.io/badge/Nodemailer-yellow?style=for-the-badge&logo=gmail&logoColor=white"
      />
   44   <img src=
      "https://img.shields.io/badge/Upstash-00DC82?style=for-the-badge&logo=upstash&logoColor=white"
      />
   45   <img src=
      "https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge&logo=passport&logoColor=bl
      ack" />
   46   <img src="https://img.shields.io/badge/Google
      OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white" />
   47   <img src=
      "https://img.shields.io/badge/Arcjet-000000?style=for-the-badge&logo=shield&logoColor=white" />
   48   <img src=
      "https://img.shields.io/badge/Day.js-FF2D20?style=for-the-badge&logo=javascript&logoColor=white
      " />
   49 </p>
   50
   51 ---
   52
   53 ## 🔑 API Authentication
   54
   55 - All routes require a valid **JWT** cookie.
   56 - Arcjet is used for **API rate-limiting and bot protection**.
   57 - Admin-only routes are guarded by role-based checks.
   58
   59 ---
   60
   61 ## 📨 Email Reminder Logic
   62
   63 - Reminder emails are sent:
   64   - 7 days before renewal
   65   - 5 days before
   66   - 2 days before
   67   - 1 day before
   68 - Powered by **Upstash Workflow**
   69 - Emails sent via **Nodemailer**
   70 - Uses `sleepUntil()` and `ctx.run()` for workflow steps
   71
   72 ---
   73
   74 ## 🔐 Arcjet Integration
   75
   76 - All protected routes use Arcjet middleware
   77 - DDoS prevention and token-based access management
   78 - Easy to extend with Arcjet dashboards and metrics
   79
   80 ---
   81
   82 ## 🛠️ Setup Instructions
   83
   84 ### 1. Clone the repo

  git clone https://github.com/Priyankm23/subscription-tracker.git
  cd subscription-tracker

   1
   2 ### 2. Install dependencies

  npm install


   1
   2 ### 3. Setup environment variables
   3
   4 Create a `.env` file in the root of the project and add the following variables:

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


   1
   2 **Note:** For local development, you can use `npx @upstash/qstash-cli dev` and switch to
     production tokens later.
   3
   4 ### 4. Run the App

  npm run dev

   1
   2 ---
   3
   4 ## 📡 Testing with Ngrok
   5
   6 For webhook or Upstash integration, you can use Ngrok to expose your local server to the
     internet.

  npx ngrok http 5000


    1
    2 Update `SERVER_URL` in your `.env` file with the generated public URL for Upstash to call your
      workflow.
    3
    4 ---
    5
    6 ## 🧪 Testing with Postman
    7
    8 - Use cookies to authenticate.
    9 - Add the `jwt` cookie manually or use the login flow.
   10 - Attach the `Authorization` header if needed for Arcjet headers.
   11
   12 ---
   13
   14 ## 🔀 API Endpoints
   15
   16 | Method | Path | Description |
   17 | --- | --- | --- |
   18 | POST | /api/v1/auth/register | Register a new user |
   19 | POST | /api/v1/auth/login | Login an existing user |
   20 | GET | /auth/google | Initiate Google OAuth |
   21 | GET | /auth/google/callback | Google OAuth callback |
   22 | GET | /api/v1/users | Get all users (Admin only) |
   23 | GET | /api/v1/users/:id | Get a single user (Admin only) |
   24 | POST | /api/v1/subscriptions | Create a new subscription |
   25 | GET | /api/v1/subscriptions | Get all subscriptions for the logged in user |
   26 | GET | /api/v1/subscriptions/:id | Get a single subscription |
   27 | PUT | /api/v1/subscriptions/:id | Update a subscription |
   28 | DELETE | /api/v1/subscriptions/:id | Delete a subscription |
   29 | POST | /api/v1/workflows/reminder | Trigger a reminder workflow |
   30
   31 ---
   32
   33 ### Roles & Permissions
   34
   35 - **User:** Can manage their own subscriptions.
   36 - **Admin:** Can view all subscriptions, upcoming renewals, and system-level actions.
   37
   38 ---
   39
   40 ### 📬 Contribution
   41
   42 PRs and issues are welcome! Please open one for bugs, ideas, or improvements.
   43
   44 ---
   45
   46 ### 📄 License
   47
   48 MIT License
   49
   50 ---
   51
   52 ### 🧠 Credits
   53
   54 - [Upstash QStash](https://upstash.com/qstash)
   55 - [Nodemailer](https://nodemailer.com)
   56 - [Arcjet](https://arcjet.com)
   57 - [Google Developers](https://developers.google.com)
