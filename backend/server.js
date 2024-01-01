import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import router from "./routes/web.js";
import mongoose from "mongoose";

dotenv.config()

const app = express();
const port = process.env.PORT

app.use(express.json({extended: true}))
app.use(cors())
app.use("/api", router)

app.get("/", (req, res)=>{
  res.send("TastyTrails Backend")
})
// Database Connection
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
