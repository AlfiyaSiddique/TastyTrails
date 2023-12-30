import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express();
const port = process.env.PORT

// app.use(app.json())
app.use(cors())

app.get("/", (req, res)=>{
 res.send("TastyTrails Backend")
})

app.listen(port, ()=>{
  console.log(`The server is running at ${port}`)
})


