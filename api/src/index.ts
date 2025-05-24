import  express from "express";
import dotenv from "dotenv";
import { orderRouter } from "./router/order";
import cors from "cors";
dotenv.config()


const app=express();
app.use(express.json());
app.use(cors());
const PORT=process.env.PORT||3001;

app.use('/api/v1/orders',orderRouter)

app.listen(PORT,()=>{
console.log(`server is listening at port ${PORT}`)
})


