import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/web.js";
import mongoose from "mongoose";
import { rateLimit } from "./middleware/rateLimit.js";
import client from "prom-client"
dotenv.config();

const app = express();
app.use(rateLimit(120, 60 * 1000));
const port = process.env.PORT;

// Middleware to parse incoming JSON requests
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb" }));

// CORS configuration
const allowedOrigins = [
    "https://delightful-daifuku-a9f6ea.netlify.app",
    /https:\/\/deploy-preview-\d+--delightful-daifuku-a9f6ea\.netlify\.app/,
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (
                !origin ||
                allowedOrigins.some((o) =>
                    typeof o === "string" ? o === origin : o.test(origin)
                )
            ) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
    })
);

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
