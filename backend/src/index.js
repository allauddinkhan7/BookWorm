import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
  path: "./.env",  // Add the dot before env
});
console.log("connecDB is calling")
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is runing at ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB conn is failed", err);
  });
