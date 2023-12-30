import express, {Request, Response} from "express"
import cors from "cors"

const app = express();

// app.use(app.json())
app.use(cors())

app.get("/", (req: Request, res: Response)=>{
 res.send("TastyTrails Backend")
})

app.listen(3000, (port: Number = 3000)=>{
  console.log(`The server is running at ${port}`)
})


