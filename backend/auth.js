import "dotenv/config";
import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoClient = new MongoClient(process.env.MONGO_URI);

const database = mongoClient.db("studentplanner");

export const auth = betterAuth({
    database: mongodbAdapter(database),

    emailAndPassword: {
        enabled: true
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