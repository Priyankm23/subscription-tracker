import { config } from "dotenv"

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const {
    PORT,
    NODE_ENV,
    DB_URL,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    ARCJET_KEY,
    ARCJET_ENV,
    QSTASH_URL, QSTASH_TOKEN,
    SERVER_URL, EMAIL_PASSWORD,
    GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, 
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER
} = process.env