import dotenv from "dotenv";
import connectDB from "../backend/src/db/index.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { User } from "../backend/src/models/user.model.js";
import { Transaction } from "../backend/src/models/transaction.model.js";

dotenv.config({ path: './.env' });

const corsOptions = {
  origin: [
    'https://expense-tracker-nine-eosin-10.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = connectDB().then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default async function handler(req, res) {
  await dbConnect();

  // CORS middleware
  const reqOrigin = req.headers.origin;
  if (corsOptions.origin.includes(reqOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", reqOrigin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(","));
  res.setHeader("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(","));

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Express-like routing
  if (req.method === "POST" && req.url === "/register") {
    const { email, fullName, password } = req.body;
    try {
      const user = await User.findOne({ email: email.trim().toLowerCase() });
      if (user) return res.json({ message: "User with same email already exists." });
      await User.create({
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
        password: password.trim(),
      });
      return res.json({ message: "Success" });
    } catch (err) {
      return res.json({ message: err.message });
    }
  }

  if (req.method === "POST" && req.url === "/login") {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email.trim().toLowerCase() });
      if (!user) return res.json({ message: "No record found. Please register first." });
      const check = await user.isPasswordCorrect(password.trim());
      if (!check) return res.json({ message: "Wrong password" });

      const refreshToken = user.generateRefreshToken();
      const accessToken = user.generateAccessToken();
      user.refreshToken = refreshToken;
      await user.save();
      res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Strict`);
      const transaction = await Promise.all(user.transactionRecord.map(id => Transaction.findById(id)));
      const mappedTransaction = transaction.map(t => ({
        name: t?.name,
        amount: t?.amount,
        transactionType: t?.transactionType,
        isRecurring: t?.isRecurring,
        date: t?.date,
        categoryName: t?.categoryName,
        categoryColor: t?.categoryColor
      }));
      return res.json({
        message: "Login successful",
        accessToken,
        refreshToken,
        user: {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          transactionRecord: mappedTransaction
        }
      });
    } catch (err) {
      return res.json({ message: err.message });
    }
  }

  if (req.method === "POST" && req.url === "/logout") {
    try {
      const { fullName, email, transactions_string } = req.body;
      if (!fullName || !email || !transactions_string) {
        return res.status(400).json({
          message: "Missing required fields: fullName, email, or transactions_string"
        });
      }
      const userEmail = email.trim().toLowerCase();
      const userFullName = fullName.trim();
      let parsedTransactions = [];
      try {
        parsedTransactions = JSON.parse(transactions_string);
        if (!Array.isArray(parsedTransactions)) {
          return res.status(400).json({ message: "Transactions data must be an array." });
        }
      } catch (error) {
        return res.status(400).json({ message: "Invalid transactions data format." });
      }

      const validTransactions = [];
      for (let i = 0; i < parsedTransactions.length; i++) {
        const t = parsedTransactions[i];
        if (!t.name || t.amount == null || !t.date || !t.category) continue;
        if (!t.category.name || !t.category.color) continue;
        const amount = parseFloat(t.amount);
        if (isNaN(amount)) continue;
        const transactionDate = new Date(t.date);
        if (isNaN(transactionDate.getTime())) continue;
        validTransactions.push({
          name: t.name.toString().trim(),
          amount: amount,
          transactionType: t.isDebit ? 'debit' : 'credit',
          isRecurring: Boolean(t.isRecurring),
          date: transactionDate,
          categoryColor: t.category.color.toString().trim(),
          categoryName: t.category.name.toString().trim()
        });
      }

      if (validTransactions.length === 0) {
        return res.status(400).json({
          message: "No valid transactions found in the provided data."
        });
      }

      const insertedTransactions = await Transaction.insertMany(validTransactions);
      const transactionIds = insertedTransactions.map(t => t._id);

      res.setHeader('Set-Cookie', 'refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict');

      let user = await User.findOne({ email: userEmail });
      if (!user) {
        await User.create({
          email: userEmail,
          fullName: userFullName,
          password: "$2b$10$USgXelRakjf7mHntgcHjwuwBPADtsHCsQk08oBuNC/1vvFiJ70fFu",
          transactionRecord: transactionIds
        });
      } else {
        user.transactionRecord = transactionIds;
        await user.save();
      }

      res.status(200).json({
        message: "Logout successful",
        transactionsProcessed: validTransactions.length
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error during logout process"
      });
    }
  }

  // Fallback
  else {
    res.status(404).json({ message: "Not found" });
  }
}