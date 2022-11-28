// libs
import express from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";
import log4js from "log4js";
import path from "path";

// middlewares
import cors from "cors";
import cookieParser from "cookie-parser";
// routers
import AuthRouter from "./routers/AuthRouter";
import UserRouter from "./routers/UserRouter";
import LinksRouter from "./routers/LinksRouter";
import ErrorsMiddleware from "./middlewares/ErrorsMiddleware";

// configuration
dotenv.config();
const app = express();
const port = process.env.PORT;
export const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL;
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: [process.env.CLIENT_URL, "http://192.168.0.190:3000", "http://192.168.0.183:3000"] }));
app.use(express.static(path.resolve(__dirname, "static")));

app.use("/api", AuthRouter);
app.use("/api", UserRouter);
app.use("/api", LinksRouter);
app.use(ErrorsMiddleware);
async function start() {
  try {
    await connect(process.env.DB_URL);
    console.clear();
    app.listen(port, () => console.log(`Running on address http://localhost:${port}`));
  } catch (error) {
    console.error(error);
  }
}

start();
