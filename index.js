import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { productRouter } from "./routes/productRoutes.js";
import { categoriesRouter } from "./routes/categoriesRouter.js";


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/p",productRouter)
app.use("/c",categoriesRouter)

app.get("/test", (_, res) => res.send("app working fine"));
app.listen(2300 , () => console.log("app started on 2300"));
