import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import connectDB from "./config/db.js";
import authRoutes from "./routes/Auth.js";
import petitionRoutes from "./routes/petitionRoutes.js";
import pollRoutes from "./routes/pollRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();
const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// 1. Define an array of all allowed frontend URLs
const allowedOrigins = [
  process.env.CLIENT_URL, // Your local dev URL (e.g., http://localhost:5173)
  process.env.CLIENT_URL_PROD, // Your live Render frontend URL
];

app.use(
  cors({
    // 2. Update the origin function to check if the request origin is in the array
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman or mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/petitions", petitionRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
