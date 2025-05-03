import express from "express"
const app = express();
import cookieParser from "cookie-parser";

// without these two middlewares we cannot read FE data from req.body
// configuring limit for incoming JSON allowing only 16kb
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))//extended-> when storing nested objects

app.use(cookieParser())

//storing file and folder
app.use(express.static("public"))


import authRoutes from "./routes/authRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"
app.use("/api/auth", authRoutes) //   /api/auth/authRoutes
app.use("/api/books", bookRoutes) //   /api/books/bookRoutes


export   { app };
