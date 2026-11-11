import "dotenv/config";
import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { Resend } from "resend";

const mongoClient = new MongoClient(process.env.MONGO_URI);

const database = mongoClient.db("studentplanner");
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    database: mongodbAdapter(database),

    emailAndPassword: {
    enabled: true,

    revokeSessionsOnPasswordReset: true,

    sendResetPassword: async ({ user, url }) => {
            const { data, error } = await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL,
                to: user.email,
                subject: "Reset your Student Planner password",
                html: `
                    <h2>Password Reset</h2>
                    <p>You requested to reset your Student Planner password.</p>
                    <p>Click the link below to choose a new password:</p>
                    <a href="${url}">Reset Password</a>
                    <p>If you did not request this, you can ignore this email.</p>
                `
            });

            if (error) {
                console.error("Error sending reset email:", error);
            }
        }
    },

    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: ["http://localhost:5173"],

    user: {
        changeEmail: {
            enabled: true,
            updateEmailWithoutVerification: true
        }
    }
})