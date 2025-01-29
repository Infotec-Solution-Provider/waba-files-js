import express from "express";
import ApiController from "./controllers/api.controller";

const app = express();

app.use(express.json());
app.use(ApiController.router);

app.listen(Number(process.env.APP_PORT || "7001"));