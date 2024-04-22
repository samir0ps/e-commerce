import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { findOrCreateUser, findUserById } from "../userPrisma";

const strategy = GoogleStrategy.Strategy;

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.serializeUser((user: any, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id: string, done) => {
        const user = await findUserById(id);
        done(null, user);
    });

    passport.use(new strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/google/callback",
        passReqToCallback: true,
    },
    async (request: any, accessToken: any, refreshToken: any, profile: any, done: any) => {
        try {
            const user = await findOrCreateUser(profile.id, profile.firstName, profile.lastName, profile.email);
        if(!process.env.SecretKey){
            throw new Error("there's no secretKey")
        }

            const token = jwt.sign({ userId: user.id }, process.env.SecretKey, { expiresIn: "24h" });

            // Set JWT token in a cookie
            request.res.cookie("accessToken", token, {
                httpOnly: true,
                sameSite: "Strict", 
                maxAge: 24 * 60 * 60 * 1000, 
            });

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
}