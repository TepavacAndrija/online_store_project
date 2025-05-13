import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import cors from "cors"
import dotenv from "dotenv"
import productRoutes from "./routes/productRoutes.js"
import { sql } from "./config/db.js"

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors());
app.use(helmet())
app.use(morgan("dev"))

// apply arcjet rate-limit to every route

app.use(async (req,res) => {
    try {
        const decision = await aj.protect (req, {
            requested:1
        })

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                res.status(429).json({
                    error: "Too Many Requests"
                })
            }
            else if (decision.reason.isBot()){
                res.status(403).json({
                    error:"Bot Acces Denied"
                })
            }
            else{
                res.status(403).json({
                    error:"Forbidden"
                })
            }
            return
        }

        if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())){
            res.status(403).json({
                    error:"Spoofed Bot"
                })
        }

        next()
        
    } catch (error) {
        console.log("Error while applying arcjet",error)
        next(error)
    }
})

app.use("/api/products", productRoutes)

async function initDB(){
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                image VARCHAR(255) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `
        console.log("db init succesful")
    } catch (error) {
        console.log("initDB error", error)
    }
}

app.get("/", (req,res) => {
    res.send("backend works")
})

initDB().then( ()=>
    app.listen(PORT, () => {
        console.log("Server is running on port ",PORT)
})
)