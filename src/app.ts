import express from "express";
import ApiController from "./controllers/api.controller";
import Log from "./utils/log";

const app = express();

app.use(express.json());
app.use(ApiController.router);

app.listen(Number(process.env["APP_PORT"] || "7001"), () => {
    Log.info(`Server is running on port ${process.env["APP_PORT"] || "7001"}`);
});