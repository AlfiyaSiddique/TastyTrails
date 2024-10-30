import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/web.js";
import mongoose from "mongoose";
import { rateLimit } from "./middleware/rateLimit.js";
import client from "prom-client";
dotenv.config();

const app = express();
app.use(rateLimit(120, 60 * 1000));
const port = process.env.PORT;

// Middleware to parse incoming JSON requests
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// CORS configuration
const allowedOrigins = [
  "https://delightful-daifuku-a9f6ea.netlify.app",
  /https:\/\/deploy-preview-\d+--delightful-daifuku-a9f6ea\.netlify\.app/,
  
  
];


app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no `origin` (like from Postman or server-side scripts)
            if (!origin || allowedOrigins.some((o) =>
                typeof o === "string" ? o === origin : o.test(origin)
            )) {
                callback(null, true);
            } else {
                // Provide a more informative error message if necessary
                callback(new Error("CORS policy: This origin is not allowed."));
            }
        },
    })
);

// app.use(cors({origin:"http://localhost:5173"})) // for local use

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no `origin` (like from Postman or server-side scripts)
      if (
        !origin ||
        allowedOrigins.some((o) =>
          typeof o === "string" ? o === origin : o.test(origin)
        )
      ) {
        callback(null, true);
      } else {
        // Provide a more informative error message if necessary
        callback(new Error("CORS policy: This origin is not allowed."));
      }
    },
  })
);

// app.use(cors({ origin: "http://localhost:5173" })) // for local use


const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({ register: client.register });

app.use("/api", router);

app.get("/", (_, res) => {
  res.send("TastyTrails Backend");
});

app.get("/ping", async (_, res) => {
  res.status(200).json({ message: "pong" });
});

app.get("/metrics", async (_, res) => {
  res.setHeader("Content-Type", client.register.contentType);
  const metrics = await client.register.metrics();
  res.send(metrics);
});

// Database Connection and server
try {
  await mongoose
    .connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully Connected To MongoDB Server!");

      app.listen(port, () => {
        console.log(`The server is running at ${process.env.PORT}`);
      });
    });
} catch (error) {
  console.log(error);
}
