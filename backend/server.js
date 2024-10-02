import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import router from "./routes/web.js";
import mongoose from "mongoose";

dotenv.config()

const app = express();
const port = process.env.PORT

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));

const origin = "https://delightful-daifuku-a9f6ea.netlify.app"
// const origin = "http://localhost:5173"
app.use(cors({origin:origin }))
app.use("/api", router)

app.get("/", (req, res)=>{
  res.send("TastyTrails Backend")
})

// Database Connection and server
  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(()=>{
    console.log('Successfully Connected To MongoDB Server!')
    app.listen(port, ()=>{
      console.log(`The server is running at ${port}`)
    })
    })
  } catch (error) {
    console.log(error)
  }
